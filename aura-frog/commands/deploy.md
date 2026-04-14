# Deploy Commands

Deployment setup, CI/CD pipeline generation, and Docker configuration. Supports Vercel, AWS, GCP, Azure, Docker, and Kubernetes.

---

## /deploy setup

**Trigger:** `/deploy setup [platform]`

Setup deployment configuration. Auto-detects project type or specify platform: Vercel (Next.js/React/Vue), AWS (ECS/EC2/Lambda/S3+CloudFront), GCP (Cloud Run/App Engine/Cloud Functions), Azure (App Service/Container Instances/Functions), Docker + Kubernetes (Dockerfile/K8s manifests/Helm charts). Generates platform-specific config files, deployment scripts, environment variable templates, and deployment guide.

**Usage:** `/deploy setup --platform vercel`, `/deploy setup --platform kubernetes`

---

## /deploy cicd-create

**Trigger:** `/deploy cicd-create [platform]`

Generate CI/CD pipeline configuration. Supports GitHub Actions, GitLab CI, Azure Pipelines, CircleCI. Pipeline stages: lint + format, test (unit/integration/e2e), security (dependency scan/secret scan/container scan), build (app + Docker image + push to registry), deploy (staging auto, production manual with health check). Auto-detects platform or specify with `--platform`.

**Usage:** `/deploy cicd-create --platform github`, `/deploy cicd-create --platform gitlab`

---

## /deploy docker-create

**Trigger:** `/deploy docker-create [options]`

Generate optimized Dockerfile and docker-compose.yml. Dockerfile features: multi-stage build, minimal base image (Alpine/Distroless), non-root user, health check, .dockerignore. Docker-compose includes app service plus database/Redis services as needed, with volume mounts and environment variables. Supports `--compose` and `--multi-stage` flags.

**Usage:** `/deploy docker-create --compose --multi-stage`

---

## Related

- **Agent:** `devops` (PID 08)
