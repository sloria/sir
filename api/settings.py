import os

ENV = os.environ.get('NODE_ENV')
DEBUG = ENV != 'production'
PORT = os.environ.get('APIPORT', 3030)
