from . import handlers

routes = [
    ('GET', '/repos/', handlers.repos),
]
