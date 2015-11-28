from envparse import env

env.read_envfile()  # Read .env

ENV = env('NODE_ENV')
DEBUG = ENV != 'production'

CACHE = {
    'STRATEGY': 'redis',
    'PARAMS': {
        'host': env('REDIS_HOST', default='localhost'),
        'port': env.int('REDIS_PORT', default=6379),
    }
}

ROUTES = {
    'URL_PREFIX': '/v1/'
}

GITHUB = {
    'CLIENT_ID': env('SIR_GITHUB_CLIENT_ID'),
    'CLIENT_SECRET': env('SIR_GITHUB_CLIENT_SECRET'),
}
