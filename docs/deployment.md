# Deployment

## API server

```shell
eval "$(docker-machine env sir-prod)"
docker-compose build
docker-compose up
```

## Client-side app

```shell
npm run deploy
```
