# Command: deploy:setup

**Command:** `deploy:setup [platform]`
**Agent:** devops-cicd
**Version:** 5.2.0

---

## 🎯 Purpose

Setup deployment configuration for various platforms (Vercel, AWS, GCP, Azure, Docker, Kubernetes).

---

## 📋 Usage

```bash
# Auto-detect and setup
deploy:setup

# Specific platform
deploy:setup --platform vercel
deploy:setup --platform aws
deploy:setup --platform docker
deploy:setup --platform kubernetes
```

---

## 🔧 Supported Platforms

### Vercel (Web Apps)
- Next.js, React, Vue
- Auto-generated vercel.json
- Environment variables setup
- Domain configuration

### AWS
- **ECS:** Docker containers
- **EC2:** Virtual machines
- **Lambda:** Serverless functions
- **S3 + CloudFront:** Static sites

### GCP
- **Cloud Run:** Containers
- **App Engine:** Web apps
- **Cloud Functions:** Serverless
- **Cloud Storage + CDN:** Static

### Azure
- **App Service:** Web apps
- **Container Instances:** Docker
- **Functions:** Serverless
- **Storage + CDN:** Static

### Docker + Kubernetes
- Dockerfile generation
- K8s manifests
- Helm charts

---

## 📊 Deliverables

- Platform-specific configuration files
- Deployment scripts
- Environment variable templates
- CI/CD integration
- Deployment guide

---

**Example Output (Vercel):**

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "API_KEY": "@api-key"
  }
}
```

---

**Command:** deploy:setup
**Version:** 5.2.0
