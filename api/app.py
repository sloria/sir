from aiohttp import web
from aiohttp_utils import negotiation, path_norm
import aiohttp_cors

from .config import Config
from . import settings
from . import routes

##### App factory #####

def create_app(settings_obj=None):
    settings_obj = settings_obj or settings
    config = Config()
    config.from_object(settings_obj)

    app = web.Application(debug=config.DEBUG)
    app['config'] = config

    # Set up routes
    # Enable CORS for all routes
    cors = aiohttp_cors.setup(app)
    for route in routes.routes:
        method, url, handler = route
        full_url = '{prefix}/{url}'.format(prefix=config.URL_PREFIX.rstrip('/'), url=url.lstrip('/'))
        cors.add(
            app.router.add_route(method, full_url, handler),
            {
                '*': aiohttp_cors.ResourceOptions(
                    allow_credentials=True, expose_headers='*', allow_headers='*'
                )
            }

        )

    # Use content negotiation middleware to render JSON responses
    negotiation.setup(app)
    # Normalize paths: https://aiohttp-utils.readthedocs.org/en/latest/modules/path_norm.html
    path_norm.setup(app)

    return app

# gunicorn api.app:app --bind localhost:8080 --worker-class aiohttp.worker.GunicornWebWorker
app = create_app()
