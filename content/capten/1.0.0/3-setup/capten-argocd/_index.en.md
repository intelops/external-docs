---
title: "Capten-ArgoCD"
date: 2023-07-24
weight: 1
draft: false
---

This document covers about how to set up argocd and how ArgoCD is used in Capten

# Capten ArgoCD Plugin

## Installation of ArgoCD plugin

1. Go to Application Store
2. Click the CI/CD tab,argocd plugin can be viewed
3. Click the deploy button 

ArgoCD will be deployed in  controlPlane cluster.


## Why ArgoCD needed?

ArgoCD is a popular tool used in continuous delivery (CD) pipelines, particularly in Kubernetes environments. It's designed to automate the deployment of applications to Kubernetes clusters. Here are several reasons why Argo CD is needed:

1. Automated Deployments: ArgoCD automates the process of deploying applications to Kubernetes clusters. This reduces manual intervention and the chance of human error in the deployment process.

2. Declarative Configuration: It uses a declarative approach to define the desired state of applications and environments in YAML files. This makes it easier to manage and version control configuration, reducing the risk of configuration drift.

3. GitOps Principles: ArgoCD follows the GitOps methodology, which means that the desired state of the cluster is stored in a Git repository. Any changes to the desired state are made through Git commits, which triggers Argo CD to reconcile the actual state of the cluster with the desired state.

4. Application Lifecycle Management: It provides features for managing the lifecycle of applications, including deploying new versions, promoting releases across environments, and rolling back to previous versions if needed.

5. Visibility and Auditing: ArgoCD provides a web interface and CLI tools for monitoring the status of applications and deployments. It also logs all changes and events, making it easier to track who made changes and when they were made.

6. Multi-Tenancy Support: ArgoCD supports multi-tenancy, allowing different teams or users to manage their own applications and environments within the same cluster, while still providing isolation and security.

7. Integration with CI/CD Pipelines: Argo CD can be integrated with CI/CD pipelines to automate the entire software delivery process, from code commit to production deployment.


## How ArgoCD used in capten?

### 1. Creating Business Cluster using ArgoCD
### Deployment of crossplane components
1. In order for the business cluster to be up and running, the following crossplane components should be deployed
   - Controller-config
   - Provider
   - Provider-config
   - Composite Resource Definition
   - Composition
   - Clusterclaim
2. Of the above components, auto-sync for provider-config and composite resource definition will be disabled. This is done so that they can wait for provider to arrive at healthy state.
3. The clusterclaim file will point to a empty directory (infra/clusters/cluster-configs) and when the cluster is required the clusterclaim yaml is to be added in the mentioned directory and argocd will automatically sync and deploy clusterclaim thereby triggering cluster creation.


## Deployment of business cluster apps
1. The default apps to be deployed in business cluster is also synced via ArgoCD under the 'clusters' application's configuration. It is set to auto-sync by default.
2. Customer specific apps can be added under the same application and will be automatically deployed 


### 2. ArgoCD in tekton


1. For deploying cluster tasks 
   Whenever the onboarded repo visible under the   Tekton plugin is synced the new floder gets created in the customer’s repo and the argocd will pick this ClusterTask and deploy it in the cluster

2. For deploying pipeline resources
   In tekton whenever the pipeline resources like trigger,ingress,pipelines are pushed to the git repo ,the argocd watching this repo will deploy this resources in the cluster

3. For making changes in customer application 
   Whenever a trigger is made in the application repo the pipeline gets triggered and the deploy task in the pipeline uses the argocd to sync the changes made in the repo to the cluster


