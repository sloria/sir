from aiohttp_utils import Response
from .github.client import GitHubClientError
from .github.process import RepoProcessor

async def index(request):
    return Response({
        'message': 'Welcome to the sir API',
        'links': {
            'should_i_release': request.app.router['should_i_release'].url(
                parts=dict(username=':username', repo=':repo')
            ),
        }
    })


async def should_i_release(request):
    client = request.app['github_client']
    processor = RepoProcessor(client)
    username = request.match_info['username']
    repo = request.match_info['repo']
    try:
        comparison_json = await processor.get_comparison_since_last_release(username, repo)
    except GitHubClientError as err:
        return Response(err.body, status=err.response.status)

    ahead_by = comparison_json['ahead_by']
    return Response({
        'username': username,
        'repo': repo,
        'should_release': bool(ahead_by),
        'ahead_by': ahead_by,
        'base_commit_sha': comparison_json['base_commit']['sha'],
        'latest_tag': comparison_json['latest_tag']
    })
