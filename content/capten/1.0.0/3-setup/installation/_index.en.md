---
title: "Installation"
date: 2023-07-24
weight: 1
draft: false
---

This document covers about how to set up and configure Capten on your local.

## Features in capten


Capten likely leverages infrastructure as code (IaC) tools, such as Terraform  to automate the creation and destruction of Kubernetes clusters. This involves provisioning and configuring the necessary resources on a cloud provider (e.g., AWS) to create a functional Kubernetes cluster.


We have core applications like openebs-cstor,cert-manager and traefik.OpenEBS-cStor ensures persistent storage for stateful applications, Cert-Manager automates certificate management for secure communication, and Traefik simplifies the routing and load balancing of traffic in a microservices environment on Kubernetes. These tools collectively contribute to creating a reliable, secure, and scalable infrastructure for containerized applications.

Capten also supports some default applications that are given below:

* pre-install:

pre-install hooks run after templates are rendered but before any resources are created.

* prometheus:

Prometheus is an open-source monitoring and alerting toolkit designed for reliability and scalability in monitoring large, dynamic systems.

* vault:

HashiCorp Vault is a tool for managing secrets and protecting sensitive data.

* external-secrets:

External Secrets is a Kubernetes controller that allows you to use secret management systems like HashiCorp Vault or AWS Secrets Manager as a source for Kubernetes Secrets.

It helps manage and sync secrets from external secret management systems into Kubernetes, ensuring secure and dynamic secret handling.

* k8ssandra-operator:

K8ssandra is an open-source distribution of Apache Cassandra designed for Kubernetes.
The operator facilitates the deployment and management of Cassandra clusters on Kubernetes, making it easier to operate and scale Cassandra-based applications.

* postgresql:

PostgreSQL is a powerful, open-source relational database management system (RDBMS).

* loki:

Loki is an open-source logging system optimized for Kubernetes.
It allows for efficient log aggregation and querying in Kubernetes environments, making it easier to troubleshoot and monitor applications.

* kyverno:

Kyverno is a policy engine designed for Kubernetes.
It helps enforce security, compliance, and operational policies by validating and mutating resources as they are created or updated in a Kubernetes cluster.

* k8ssandra-cluster:

This could be a reference to a specific configuration or resource related to the K8ssandra distribution of Apache Cassandra.

* monitoring:

This term generally refers to the practice of monitoring the performance and health of systems and applications.

* kubviz-client:

Kubviz is a Kubernetes cluster visualization tool.
A component used to interact with or visualize the Kubernetes cluster in a graphical manner.

* kubviz-agent:

This is an agent component associated with the Kubviz visualization tool.

* signoz:

Signoz is an open-source distributed tracing system.
It helps monitor and trace requests as they travel through various components of a distributed system, providing insights into performance and potential issues.

* temporal:

Temporal is an open-source, stateful, and scalable workflow orchestration system.
It simplifies the development of distributed applications by managing the execution, state, and retries of workflows.

* kad:

Extensible open-source framework that Integrates & Scales your DevSecOps and MLOps stacks as you need

* policy-reporter:

Policy Reporter may be a tool or component that generates reports based on policies defined in a Kubernetes cluster.
It helps ensure that the cluster adheres to specified policies for security, compliance, or other governance concerns.

* kubescape:

Kubescape is a tool designed to test Kubernetes clusters for security issues.
It helps identify and mitigate potential security risks and misconfigurations in a Kubernetes environment.

* falco:

Falco is an open-source container security monitoring tool.
It provides runtime security monitoring for containerized applications, detecting and alerting on abnormal behavior and potential security threats.

* tracetest:

A trace-based testing tool for building integration and end-to-end tests in minutes using your OpenTelemetry traces

* velero:

Velero is an open-source tool for backup and restore of Kubernetes clusters.

#### Note

An addition to this,Capten also supports teams and slack integration for alerting in case when node goes down or when pod is in crashloopbackoff state and in many cases.

## How to install and run Capten

#### Prerequisites

* Cloud Provider Account- Capten supports creating cluster for AWS and Azure, you'll need an account for that cloud provider. Ensure that you have the necessary credentials and permissions to create and manage resources.

* Azure CLI-If you are using azure cloud for creating cluster.Then you need to have Azure CLI.

* Docker 

* kubernetes


#### Capten Installation

As of now,we are supporting CLI for cluster creation and destruction for linux os.For supporting in any environment or any os,we have also containerized the process of cluster creation and destruction.

#### Through CLI:

1.After extracting the latest release,unzip the required zip file(capten_linux.zip).

2.Open the unzipped capten,and do the necessary changes in the configuration file,which is under the config directory.

Configure your aws access key ,secret key and so on in case of aws ,and in case of azure, change the configuration settings like region,master count ,worker count and so on.

3.Then use the below commands to create cluster ,setup application and destroying the cluster.

* For creating the cluster

Cloud Type can be either **aws/azure**

```bash
./capten create cluster --cloud=<cloudtype> --type=talos
```

Verify the cluster creation process by checking whether the kubeconfig is created or not under config directory in capten folder.If the kubeconfig is created,export the kubeconfig and check the status of node by using below command.

```bash
kubectl get nodes
```

* For setting up the application in cluster

```bash
./capten setup apps
```
In default,it'll install all application.

If you need any selected application,You can install the required or specific application by removing the application name in the yaml file which is under capten/apps/default_group_apps.yaml.

* For destroying the cluster

```bash
./capten show cluster info
```

#### Through Docker Container:

For creating the cluster,run the below command

```bash
docker run -v /path/to/aws_config.yaml:/app/config/awsorazure_config.yaml -it ghcr.io/intelops/capten:<latest-image-tag>  create cluster --cloud=aws --type=talos
```

In order to verify the cluster creation,you can see the kubeconfig file inside the config folder in the container.

After installation,need to update the DNS entry for the cluster domain in aws console or on specified cloud provider.

The DNS entry update allows users to access applications like Grafana and Loki through the specified domain.


#### Note: 

Before cluster creation ,user can change  the required domain name.And also if user needs to integrate with teams or slack,provide the required slack channel Url or teams Channel Url.If the user needs to do the above mentioned changes,provide the required input in capten.yaml and create the cluster.












