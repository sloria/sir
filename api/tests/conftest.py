"""Test utilities and pytest fixtures."""
import asyncio
import os
import sys

import pytest
from decorator import decorator

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))

from api.app import create_app
from api.github.client import GitHubClient

class TestConfig:
    ENV = 'testing'
    DEBUG = True
    CACHE = {'STRATEGY': 'simple', 'PARAMS': {}}


class BaseMockGitHubClient(GitHubClient):

    # Stub out request method
    async def make_request(self, **kwargs):
        pass

    async def repo_tags(self, username, repo):
        raise NotImplementedError

    async def user_repos(self, username, sort='pushed'):
        raise NotImplementedError

    async def compare(self, username: str, repo: str, base: str, head='HEAD'):
        raise NotImplementedError

    async def rate_limit(self):
        raise NotImplementedError

@pytest.fixture()
def make_app():
    def maker(github=None):
        app = create_app(TestConfig)
        # Prevent any inadvertent requests
        app['github'] = github or BaseMockGitHubClient('id', 'secret')
        return app
    return maker

@decorator
def async_test(func, *args, **kwargs):
    future = func(*args, **kwargs)
    asyncio.get_event_loop().run_until_complete(future)
