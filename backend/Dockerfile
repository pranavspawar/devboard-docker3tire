FROM golang:1.22-alpine

WORKDIR /app

COPY go.mod go.sum ./ 

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o devboard-backend .

RUN adduser -D -u 10001 app && chown -R app:app /app

USER app

EXPOSE 8080

ENTRYPOINT ["./devboard-backend"]
