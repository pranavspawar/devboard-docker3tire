
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Update OS packages
RUN apk update && apk upgrade --no-cache

# Copy dependency files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" \
    -o devboard-backend .

# -------------------------
# Runtime Stage
# -------------------------
FROM alpine:latest

# Update packages
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Create non-root user
RUN addgroup -S app && \
    adduser -S -G app -u 10001 app

# Copy binary
COPY --from=builder /app/devboard-backend .

# Use non-root user
USER app

EXPOSE 8080

ENTRYPOINT ["./devboard-backend"]