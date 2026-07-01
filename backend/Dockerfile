
# Build Stage
FROM golang:1.23-alpine3.20 AS builder

WORKDIR /app

# Update OS packages to latest patches
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache ca-certificates=20260413-r0 tzdata=2026b-r0

# Copy dependency files
COPY go.mod go.sum ./

# Download dependencies with verification
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Build static binary with hardening flags
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath \
    -ldflags="-s -w -X main.Version=$(git describe --tags --always --dirty 2>/dev/null || echo 'unknown')" \
    -o devboard-backend .

# -------------------------
# Runtime Stage
# -------------------------
FROM alpine:3.21

# Update packages and add minimal runtime dependencies
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache ca-certificates=20260413-r0 tzdata=2026b-r0 && \
    apk del apk-tools && \
    rm -rf /var/cache/apk/* /var/lib/apk/lists/*

WORKDIR /app

# Create non-root user with minimal privileges
RUN addgroup -g 10001 -S app && \
    adduser -u 10001 -S -G app -s /sbin/nologin -D app

# Copy binary from builder
COPY --from=builder --chown=app:app /app/devboard-backend .
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Set read-only filesystem where possible
RUN chmod 755 /app && chmod 755 devboard-backend

# Use non-root user
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

ENTRYPOINT ["./devboard-backend"]