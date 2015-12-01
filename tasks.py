import sys

from invoke import task, run


@task
def server(port=5000, reload=True):
    """Run the development server"""
    command = (
        'gunicorn "api.app:create_app()" -w 4 '
        '--bind 0.0.0.0:{port} --worker-class aiohttp.worker.GunicornWebWorker'
    ).format(port=port)
    if reload:
        command += ' --reload'
    run(command, echo=True)

@task
def test(clean=False):
    """Run the tests."""
    import pytest
    if clean:
        clean()
    flake()
    retcode = pytest.main(['api'])
    sys.exit(retcode)

@task
def flake():
    """Run flake8 on the codebase"""
    run('flake8 api', echo=True)

@task
def clean():
    """Clear out __pycache__ directories."""
    run("find . -path '*/__pycache__/*' -delete", echo=True)
    print("Cleaned up.")
