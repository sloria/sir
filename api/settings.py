from envparse import env

env.read_envfile()  # Read .env

ENV = env('NODE_ENV')
DEBUG = ENV != 'production'
PORT = env.int('APIPORT', default=3030)
URL_PREFIX = '/v1/'

GITHUB_CLIENT_ID = env('SIR_GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = env('SIR_GITHUB_CLIENT_SECRET')
