---
title: "Capten-Crossplane"
date: 2023-07-24
weight: 1
draft: false
---

This document covers about how to set up crossplane and configure Business cluster on your machine.


# Capten Crossplane Plugin

## Onboard cluster resources:
### Git Project:
1. First to add crossplane plugin, we need to add an empty private repository.
2. In onboarding section, go to **Git** tab and click *Add Git Repo*.
3. Enter the git repo url and the token and also set the label to crossplane.

<img src= "https://github.com/Jeremy4040/infra/assets/88025755/84540a93-fa2b-4078-8d92-427c6c6dd178" width= "700" height= "400"/>

*Add git repository details in the mentioned section*

### Cloud Provider:
1. Now to add cloud provider, go to **Cloud Providers** and click * Add Cloud Provider*.
2. Select the required cloud provider and enter the credentials for the same. (The label is set to crossplane)

<img src= "https://github.com/Jeremy4040/infra/assets/88025755/98df42ae-211c-4f18-b51d-4344235e5d4d" width= "700" height= "400"/>

*Add cloud provider details in the mentioned section*


**Note:** The label *crossplane* is used by the crossplane plugin to reference both the repository and provider.

## Create Crossplane provider:
1. In platform engineering section, select *Setup* under **Crossplane** plugin.
2. Under providers section, select both the required provider and 'crossplane' label.
3. Under configure section, click sync next to the repository which is needed to deploy the plugin.
4. After the sync, the provider will get deployed and enter *Healthy* state in a few minutes.

<img src= "https://github.com/Jeremy4040/infra/assets/88025755/2bc713cd-6cf3-4663-ab74-342cbad63d84" width= "800" height= "400"/>

*Once onboarding is done both the git and provider details will be automatically populated in crossplane plugin using crossplane label*

## Create Business cluster
1. After the sync is successful, the crossplane objects and its argocd applications are added to the empty repository under the infra directory.
2. Go to infra/clusters/cluster-configs/cluster-claim.yaml
3. Uncomment the cluster-claim.yaml file (or add any required changes)
4. Go to argocd UI page and sync all crossplane related applications
5. After the clusterclaim is created, the business cluster creation will get triggered.

<img src= "https://github.com/Jeremy4040/infra/assets/88025755/d653042a-8a45-48ab-8450-f185c2e654d6" width= "700" height= "400"/>

*Make sure to sync all crossplane related apps*

## Delete Business cluster
1. To delete the business cluster, remove all applications from the business cluster.
2. Go to infra/clusters/cluster-configs and remove cluster-claim.yaml
3. Now prune sync the cluster-config-app application (watching the cluster-claim.yaml).
4. This will trigger the business cluster deletion

## Delete Crossplane provider
1. To delete crossplane provider, go to capten UI.
2. Under platform engineering, select *Setup* under **Crossplane** plugin
3. Under providers section, select the delete option next to the provider which is to be deleted.
4. This removes the provider from the cluster
5. It is also possible to remove the provider from onboarding list by the delete option provided with the cloud provider

<img src= "https://github.com/Jeremy4040/infra/assets/88025755/b075c02d-1653-4a42-9114-54ca82caa63d" width= "800" height= "300"/>

*To delete the crossplane provider, click the delete button next to the provider name*


