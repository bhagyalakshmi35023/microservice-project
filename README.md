# Minikube Microservice Sample

This sample repository contains a simple microservice demo with two Node.js services:

- `service-a`: user-service
- `service-b`: order-service

The `order-service` calls `user-service` inside the Kubernetes cluster.

## Prerequisites

- `minikube`
- `kubectl`
- `docker` or Docker-compatible builder

## Build and deploy

1. Start minikube:

```powershell
minikube start
```

2. Build Docker images inside minikube using the shared root `Dockerfile`:

```powershell
minikube image build --build-arg SERVICE_DIR=service-a -t user-service:1.0 -f Dockerfile .
minikube image build --build-arg SERVICE_DIR=service-b -t order-service:1.0 -f Dockerfile .
```

3. Apply Kubernetes manifests:

```powershell
kubectl apply -f k8s
```

4. Verify pods and services:

```powershell
kubectl get pods
kubectl get svc
```

## Access the services

Expose the `order-service` from minikube:

```powershell
minikube service order-service --url
```

Then open the returned URL or call it directly with `curl`.

## Example requests

```powershell
curl $(minikube service order-service --url)/orders
curl $(minikube service order-service --url)/orders/101
```

## Cleanup

```powershell
kubectl delete -f k8s
minikube stop
```
