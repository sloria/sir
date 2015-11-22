import aiohttp_cors

from . import handlers

CONFIG_KEY = 'ROUTES'

ROUTES = [
    ('GET', '/should_i_release/{username}/{repo}/', handlers.should_i_release),
]


def setup(app, url_prefix=''):
    """Set up routes. Enables CORS."""
    # Enable CORS for all routes
    cors = aiohttp_cors.setup(app)
    config = app.get(CONFIG_KEY, {})
    url_prefix = config.get('URL_PREFIX', url_prefix)
    for route in ROUTES:
        method, url, handler = route
        full_url = '{prefix}/{url}'.format(prefix=url_prefix.rstrip('/'), url=url.lstrip('/'))
        cors.add(
            app.router.add_route(method, full_url, handler),
            {
                '*': aiohttp_cors.ResourceOptions(
                    allow_credentials=True, expose_headers='*', allow_headers='*'
                )
            }

        )
