from aiohttp_utils import Response

async def repos(request):
    return Response([
        'sloria/TextBlob',
        'marshmallow-code/marshmallow',
    ])

