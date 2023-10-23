---
title: "Installation"
date: 2023-03-31
weight: 3
draft: false
---

This document covers about how to set up Compage on your local with helm charts and `Compage` will be exposed
through `NodePort` service to the outer world. When you deploy
on
the server, you have to expose the `ui` service using LoadBalancer service type or need to create an ingress.

### Create a KinD cluster

Make sure you have access to Kubernetes cluster. You can create a KinD cluster as explained [here](https://github.com/intelops/compage/blob/main/CONTRIBUTING.md), in a cluster creation section. Make sure that you are installing the nginx ingress controller as well.

We have configured the KinD cluster to be available at these ports: 
- ui-32222
- app—31111

So, you can access the compage using [http://localhost:32222](http://localhost:32222)

### Create a namespace

Currently, the `compage` namespace is made hard-coded but in-future, it will be completely configurable.

```yaml
kubectl create ns compage
kubectl config set-context --current --namespace=compage
```

### Configure Cassandra
You need to get the details for Cassandra as compage/app uses Cassandra as a database.
You need to update the values.yaml file with the Cassandra details.
```shell
app:  
  cassandra:
    contactPoints: "test-dc1-service.k8ssandra-operator.svc.cluster.local"
    localDataCenter: "dc1"
    username: "test-superuser"
    password: "Vr58zqslXCgQniIfHdYe"
    keyspace: "compage"
```
You can use any Cassandra cluster to store the data. If you want to start a local Cassandra cluster, you can follow the steps given in the [compage/deploy/steps.md](https://github.com/intelops/compage/blob/v1.0.0/deploy/steps.md) file.

### Install the latest version from GitHub helm repository.

Fire below set of commands and install the compage on your KinD cluster running locally.

Before this, you will have to create a docker image for ui component. As this is a UI component and commands in
Dockerfile use below CONFIG values

- REACT_APP_COMPAGE_APP_SERVER_URL

to create it, you will have to use your configurations and create a docker image using below commands (run them from base folder of compage)

```shell
TAG_NAME="{version you are installing so that it will be automatically taken.}"
UI_IMAGE="ghcr.io/intelops/compage/ui:$TAG_NAME"
# Assuming this is the name of your kind cluster
CLUSTER_NAME=compage
# create docker image for ui
docker build -t $UI_IMAGE  --network host ui/
kind load docker-image --name $CLUSTER_NAME $UI_IMAGE
```

Once you are done with above commands, kindly run below set of commands. 

```shell
helm repo remove intelops
helm repo add "intelops" "https://raw.githubusercontent.com/intelops/compage/main/charts"
helm install compage intelops/compage --values charts/compage/values.yaml
kubectl get pods -n compage
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-ui
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-core
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-app
```

Go to [http://localhost:32222](http://localhost:32222)

### Uninstall

Simply, delete the cluster created above using `kind delete cluster --name compage`. If that's not possible, delete the
namespace `kubectl delete ns compage`
