# Deployment

## API server

```shell
eval "$(docker-machine env sir-prod)"
docker-compose build
docker-compose up -d
```

## Client-side app

```shell
npm run deploy
```
