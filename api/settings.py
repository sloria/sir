import os

ENV = os.environ.get('NODE_ENV')
DEBUG = ENV != 'production'
PORT = os.environ.get('APIPORT', 3030)
URL_PREFIX = '/v1/'

GITHUB_CLIENT_ID = os.environ.get('SIR_GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.environ.get('SIR_GITHUB_CLIENT_SECRET')
