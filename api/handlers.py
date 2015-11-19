from aiohttp_utils import Response
from .github.client import GitHubClient, GitHubClientError
from .github.process import RepoProcessor

async def should_i_release(request):
    config = request.app['config']
    client = GitHubClient(config.GITHUB_CLIENT_ID, config.GITHUB_CLIENT_SECRET)
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
    })
