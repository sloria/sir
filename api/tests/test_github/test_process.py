from unittest import mock
import json
import os

import pytest

from api.github.client import GitHubClient
from api.github import process
from api.tests.conftest import async_test


HERE = os.path.dirname(os.path.abspath(__file__))

def patch_client_method_with_response(client_method, json_file):
    client_import_path = 'api.github.client.GitHubClient'
    mock_method = mock.patch('.'.join([client_import_path, client_method]))
    with open(os.path.join(HERE, 'responses', json_file)) as fp:
        mock_method.return_value = json.load(fp)
    return mock_method

@pytest.fixture(autouse=True)
def mock_responses():
    patch_client_method_with_response('user_repos', 'user_repos.json')
    patch_client_method_with_response('repo_tags', 'repo_tags.json')
    patch_client_method_with_response('compare', 'compare.json')


class TestRepoProcessor:

    @pytest.fixture()
    def client(self):
        return GitHubClient('myid', 'mysecret')

    @pytest.fixture()
    def processor(self, client):
        return process.RepoProcessor(client)

    @async_test
    async def test_get_comparison_since_last_release(self, processor):
        result = await processor.get_comparison_since_last_release('marshmallow-code', 'marshmallow')
        assert type(result) is dict
        assert 'ahead_by' in result
