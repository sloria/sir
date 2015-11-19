# https://github.com/CenterForOpenScience/waterbutler/blob/13316884fb328b0ba3d96c0a2856ca05c427459a/tests/conftest.py
import asyncio
import os
import sys

from decorator import decorator

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))

@decorator
def async_test(func, *args, **kwargs):
    future = func(*args, **kwargs)
    asyncio.get_event_loop().run_until_complete(future)
