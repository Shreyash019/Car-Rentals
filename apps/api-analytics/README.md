# api-analytics (Golang)

This is a simple analytics backend service written in Go, integrated into the Nx monorepo under `apps/api-analytics`.

## Development

```sh
cd apps/api-analytics
go run main.go
```

## Build

```sh
cd apps/api-analytics
go build -o api-analytics main.go
```

## Docker

Build and run the Docker image:

```sh
docker build -t api-analytics ./apps/api-analytics
docker run -p 8080:8080 api-analytics
```

## Endpoints
- `GET /healthz` — Health check
- `GET /analytics` — Example analytics endpoint
