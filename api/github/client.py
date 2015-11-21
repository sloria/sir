"""Async client for GitHub API v3."""
import aiohttp

API_URL = 'https://api.github.com'

class GitHubClientError(Exception):
    def __init__(self, body, response):
        self.body = body
        self.response = response

class GitHubClient:

    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret

    async def make_request(self, url, method='get', **kwargs):
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

        full_url = '{API_URL}/{url}'.format(API_URL=API_URL, url=url)
        async with aiohttp.request(method.upper(), full_url, **kwargs) as resp:
            json = await resp.json()
            if 200 <= resp.status < 400:
                return json
            else:
                raise GitHubClientError(json, resp)

    async def user_repos(self, username, sort='pushed'):
        return await self.make_request(
            '/users/{username}/repos'.format(username=username),
            params={'sort': sort}
        )

    async def repo_tags(self, username: str, repo: str):
        return await self.make_request(
            '/repos/{username}/{repo}/tags'.format(
                username=username, repo=repo
            )
        )

    async def compare(self, username: str, repo: str, base: str, head='HEAD'):
        return await self.make_request(
            '/repos/{username}/{repo}/compare/{base}...{head}'.format(**locals())
        )

    async def rate_limit(self):
        return await self.make_request('/rate_limit')
