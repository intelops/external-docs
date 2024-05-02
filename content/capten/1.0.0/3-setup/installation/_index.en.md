---
title: "Installation"
date: 2023-07-24
weight: 1
draft: false
---

This document covers about how to set up and configure Capten Controlplane Cluster on your machine.


## How to Install Capten Controlplane Cluster

Capten controlplane cluster creation supported with Capten CLI, Capten CLI distribution available for Linux, Winodws and MacOS.
Capten controlplane cluster creation supported on public cloud providers like AWS and Azure.

#### Prerequisites

- AWS or Azure clound provider account

- Azure CLI (Needed in case of using Azure cloud for cluster setup)

- Docker (Needed in case of using Capten CLI distribution on Windows or MacOS)

- kubectl tool to access Capten controlplane cluster

#### Setting up the cluster

1. Download and Extract Capten package from Capten github repoistory [release page](https://github.com/intelops/capten/releases).

```bash
wget https://github.com/intelops/capten/releases/download/v1.0.0/capten-v1.0.0.tar.gz
tar -xvf capten-v1.0.0.tar.gz
```

2. Preparted the cluster installation parameters

Update cluster installation parameters:
For AWS cluster, update cluster installation parameters in the `aws_config.yaml` in `config` folder.

| Parameter              | Description                                                                      |
|------------------------|----------------------------------------------------------------------------------|
| AwsAccessKey           | Access key for AWS authentication                                                |
| AwsSecretKey           | Secret key for AWS authentication                                                |
| AlbName                | Name of the Application Load Balancer (ALB)                                      |
| PrivateSubnet          | CIDR block for the private subnet(s)                                             |
| Region                 | AWS region where the resources will be deployed                                  |
| SecurityGroupName      | Name of the security group that controls inbound and outbound traffic          |
| VpcCidr                | CIDR block for the Virtual Private Cloud (VPC)                                   |
| VpcName                | Name of the Virtual Private Cloud (VPC)                                          |
| InstanceType           | Type of EC2 instance                                                             |
| NodeMonitoringEnabled  | Flag indicating whether node monitoring is enabled or not (true/false)          |
| MasterCount            | Number of master nodes                                                           |
| WorkerCount            | Number of worker nodes                                                           |
| TraefikHttpPort        | Port number for HTTP traffic handled by Traefik load balancer                   |
| TraefikHttpsPort       | Port number for HTTPS traffic handled by Traefik load balancer                  |
| TalosTg                | Name of the target group for Talos instances                                      |
| TraefikTg80Name        | Name of the target group for port 80 traffic handled by Traefik                  |
| TraefikTg443Name       | Name of the target group for port 443 traffic handled by Traefik                 |
| TraefikLbName          | Name of the Elastic Load Balancer (ELB) used by Traefik                           |
| TerraformBackendConfigs| Configuration settings for Terraform backend (bucket name and DynamoDB table name)| 


For Azure cluster, update cluster installation parameters in the `azure_config.yaml` in `config` folder.

| Parameter            | Description                                                       |
|----------------------|--------------------------------------------------------------     |
| Region               | The Azure region where resources will be deployed                 |
| MasterCount          | Number of  master nodes                                      |
| WorkerCount          | Number of  worker nodes                                      |
| NICs                 | Network Interface Controllers (NICs) for master nodes             |
| WorkerNics           | Network Interface Controllers (NICs) for worker nodes             |
| InstanceType         | Type of virtual machine instance used for  nodes             |
| PublicIpName         | Names of public IP addresses assigned to the  nodes          |
| TraefikHttpPort      | Port number for HTTP traffic handled by Traefik load balancer     |
| TraefikHttpsPort     | Port number for HTTPS traffic handled by Traefik load balancer    |
| Talosrgname          | Resource group name for the Talos deployment                      |
| Storagergname        | Resource group name for storage-related resources                 |
| Storage_account_name | Name of the storage account used for storing images               |
| Talos_imagecont_name | Name of the container within the storage account for Talos images |
| Talos_cluster_name   | Name of the Talos cluster                                         |
| Nats_client_port     | Port number for NATS client communication                         |


3. Prepare cluster application deployment parameters

Update cluster application deployment parameters in the `capten.yaml` in `config` folder.

| Parameter         | Description                                                                      |
| ----------------- | ---------------------------------------------------------------------------------|
| DomainName        | Name of the domain needed for exposing the application                           |
| ClusterCAIssuer   | The issuer of the Cluster Certificate Authority (CA) for cluster security        |
| SocialIntegration | The social platform like teams or slack integrated for alerting purpose          |
| SlackURL          | Slack channel url (needs to be provided if slack is used for social integration) |
| SlackChannel      | Name of the slack channel                                                        |
| TeamsURL          | Teams channel url (needs to be provided if teams is used for social integration) |

4. Create cluster

For creating the cluster, execute below command

```bash
./capten create cluster --cloud=<cloudtype> --type=talos
```

Note: Cloud type supported are 'aws' and 'azure'

* Cluster Creation through Docker Container:

For creating the cluster through docker container (needed in case of using Capten CLI distribution on Windows or MacOS ),run the below command

```bash
docker run -v /path/to/aws_config.yaml:/app/config/awsorazure_config.yaml -it ghcr.io/intelops/capten:<latest-image-tag>  create cluster --cloud=aws --type=talos
```

Post cluster creation, `kubeconfig` will be generated to `./config/kubeconfig`.
Access cluster using generated kubeconfig with kubectl

```bash
export KUBECONFIG=/home/capten/config/kubeconfig
kubectl get nodes
```

#### Setting up the cluster applications

For deploying the cluster applications, execute below command

```bash
./capten setup apps
```

Capten CLI will deploy Capten application suite and Capten Agent on Controlplane cluster.
Post application deployment, mTLS certificates are generated to access Capten Agent. mTLS certificates `capten-client-auth-certs.zip` generated in `cert` folder.

Deployed applications can be listed with helm tool

```bash
helm list -A
```

#### Show the cluster info

```bash
./capten show cluster info
```

#### Destroying the cluster

Cluster destruction command initiates the process of removing all components associated with the cluster, such as virtual machines, instances, nodes, networking configurations, and any other resources provisioned for the cluster. It effectively undoes the setup and configuration of the cluster, deallocating resources and ensuring they are no longer in use. This command can be used when the cluster is no longer needed or to clean up resources in cloud computing, distributed systems, or container orchestration environments.

```bash
./capten destroy cluster
```














