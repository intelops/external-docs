---
title: "Capten-Tekton"
date: 2023-07-24
weight: 1
draft: false
---

This document covers about how to set up and configure tekton and to create CI/CD pipelines on ControlPlane Cluster.


# Tekton Flow For Capten
## Tekton CI/CD Pipeline
1. Login to the capten ui page
   
2. Onboarding git project in to capten

   ![GitOnboarding](./onboarding-git.png)
   ![NewGitOnboarding](./new-git-onboarding.png)

   * select the `add git repo` from the **git** section
   * add the git repo url,access token and label for the customer repo (label is tekton) and the tekton ci/cd repo (label is IntelopsCi)
3. Onboarding container registry in to capten

  ![ContainerRegisterOnboarding](./onboarding-container.png)
  ![NewContainerRegisterOnboarding](./new-container-onboarding.png)  

   * select `add container registry` from **container registry** section
   * add  the registry url,username,access token and label to which the built image needs to be pushed (labels is "tekton")
# Configuring Tekton
## Configuring Capten Tekton Plugin 

   Go to the *capten-->platform engineering* ,select on the tekton plugin setup and then select the `sync` option under the  **configure** section and this will configure the tekton and the neccessary floders will be created in the customer's repo

   ![TektonPlugin](./tek-plugin.png)

   ![TektonPlugin](./tek-plugin-new.png)

   
# Pre-requisite For Tekton CI/CD Pipeline Creation

* Use the already created **tekton-pipelines** namespace for the creation of pipeline.

* Create a secretstore from the yaml given below.Replace the server with the url which can be obtained from the **kubectl** command given below.

  ```bash
  kubectl get ingress -n capten
  ```
  
       apiVersion: external-secrets.io/v1beta1
       kind: SecretStore
       metadata:
         name: vault-root-store
       spec:
         provider:
           vault:
             server: <"replace with the ingress host obtained from above command">
             path: "secret"
             version: "v2"
             auth:
               tokenSecretRef:
                 name: "tekton-vault-token"
                 key: "token"
                 

Here, the **tekton-vault-token** is the secret created in tekton namespace to access the vault.Copy-paste the **tekton-vault-token** secret in the required namespace where the tekton pipeline will be present and then create the above secretstore.


* Git secret
 
  Go to *onboarding-->git* under the respective git project  the path of the vault where the credentials of git  stored can be viewed.copy the path and add it to the path in the external secret yaml as given below

 ## Note

  Annotate the external-secret to specify the domains for which Tekton can use the credentials.

  A credential annotation key must begin with tekton.dev/git- or tekton.dev/docker- and its value is the URL of the host for which  Tekton will be using  that credential.
    eg-tekton.dev/git-0: https://gitlab.com , tekton.dev/git-0: https://github.com , tekton.dev/docker-0: https://gcr.io

          apiVersion: external-secrets.io/v1beta1
          kind: ExternalSecret
          metadata:
            annotations:
              tekton.dev/git-0: "https://github.com"
            name: gitcred-external
            namespace: tekton-pipelines
          spec:
            refreshInterval: "10s"
            secretStoreRef:
              name: vault-root-store
              kind: SecretStore
            target:
              name: gitcred-capten-pipeline
            data:
            - secretKey: password
              remoteRef:
                key: <vault path cpoied from ui>
                property: accessToken
            - secretKey: username
              remoteRef:
                key: <vault path copied from ui>
                property: userID
             

* Container registry secret

   Go to *onboarding-->container registry* under the respective container registry, where the path of the vault where the credentials of container registry  stored can be viewed.copy the path and add it to the path in the external secret yaml as given below

         apiVersion: external-secrets.io/v1beta1
         kind: ExternalSecret
         metadata:
           annotations:
             tekton.dev/git-0: "https://github.com"
           name: docker-external
           namespace: tekton-pipelines
         spec:
           refreshInterval: "10s"
           secretStoreRef:
             name: vault-root-store
             kind: SecretStore
           target:
             name: docker-credentials-capten-pipeline
           data:
           - secretKey: config.json
             remoteRef:
               key: <vault path copied from ui>
               property: config.json

   

* Cosign docker login secret
   
  Go to *onboarding-->conatainer registry* under the respective container registry  where the path of the vault in which the credentials of container registry  stored can be viewed.copy the path and add it to the path in the external secret yaml as given below

      apiVersion: external-secrets.io/v1beta1
      kind: ExternalSecret
      metadata:
        annotations:
          tekton.dev/git-0: "https://github.com"
        name: cosign-docker-external
        namespace: tekton-pipelines
      spec:
        refreshInterval: "10s"
        secretStoreRef:
          name: vault-root-store
          kind: SecretStore
        target:
          name: cosign-docker-secret-capten-pipeline
        data:
        - secretKey: password
          remoteRef:
            key: <vault path copied from ui>
            property: password
        - secretKey: registry
          remoteRef:
            key: <vault path copied from ui>
            property: registry
        - secretKey: username
          remoteRef:
            key: <vault path copied from ui>
            property: username


* Argocd secret
   
  Use the below secret yaml  and replace the password with the encoded argocd password which can be obtained by using the **kubectl** command  and the server url is obtained from the capten ui under *capten-->platform-engineering* .Copy the repo url from the argocd setup ,encoded it and add it to the server url.Username is admin ,add the encoded username to the yaml given below
  
 ```bash     
  kubectl get secrets argocd-initial-admin-secret -n argo-cd
  ```    
      
      apiVersion: v1
      data:
        PASSWORD: <replace with encoded argocd secret>
        SERVER_URL: <repo url copied from ui>
        USERNAME: <encoded username>
      kind: Secret
      metadata:
        name: argocd-capten-pipeline
        namespace: tekton-pipelines
      type: Opaque

* cosign-keys

  Now the cosign keys secret is automatically created in tekton-pipelines namespace.
  
* Extra-config secret

  Go to *onboarding-->git* under the respective git project where  the path of the vault in which the credentials of git  stored can be viewed.copy the path and add it to the path in the external secret yaml as given below

      apiVersion: external-secrets.io/v1beta1
      kind: ExternalSecret
      metadata:
        annotations:
          tekton.dev/git-0: "https://github.com"
        name: extraconfig-external
        namespace: tekton-pipelines
      spec:
        refreshInterval: "10s"
        secretStoreRef:
          name: vault-root-store
          kind: SecretStore
        target:
          name: extraconfig-capten-pipeline
        data:
        - secretKey: GIT_TOKEN
          remoteRef:
            key: <vault path copied from ui>
            property: accessToken
        - secretKey: GIT_USER_NAME
          remoteRef:
            key: <vault path copied from ui>
            property: userID


# Prepare Pipeline Resources For The Tekton Pipeline

Now commit the required pipeline,rbac,triggers and ingress in the customer repo under the directory *cicd-->tekton-pipelines-->templates*.Now go to the **argocd ui** and sync the tekton-pipelines application manually.

 ![PipelineResource](./infra.png)

# Triggering Tekton Pipeline
 
Now add the **webhook url** to the tekton ci/cd repo on which the tekton pipeline needs to be executed upon trigger.Also create a new folder **qt_test** in the root directory and place the qt test.yaml file which contains the testcases to test the deployed application inside the floder so that the tekton pipeline can run the testcases when the qt task is triggered   

once all the setup is done and now when a changes is commited in the tekton ci/cd repo the tekton pipeline will get executed and the image gets built and pushed to the container registry ,the built image is then signed using cosign and finally once the application is deployed in the bussiness cluster the qt task in the pipeline will run the testcase to test the application.

 ![WebhookImage](./webhook-img.png)


# What is Proact and how to use it?

Proact is CLI/CI Tool for Automating Vulnerability Management for Enhancing Software Supply Chain Security Measures.

After selecting proact from the installed apps, you will be treated with a list of schedules, if there are any. To create a new schedule click on Schedule Scan repo.

![proact create schedule](.readme_assets/proact-create-schedule.png)

Fill all the details for the schedule and config

| Attribute   | Description                           |
| ----------- | ------------------------------------- |
| Schedule Name  | Name of the schedule               |
| Select Container Registry | Select the container registry        |
| Cron Schedule    | Schedule for the job in crontab expression           |
| Scan Config        | Config details for the job             |

![proact schedule details](.readme_assets/proact-schedule-details.png)
proact-schedule-details

<b>sample config</b>
```json
[
    {
        "docker_image_name": "arunnintelops/qt-test-application:latest", // Docker image name
        "pyroscope_enabled": "true", // To enable pyroscope
        "pyroscope_url": "https://pyroscope.awsdemo.optimizor.app", //Url for pyroscope
        "pyroscope_app_name": "qt.test.application", //Application name in pyroscope
        "rebuild_image": "false" //Option to enable or disable rebuild image after scanning
    }
]
```
Afet successful scan you can view the result of the scan.

proact-schedule-results
![proact schedule results](.readme_assets/proact-schedule-results.jpg)