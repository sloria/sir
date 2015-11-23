from api.cache import get_cache_key

def test_get_cache_key():
    assert get_cache_key('foo', {'bar': 42}) == get_cache_key('foo', {'bar': 42})
    assert get_cache_key('foo', {}) == get_cache_key('foo', {})

    assert(
        get_cache_key('foo', {'a': 1, 'b': 2, 'c': 3, 'd': 4}) ==
        get_cache_key('foo', {'b': 2, 'a': 1, 'c': 3, 'd': 4})
    )

    assert get_cache_key('foo', {}) != get_cache_key('boo', {})
    assert get_cache_key('foo', {'a': 1}) != get_cache_key('foo', {'a': 2})
    assert get_cache_key('foo', {'a': 1}) != get_cache_key('foo', {'b': 1})
