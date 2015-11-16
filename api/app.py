from aiohttp import web
from aiohttp_utils import negotiation
from aiohttp_utils.routing import add_route_context
import aiohttp_cors

from .config import Config
from . import settings
from . import routes

##### App factory #####

def create_app():
    config = Config()
    config.from_object(settings)

    app = web.Application(debug=config.DEBUG)
    app['config'] = config

    # Enable CORS for all routes
    cors = aiohttp_cors.setup(app)
    with add_route_context(app, url_prefix=config.URL_PREFIX) as add_route:
        for route in routes.routes:
            cors.add(
                add_route(*route),
                {
                    '*': aiohttp_cors.ResourceOptions(
                        allow_credentials=True, expose_headers='*', allow_headers='*'
                    )
                }

            )

    # Use content negotiation middleware to render JSON responses
    negotiation.setup(app)

    return app

# gunicorn api.app:app --bind localhost:8080 --worker-class aiohttp.worker.GunicornWebWorker
app = create_app()
