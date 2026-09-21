# flask-demo-app

Small Flask app for practicing Docker + AWS ECS (Fargate) deployment. Listens on port 8080.

## Endpoints
- `/` hello message
- `/health` health check
- `/info` container info

## Run with Docker
```bash
docker build -t flask-app .
docker run --rm -p 8080:8080 flask-app
curl http://localhost:8080
```
