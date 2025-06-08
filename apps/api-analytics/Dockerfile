# ---- Build stage ----
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY apps/api-analytics/go.mod ./
COPY . .
RUN go build -o api-analytics apps/api-analytics/main.go

# ---- Production stage ----
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/api-analytics ./api-analytics
ENV PORT=4011
EXPOSE 4011
CMD ["./api-analytics"]
