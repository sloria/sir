#!/bin/bash
set -e
export REDIS_HOST=redis
export REDIS_PORT=6379
export APIPORT=5000
exec "$@"
