from . import handlers

routes = [
    ('GET', '/should_i_release/{username}/{repo}/', handlers.should_i_release),
]
