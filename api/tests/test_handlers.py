from unittest import mock

import pytest
from webtest_aiohttp import TestApp
from api.github.client import GitHubClientError
from api.tests.conftest import BaseMockGitHubClient


class MockGitHubClient(BaseMockGitHubClient):

    async def repo_tags(self, *args, **kwargs):
        return [
            {'name': '1.2.3', 'commit': {'sha': '123abc'}},
            {'name': '1.2.2', 'commit': {'sha': 'abc123'}},
        ]

    async def compare(self, *args, **kwargs):
        return {
            'ahead_by': 42,
            'base_commit': {'sha': '123abc'}
        }

class MockGitHubErrorClient(BaseMockGitHubClient):

    async def repo_tags(self, *args, **kwargs):
        mock_resp = mock.Mock()
        mock_resp.status = 400
        raise GitHubClientError({'error': 'Something went wrong'}, mock_resp)

@pytest.fixture()
def app(make_app):
    return make_app(github=MockGitHubClient('id', 'secret'))

@pytest.fixture()
def client(app):
    return TestApp(app)

@pytest.fixture()
def error_app(make_app):
    return make_app(github=MockGitHubErrorClient('id', 'secret'))

@pytest.fixture()
def error_client(error_app):
    return TestApp(error_app)


class TestIndex:

    def test_index(self, client):
        res = client.get('/v1/')
        assert res.status_code == 200
        assert res.json['message'] == 'Welcome to the sir API'
        assert 'should_i_release' in res.json['links']

class TestShouldIRelease:

    def test_success(self, client):
        res = client.get('/v1/should_i_release/sloria/fakerepo/')
        assert res.status_code == 200

        assert res.json['latest_tag'] == '1.2.3'
        assert res.json['ahead_by'] == 42
        assert res.json['should_release'] is True
        assert res.json['base_commit_sha'] == '123abc'

    def test_handling_github_api_error(self, error_client):
        res = error_client.get('/v1/should_i_release/sloria/fakerepo/', expect_errors=True)
        assert res.status_code == 400
        assert res.json == {'error': 'Something went wrong'}
