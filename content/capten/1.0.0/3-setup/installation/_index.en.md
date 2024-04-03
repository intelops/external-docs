---
title: "Installation"
date: 2023-07-24
weight: 1
draft: false
---

This document covers about how to set up and configure Capten on your machine.

#### Note

An addition to this,Capten also supports teams and slack integration for alerting in case when node goes down or when pod is in crashloopbackoff state and in many cases.

## How to install and run Capten

#### Prerequisites

* Cloud Provider Account- As of now ,capten supports creating cluster in AWS and Azure. You'll need an account for that cloud provider. Ensure that you have permissions to create and manage resources.

* Azure CLI (Needed in case of using Azure cloud for cluster setup)

* Docker 

* kubernetes


#### Capten Installation

As of now,we are supporting CLI for cluster creation and destruction for linux os.For supporting in any environment or any os,we have also containerized the process of cluster creation and destruction.

#### Setting up the cluster Through Capten CLI:

1.Extract the latest release from the capten repo.

2.Confifure the specification need for creating the cluster.Before installation,please do the necessary configuration ,as explained [here]()

3.Then use the below commands to create cluster ,setup application and destroying the cluster.

* For creating the cluster

Based on your requirement,you can specify the cloud type as either **aws** or **azure**

```bash
./capten create cluster --cloud=<cloudtype> --type=talos
```
###### verification of cluster creation
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


#### Note: 
After installation,need to update the DNS entry for the cluster domain in aws console or on any cloud provider.

The DNS entry update allows users to access applications like Grafana and Loki through the specified domain.

#### How to verify the successful updation of dns?

Consider the domain name as `aws.intelops.com`,once after the updation,use the nslookup command to verify
```bash
nslookup capten.awsagent.optimizor.app
```














