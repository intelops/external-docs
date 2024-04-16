---
title: "Health Check"
date: 2024-04-03
weight: 9
draft: false
---

## Health Check

You can run different types of checks against your Kubernetes cluster to detect any issues or potential problems before they cause any downtime or service disruptions. Check will run in the background and sends data to kubviz. After analysing the data from dashboard you can take corrective action quickly, if any issues are detected.

### Configuration

You'll need to [configure](https://github.com/intelops/kubviz/blob/main/charts/agent/values.yaml#L192) it to run health checks on your Kubernetes cluster. 

```yaml
kuberhealthy:
  enabled: true
...
```

## Run Health Checks

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
