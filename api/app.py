from aiohttp import web
from aiohttp_utils import negotiation, path_norm

from .config import Config
from . import settings
from . import routes

##### App factory #####

def create_app(settings_obj=None):
    settings_obj = settings_obj or settings
    config = Config()
    config.from_object(settings_obj)
    app = web.Application(debug=config.DEBUG)
    # Store configuration as uppercased keys on app
    app.update(config)

    # Set up routes
    routes.setup(app)
    # Use content negotiation middleware to render JSON responses
    negotiation.setup(app)
    # Normalize paths: https://aiohttp-utils.readthedocs.org/en/latest/modules/path_norm.html
    path_norm.setup(app)

    return app

# gunicorn api.app:app --bind localhost:8080 --worker-class aiohttp.worker.GunicornWebWorker
app = create_app()
