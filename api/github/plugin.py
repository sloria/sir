"""aiohttp plugin that reads app configuration and stores a
GitHubClient object on app['client'].

If using caching, the caching plugin MUST be set up before
setting up this plugin.
"""
from .client import GitHubClient
from api.cache import APP_KEY as CACHE_APP_KEY

CONFIG_KEY = 'GITHUB'
APP_CLIENT_KEY = 'github_client'

def setup(app):
    config = app.get(CONFIG_KEY, {})
    cache = app.get(CACHE_APP_KEY)
    client = GitHubClient(
        config.get('CLIENT_ID'),
        config.get('GITHUB_CLIENT_SECRET'),
        cache=cache
    )
    app[APP_CLIENT_KEY] = client
