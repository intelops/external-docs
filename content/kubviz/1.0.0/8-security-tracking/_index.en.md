---
title: "Security Tracking"
date: 2024-04-03
weight: 8
draft: false
---

## Cluster Scanning 

Using KubViz, you can comprehensively scan Kubernetes containers for security flaws such as vulnerabilities and misconfigurations.

### Purpose

- It helps in detecting vulnerabilities in operating system packages (like Alpine, Debian, Ubuntu, etc.)
- This could include ensuring the security of containerized applications, compliance with security standards, or reducing the risk of security breaches.
- Detects configuration issues in Kubernetes cluster.

## Image Scanning

KubViz helps to identify vulnerabilities in container images.

It focuses on scanning container images for known vulnerabilities in the installed packages and libraries.

It will analyze the layers of the image and compare the installed packages and libraries against its vulnerability database. It will then provide a report highlighting any known vulnerabilities found.

## Sbom

Generate reports for Software Bill of Materials (SBOM) from images within your Kubernetes cluster using KubViz in the CycloneDX format.

These reports will be available in JSON format, and you can visualize this data on Grafana dashboard.

## Customizing Security Scanning

You can customize the security scans by changing the chart values.

- To [Disable](https://github.com/intelops/kubviz/blob/main/charts/agent/values.yaml#L186) the cluster scan you can pass 0 or empty string

```yaml
schedule:
  enabled: true
  trivyclusterscanInterval: 0
...
```

- For changing the interval, pass the interval time

```yaml
schedule:
  enabled: true
  trivyclusterscanInterval: "@every 24h"
...
```

Same you can change for [image-scan](https://github.com/intelops/kubviz/blob/main/charts/agent/values.yaml#L184) and [sbom](https://github.com/intelops/kubviz/blob/main/charts/agent/values.yaml#L185) 
