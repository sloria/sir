"""Async client for GitHub API v3."""
from http import HTTPStatus
import logging

import aiohttp
from werkzeug.contrib.cache import BaseCache

from api.cache import get_cache_key

logger = logging.getLogger(__name__)

API_URL = 'https://api.github.com'

class GitHubClientError(Exception):
    def __init__(self, body, response):
        self.body = body
        self.response = response

class GitHubClient:

    def __init__(self, client_id: str, client_secret: str, cache: BaseCache=None):
        self.client_id = client_id
        self.client_secret = client_secret
        if not cache:
            logger.warning('No caching enabled for GitHubClient')
        self.cache = cache

    async def make_request(self, url, method='get', cache_key: str=None, **kwargs):
        url = url.lstrip('/')

        kwargs.setdefault('params', {})
        kwargs['params'].update({
            'client_id': self.client_id,
            'client_secret': self.client_secret,
        })

        kwargs.setdefault('headers', {})
        kwargs['headers'].update({
            'User-Agent': 'sir',
            'Accept': 'application/vnd.github.v3+json',
        })

        if self.cache:
            etag = (self.cache.get(cache_key) or {}).get('etag')
            if etag:
                kwargs['headers']['If-None-Match'] = etag

        full_url = '{API_URL}/{url}'.format(API_URL=API_URL, url=url)
        async with aiohttp.request(method.upper(), full_url, **kwargs) as resp:
            if resp.status >= 400:
                json = await resp.json()
                raise GitHubClientError(json, resp)
            else:
                if self.cache and resp.status == HTTPStatus.NOT_MODIFIED:
                    logger.info('Cache HIT for {}; Etag: {}'.format(url, etag))
                    return self.cache.get(cache_key)['response']
                else:
                    json = await resp.json()
                    new_etag = resp.headers.get('ETag')
                    logger.info('Cache MISS for {}'.format(url))
                    if new_etag and self.cache:
                        cache_payload = {
                            'etag': new_etag,
                            'response': json
                        }
                        logger.info('Caching etag and response: {}'.format(new_etag))
                        self.cache.set(cache_key, cache_payload)
                    return json

    async def user_repos(self, username: str, sort: str='pushed'):
        cache_key = get_cache_key('user_repos', {
            'username': username,
            'sort': sort
        })
        return await self.make_request(
            '/users/{username}/repos'.format(username=username),
            params={'sort': sort},
            cache_key=cache_key
        )

    async def repo_tags(self, username: str, repo: str):
        cache_key = get_cache_key('repo_tags', {
            'username': username,
            'repo': repo
        })
        return await self.make_request(
            '/repos/{username}/{repo}/tags'.format(
                username=username, repo=repo
            ),
            cache_key=cache_key
        )

    async def compare(self, username: str, repo: str, base: str, head='HEAD'):
        cache_key = get_cache_key('compare', {
            'username': username,
            'repo': repo,
            'base': base,
            'head': head,
        })
        return await self.make_request(
            '/repos/{username}/{repo}/compare/{base}...{head}'.format(**locals()),
            cache_key=cache_key
        )

    async def rate_limit(self):
        return await self.make_request('/rate_limit')
