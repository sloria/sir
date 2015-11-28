#!/bin/sh
/usr/local/bin/gunicorn api.app:app -w 4 --bind 0.0.0.0:5000 --worker-class aiohttp.worker.GunicornWebWorker --chdir=/usr/src/app
