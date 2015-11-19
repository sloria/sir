from .client import GitHubClient


class RepoProcessor:

    def __init__(self, client: GitHubClient):
        self.client = client

    async def get_comparison_since_last_release(self, username: str, repo: str):
        tags_json = await self.client.repo_tags(username, repo)
        if not tags_json:
            return None
        latest_tag_sha = tags_json[0]['commit']['sha']

        comparison_json = await self.client.compare(
            username,
            repo,
            base=latest_tag_sha,
            head='HEAD'
        )
        return comparison_json
