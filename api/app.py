from aiohttp import web
from aiohttp_utils import run, negotiation, Response
from aiohttp_utils.routing import add_route_context
import aiohttp_cors

from .config import Config
from . import settings

##### Handlers #####

async def repos(request):
    return Response([
        'sloria/TextBlob',
        'marshmallow-code/marshmallow',
    ])

##### App factory #####

def create_app():
    config = Config()
    config.from_object(settings)

    app = web.Application(debug=config.DEBUG)
    app['config'] = config

    # Enable CORS
    cors = aiohttp_cors.setup(app)

    with add_route_context(app, url_prefix='/v1/') as route:
        cors.add(
            route('GET', '/repos/', repos),
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

if __name__ == "__main__":
    run(app, app_uri='api.app:app', reload=True, port=app['config'].PORT)
