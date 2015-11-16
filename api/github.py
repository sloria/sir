API_URL = "https://api.github.com"

def gh_request(path, method="GET", etag=None, **params):
    # Build the URL, header, and parameter set.
    url = API_URL + path
    headers = {
        "User-Agent": "osrc",
        "Accept": "application/vnd.github.v3+json",
    }
    if etag is not None:
        headers["If-None-Match"] = etag
    params["client_id"] = params.get(
        "client_id", flask.current_app.config["GITHUB_ID"])
    params["client_secret"] = params.get(
        "client_secret", flask.current_app.config["GITHUB_SECRET"])

    # Execute the request.
    r = requests.get(url, headers=headers, params=params)
    return r
