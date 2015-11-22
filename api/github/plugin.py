from .client import GitHubClient

CONFIG_KEY = 'GITHUB'
APP_KEY = 'github'

def setup(app):
    config = app.get(CONFIG_KEY, {})
    client = GitHubClient(config.get('CLIENT_ID'), config.get('GITHUB_CLIENT_SECRET'))
    app[APP_KEY] = client
