"""Caching plugin that uses werkzeug.contrib.cache.

When `setup` is called on an app, a :`BaseCache` object
stored on app['cache'].
"""
from werkzeug.contrib.cache import RedisCache, SimpleCache

# Key on app['config'] to get cache configuration
CONFIG_KEY = 'CACHE'
# Key to store the cache object
APP_KEY = 'cache'

STRATEGIES = {
    'simple': SimpleCache,
    # TODO: Implement a class that uses aioredis
    'redis': RedisCache,
}

DEFAULTS = {
    'STRATEGY': 'redis',
    'PARAMS': {
        'host': 'localhost',
        'port': 6379,
    }
}

KWARG_MARK = object()

def get_cache_key(name: str, kwargs: dict):
    key_parts = [name]
    if kwargs:
        key_parts.append(KWARG_MARK)
        key_parts.extend(sorted(kwargs.items()))
    return str(hash(tuple(key_parts)))


def setup(app, *, strategy=DEFAULTS['STRATEGY'], params=DEFAULTS['PARAMS']):
    config = app.get(CONFIG_KEY, {})
    cache_strategy = config.get('STRATEGY', strategy)
    params = config.get('PARAMS', params)

    cache_class = STRATEGIES[cache_strategy]
    cache = cache_class(**params)
    app[APP_KEY] = cache
    return app
