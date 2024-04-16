---
title: "Health Check"
date: 2024-04-03
weight: 9
draft: false
---

## Health Check

You can run different types of checks against your Kubernetes cluster to detect any issues or potential problems before they cause any downtime or service disruptions. Check will run in the background and sends data to kubviz. After analysing the data from dashboard you can take corrective action quickly, if any issues are detected.

### Configuration

All health checks are enabled by default upon installing the KubViz agent. They are automatically included, but if you don't need them, you can disable it.

You'll need to [configure](https://github.com/intelops/kubviz/blob/main/charts/agent/values.yaml#L189) it to run health checks on your Kubernetes cluster. 

```yaml
kuberhealthy:
  enabled: true
...
```

## Types of Checks

Once you've configured it will start running health checks on your Kubernetes cluster. It supports a variety of health checks, The checks are:


Check Name | Description |
------ | -------- | 
Daemonset check | Ensures daemonsets can be successfully deployed |
DNS status check | Checks for failures with DNS, including resolving within the cluster and outside of the cluster |
Deployment check | Ensures that a Deployment and Service can be provisioned, created, and serve traffic within the Kubernetes cluster |
Image pull check | Verifies that an image can be pulled from an image repository | 
Pod status check | Checks for unhealthy pod statuses in a target namespace |
Pod restart | Checks for excessive pod restarts in any namespace |
Resource quota check | Checks if resource quotas (CPU & memory) are available |


- Daemonset, Deployment, and DNS checks are enabled by default when you enabling kuberhealthy.

- Pod Status, Pod Restart, Image Pull, and Resource Quota checks need to be manually enabled.

### Daemonset Check

- **Purpose of Daemonset Check:** Validates the stable deployment and operation of daemonsets across all Kubernetes nodes, ensuring critical services are uniformly available.

- It automatically deploys a test daemonset, verifies pod scheduling on each node, and checks for successful pod termination upon completion. The check runs every 60 minutes.

### Deployment Check

- **Purpose of Deployment Check:** Assesses the success of application deployments in the Kubernetes cluster, ensuring configurations and services are correctly launched.

- Initiates a test deployment, evaluates the deployment process, service accessibility, and rollbacks if necessary, to ensure operational integrity.

### DNS Check

- **Purpose of DNS Check:** Ensures that DNS resolution is working correctly within the Kubernetes cluster, critical for service discovery and network communication.

- Performs DNS lookups to validate the responsiveness and accuracy of the cluster's DNS service, identifying potential issues early.

### Image Pull Check

- Image pull check is a custom check that requires manual enabling.

- This container tests the availability of image respositories.

- This check will run every 60 minutes. You can change this by modifying the `runInterval`.

```yaml
imagePullCheck:
      enabled: true
      runInterval: 60m
      timeout: 1m
      image:
        repository: kuberhealthy/test-check
        tag: v1.4.0
      extraEnvs:
        REPORT_FAILURE: "false"
        REPORT_DELAY: "1s"
      resources:
        requests:
          cpu: 10m
          memory: 50Mi
...
```
#### Steps to Follow Before Running the Image Pull Check

1. Pull the test image from docker hub

```bash     
docker pull kuberhealthy/test-check
```

2. Push this image on the repository you need tested.

```bash
docker push my.repository/repo/test-check
```

3. Replace the `repository` value with your repository.

- The pod is designed to attempt a pull of the test image from the remote repository (never from local). If the image is unavailable, an error will be reported to the API

### Pod Status Check

- Pod status check is a custom check that requires manual enabling.

- **Purpose of Pod Status Check:** Monitors the health and status of pods within the Kubernetes cluster to ensure they are running and stable.

- This check will run every 5 minutes. You can change this by modifying the `runInterval`.

```yaml
    podStatus:
      enabled: true
      runInterval: 5m
      timeout: 15m
      image:
        registry: docker.io
        repository: kuberhealthy/pod-status-check
        tag: v1.3.0
      allNamespaces: true
      extraEnvs: {}
      nodeSelector: {}
      tolerations: []
      resources:
        requests:
          cpu: 10m
          memory: 50Mi
...
```

### Pod Restart Check

- Pod restart check is a custom check that requires manual enabling.

- The Pod Restarts Check checks for excessive pod restarts in a given `POD_NAMESPACE`.

- The Pod Restarts Check deploys a pod that looks for pod resource events in a given `POD_NAMESPACE` and checks for Warning event types with reason `BackOff`. If this specific event type count exceeds the `MAX_FAILURES_ALLOWED`, an error is reporting back.

- The check runs every 5m (spec.runInterval) with a check timeout set to 10 minutes (spec.timeout), and a `MAX_FAILURES_ALLOWED` count set to 10. If the check does not complete within the given timeout it will report a timeout error.

```yaml
    podRestarts:
      enabled: true
      runInterval: 5m
      timeout: 10m
      image:
        registry: docker.io
        repository: kuberhealthy/pod-restarts-check
        tag: v2.5.0
      allNamespaces: true
      extraEnvs:
        MAX_FAILURES_ALLOWED: "10"
      nodeSelector: {}
      tolerations: []
      resources:
        requests:
          cpu: 10m
          memory: 50Mi
...
```

### Resource Quota Check

- This check tests if namespace resource quotas CPU and memory are under a specified threshold or percentage. It requires manual enabling.

```yaml
    resourceQuota:
      enabled: true
      runInterval: 1h
      timeout: 2m
      image:
        repository: kuberhealthy/resource-quota-check
        tag: v1.3.0
      extraEnvs:
        BLACKLIST: "default"
        WHITELIST: "kube-system,kubviz"
      resources:
        requests:
          cpu: 15m
          memory: 15Mi
        limits:
          cpu: 30m
...
```

- **Configurable check environment variables:**
`BLACKLIST`: Blacklist of namespaces to look at (default for BLACKLIST=default)
`WHITELIST`: Whitelist of namespaces to look at. (default for whitelist=kube-system,kubviz)