---
title: "Installation"
date: 2023-07-24
weight: 1
draft: false
---

## How KubViz works

Kubviz client can be installed on any Kubernetes cluster. Kubviz agent runs in a kubernetes cluster where the changes/events need to be tracked. The agent detects the changes in real time and send those events via NATS JetStream and the same is received in the kubviz client. 

Kubviz client receives the events and passes it to Clickhouse database. The events present in the Clickhouse database can be visualized through Grafana.

KubViz's event tracking component provides comprehensive visibility into the changes and events occurring within your Kubernetes clusters.

KubViz offers a seamless integration with Git repositories, empowering you to effortlessly track and monitor changes that occur within your codebase. By capturing events such as commits, merges, and other Git activities.

KubViz also monitors changes in your container registry, providing visibility into image updates. By tracking these changes, KubViz helps you proactively manage container security and compliance.

It comprehensively scans Kubernetes containers for security flaws, such as vulnerabilities and misconfigurations, and creates an SBOM (Software Bill of Materials).

## How to install and run Kubviz

#### Prerequisites
* A Kubernetes cluster 
* Helm binary

#### Prepare Namespace

This command will create a new **namespace** for your cluster.

```bash
kubectl create namespace kubviz
```

#### Client Installation

```bash
helm repo add kubviz https://intelops.github.io/kubviz/
helm repo update
```

The following command will generate a token. Please make sure to take note of this token as it will be used for both client and agent installation purposes.

```bash
token=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
```

```bash
helm upgrade -i kubviz-client kubviz/client -n kubviz --set "nats.auth.token=$token"
```

**NOTE:**
- If you want to get a token from a secret, use a secret reference with the secret's name and key.

**NOTE:** 
- If you want to enable Grafana with the client deployment, add `--set grafana.enabled=true` to the helm upgrade command.

- If grafana already exist use the same upgrade command without --set grafana.enabled=true flag. 

```bash
helm upgrade -i kubviz-client kubviz/client -n kubviz --set "nats.auth.token=$token" --set grafana.enabled=true
```

Parameter | Description | Default
--------- | ----------- | -------
`grafana.enabled` | If true, create grafana | `false`

- The KubViz client will also install NATS and Clickhouse. The NATS service is exposed as a LoadBalancer, and you need to note the external IP of the service **kubviz-client-nats-external** and pass it during the KubViz agent installation.

The following command will retrieve the IP address. Please make sure to take note of this IP address as it will be used for agent installation if your agent is located in a different cluster.

```bash
kubectl get services kubviz-client-nats-external -n kubviz --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```
**NOTE:**
- Kubviz-client pod is in a CrashLoopBackOff state, installing the Kubviz-agent will bring it back up and running.

#### Agent Installation

##### Deploying Agent on the Same Kubernetes Cluster as kubeviz Client:
1. Make sure you have the KubViz client running on your Kubernetes cluster.
2. Run the following command to deploy the KubViz agent:

```bash
helm upgrade -i kubviz-agent kubviz/agent -n kubviz \
  --set "nats.auth.token=$token" \
  --set git_bridge.enabled=true \
  --set "git_bridge.ingress.hosts[0].host=<INGRESS HOSTNAME>",git_bridge.ingress.hosts[0].paths[0].path=/,git_bridge.ingress.hosts[0].paths[0].pathType=Prefix,git_bridge.ingress.tls[0].secretName=<SECRET-NAME>,git_bridge.ingress.tls[0].hosts[0]=<INGRESS HOSTNAME> \ 
  --set container_bridge.enabled=true \
  --set "container_bridge.ingress.hosts[0].host=<INGRESS HOSTNAME>",container_bridge.ingress.hosts[0].paths[0].path=/,container_bridge.ingress.hosts[0].paths[0].pathType=Prefix,container_bridge.ingress.tls[0].secretName=<SECRET-NAME>,container_bridge.ingress.tls[0].hosts[0]=<INGRESS HOSTNAME>
```

**NOTE:**
-  If you want to get a token from a secret, use a secret reference with the secret's name and key.

3. Replace "INGRESS HOSTNAME" with the desired hostname for the Git Bridge and Container Bridge Ingress configurations.
4. Replace "SECRET-NAME" with the desired secretname for the Git Bridge and Container Bridge Ingress configurations.

Parameter | Description | Default
--------- | ----------- | -------
`nats.host` | nats host | `kubviz-client-nats`
`git_bridge.enabled` | If true, create git_bridge | `false`
`git_bridge.ingress.hosts[0].host` | git_bridge ingress host name | `gitbridge.local`
`git_bridge.ingress.hosts[0].paths[0].path` | git_bridge ingress host path | `/`
`git_bridge.ingress.hosts[0].paths[0].pathType` | git_bridge ingress host path type | `Prefix`
`container_bridge.enabled` | If true, create container_bridge | `false`
`container_bridge.ingress.hosts[0].host` | container_bridge ingress host name | `containerbridge.local`
`container_bridge.ingress.hosts[0].paths[0].path` | container_bridge ingress host path | `/`
`container_bridge.ingress.hosts[0].paths[0].pathType` | container_bridge ingress host path type | `Prefix`
`git_bridge.ingress.tls` | git_bridge ingress tls configuration | []
`container_bridge.ingress.tls` | container_bridge ingress tls configuration | []

**NOTE:** 

- Default Annotations for Ingress

By default, this Helm chart includes the following annotations for the git bridge and container bridge ingress resource:

```yaml
annotations:
  cert-manager.io/cluster-issuer: letsencrypt-prod-cluster
  kubernetes.io/force-ssl-redirect: "true"
  kubernetes.io/ssl-redirect: "true"
  kubernetes.io/tls-acme: "true"
...
```

If you do not want to use the default value, you can modify the annotation in [values.yaml](https://github.com/intelops/kubviz/blob/main/charts/agent/values.yaml#L60) and execute the following command:

```bash
helm upgrade -i kubviz-agent kubviz/agent -f values.yaml -n kubviz
```

##### Deploying Agent on a Different Kubernetes Cluster:
1. Run the following command to deploy the KubViz agent:

```bash
helm upgrade -i kubviz-agent kubviz/agent -n kubviz --set nats.host=<NATS IP Address> --set "nats.auth.token=$token"   
```
2. Replace "<NATS IP Address>" with the IP address of your NATS service **kubviz-client-nats-external**.

**NOTE:**
The time-based job scheduler is added for each plugin, allowing you to schedule and automate the execution of plugins at specific times or intervals. To activate this scheduler, set 'enabled' to 'true.' Once enabled, each plugin's execution can be configured to run at a precise time or at regular intervals, based on the provided settings. Additionally, if you set the 'schedulingInterval' to '0', it will disable the plugins.

#### How to Verify if Everything is Up and Running

After completing the installation of both the client and agent, you can use the following command to verify if they are up and running.

```bash
kubectl get all -n kubviz
```

#### Configuration

Once everything is up and running, you need to perform additional configurations to monitor git repository events and container registry events.

To ensure that these events are sent to KubViz, you need to create a webhook for your repository. This webhook will transmit the event data of the specific repository or registry to KubViz.

To set up a webhook in your repository, [please follow these steps](./configuration.md)

#### How to View Event Data in Grafana

1. Retrieve your Grafana login password by running the following command:

```bash
kubectl get secret --namespace kubviz kubviz-client-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

2. Get the Grafana URL to visit by running these commands in the same shell:

```bash
export POD_NAME=$(kubectl get pods --namespace kubviz -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=kubviz-client" -o jsonpath="{.items[0].metadata.name}")
```
```bash     
kubectl --namespace kubviz port-forward $POD_NAME 3000
```

3. Access "localhost:3000" in your web browser, where you'll be prompted to enter your credentials. Utilize the username "admin" and the password obtained from step 1 to proceed.   