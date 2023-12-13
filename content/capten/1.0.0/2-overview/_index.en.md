---
title: "Overview"
date: 2023-07-24
weight: 2
draft: false
---


![KubViz](./logowithName.png)

**KubViz** is the `open-source` project by Intelops.

Experience seamless visualization of Kubernetes and DevSecOps workflows with KubViz. Monitor real-time changes and events across your entire Kubernetes clusters, Git repositories, and container registries effortlessly. Our platform includes robust features such as container image vulnerability scanning, misconfiguration detection, and Software Bill of Materials (SBOM) analysis.

KubViz empowers you to track these dynamic elements, enabling comprehensive analysis of their impact. Gain valuable context to troubleshoot effectively, ensuring efficient management and troubleshooting of issues. With KubViz, obtain the observability you require in a user-friendly manner, providing unparalleled insights into your Kubernetes and DevSecOps landscapes.

## Problem

Managing Kubernetes and DevSecOps workflows can be complex and challenging. Tracking changes, events, and their impacts across multiple clusters, Git repositories, and container registries can be time-consuming and error-prone. Without proper visibility and context, troubleshooting issues and ensuring system reliability and security becomes difficult.

## Solution: KubViz

KubViz addresses these challenges by providing a comprehensive solution for visualizing Kubernetes and DevSecOps workflows. It tracks changes/events in real-time, allowing you to easily analyze their effects and gain the necessary context for efficient troubleshooting. With KubViz, you can overcome the complexity and uncertainty associated with managing these workflows.

-------------------------

### How KubViz solves the problem:

#### Event Tracking for Clusters

KubViz's event tracking component provides comprehensive visibility into the changes and events occurring within your Kubernetes clusters. By installing the KubViz client on any Kubernetes cluster, and deploying the KubViz agent within the cluster where event tracking is required, you can effectively monitor and capture real-time changes. The agent detects these changes in real time and seamlessly sends the events via NATS JetStream to the KubViz client. The KubViz client receives and processes the events, storing them in the ClickHouse database for further analysis and visualization. This robust event tracking mechanism allows you to gain insights into the dynamics of your clusters, understand the impact of changes, and proactively address any issues, ensuring the smooth functioning of your Kubernetes environment.

#### Git Bridge for Change Tracking 

KubViz offers a seamless integration with Git repositories, empowering you to effortlessly track and monitor changes that occur within your codebase. By capturing events such as commits, merges, and other Git activities, KubViz provides valuable insights into the evolution of your code. This comprehensive change tracking capability allows you to analyze the effects of code modifications on your development and deployment workflows, facilitating efficient collaboration among teams. With KubViz's Git bridge, you can easily identify the root causes of issues, ensure code integrity, and maintain a clear understanding of the changes happening within your Git repositories

#### Container Bridge for Registry Changes 

KubViz's container bridge monitors changes in your container registry, providing visibility into image updates, vulnerability footprints. By tracking these changes, KubViz helps you proactively manage container security and compliance. With a clear understanding of the container landscape, you can mitigate risks, address vulnerabilities, and maintain a robust and secure infrastructure.

By combining event tracking, git bridge, and container bridge capabilities, KubViz offers the observability and context needed to streamline your Kubernetes and DevSecOps workflows. With visualizations provided by Grafana, you can easily analyze and optimize your system, ensuring reliable deployments, efficient collaboration, and enhanced overall performance.

Take control of your Kubernetes and DevSecOps workflows with KubViz and experience the power of real-time tracking and visualization for improved system reliability and security.

#### Kubernetes Container Security Tracking

Using KubViz you can comprehensively scan the kubernetes containers for the security flaws such as vulnerabilities and misconfigurations.

Detects comprehensive vulnerabilities in OS packages (Alpine, Red Hat Universal Base Image, Red Hat Enterprise Linux, CentOS, Oracle Linux, Debian, Ubuntu, Amazon Linux, openSUSE Leap, SUSE Enterprise Linux, Photon OS and Distroless).

Detects configuration issues in Kubernetes cluster.

#### SBOM

Generate reports for Software Bill of Materials (SBOM) from images within your Kubernetes cluster using KubViz in the CycloneDX format. These reports will be available in JSON format.

### Architecture

![KuViz-arch-diagram](./kubviz.png)

