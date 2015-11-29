import json
import os

import pytest

from api.github import process
from api.tests.conftest import async_test, BaseMockGitHubClient

HERE = os.path.dirname(os.path.abspath(__file__))

class MockGitHubClient(BaseMockGitHubClient):

    def _response_from_file(self, json_file):
        with open(os.path.join(HERE, 'responses', json_file)) as fp:
            ret = json.load(fp)
        return ret

    async def repo_tags(self, *args, **kwargs):
        return self._response_from_file('repo_tags.json')

    async def user_repos(self, *args, **kwargs):
        return self._response_from_file('user_repos.json')

    async def compare(self, *args, **kwargs):
        return self._response_from_file('compare.json')


class TestRepoProcessor:

    @pytest.fixture()
    def client(self):
        return MockGitHubClient('myid', 'mysecret')

    @pytest.fixture()
    def processor(self, client):
        return process.RepoProcessor(client)

    @async_test
    async def test_get_comparison_since_last_release(self, processor):
        result = await processor.get_comparison_since_last_release('marshmallow-code', 'marshmallow')
        assert type(result) is dict
        assert 'ahead_by' in result
