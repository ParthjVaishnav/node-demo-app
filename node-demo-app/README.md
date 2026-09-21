# node-ecs-demo

Simple Node.js (Express) app for practicing Docker, ECR and ECS on AWS.

Endpoints:
- `/`       -> hello message
- `/health` -> health check (JSON)
- `/info`   -> hostname, node version, env value

---

## 1. Push to GitHub (on your laptop)

```bash
cd node-ecs-demo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/node-ecs-demo.git
git push -u origin main
```

## 2. Set up the EC2 instance (Amazon Linux 2023)

Launch a `t3.micro` (or t2.micro). In its Security Group allow:
- SSH (22) from your IP
- Custom TCP 3000 from your IP (for testing)

Attach an IAM role to the instance with the policy
`AmazonEC2ContainerRegistryPowerUser` (so it can push to ECR without keys).

SSH in, then:

```bash
sudo dnf install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
exit            # log out and SSH back in so the group applies
```

## 3. Clone, build and run

```bash
git clone https://github.com/<your-username>/node-ecs-demo.git
cd node-ecs-demo

docker build -t node-ecs-demo .
docker run -d --name demo -p 3000:3000 -e APP_ENV=dev node-ecs-demo

curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/info
```

From your browser: `http://<EC2-public-IP>:3000`

Useful commands:
```bash
docker ps
docker logs demo
docker stop demo && docker rm demo
```

## 4. Push the image to ECR

Set your values:
```bash
export AWS_REGION=ap-south-1          # change to your region
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export REPO=node-ecs-demo
```

Create the repository (one time):
```bash
aws ecr create-repository --repository-name $REPO --region $AWS_REGION
```

Login, tag, push:
```bash
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker tag node-ecs-demo:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
```

## 5. Run it on ECS (console)

1. ECS -> Task definitions -> Create new (Fargate, 0.25 vCPU, 0.5 GB)
2. Container: image = your ECR image URI, port 3000, env var `APP_ENV=prod`
3. ECS -> Clusters -> Create cluster (Fargate)
4. Run task (or create a service) in a public subnet, **Auto-assign public IP = ON**
5. Security group of the task: allow inbound TCP 3000
6. Open `http://<task-public-IP>:3000/info`

## 6. Clean up (important for credits!)

- ECS: set service desired count to 0, delete service, delete cluster
- Deregister task definitions
- ECR: delete images / repository
- CloudWatch: delete the log group
- EC2: stop or terminate the instance
