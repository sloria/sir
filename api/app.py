from aiohttp import web
from aiohttp_utils import negotiation, path_norm

from .config import Config
from . import settings
from . import routes
from .github import plugin as github_plugin

##### App factory #####

def create_app(settings_obj=None) -> web.Application:
    """App factory. Sets up routes and all plugins.

    :param settings_obj: Object containing optional configuration overrides. May be
        a Python module or class with uppercased variables.
    """
    settings_obj = settings_obj or settings
    config = Config()
    config.from_object(settings)
    if settings_obj:  # Update with overrides
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
    # Set up Github client
    github_plugin.setup(app)

    return app

# gunicorn api.app:app --bind localhost:8080 --worker-class aiohttp.worker.GunicornWebWorker
app = create_app()
