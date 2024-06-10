---
title: "Container Bridge Contribution"
date: 2024-06-10
weight: 12
draft: false
---

KubViz's container bridge monitors changes in your container registry, providing visibility into image updates, vulnerability footprints.

Similar to the Git bridge, you can integrate a new container registry platform into KubViz, broadening its reach and functionality.

Follow the steps to integrate new container registry platforms into KubViz.

#### Step 1

First, you need to explore the container registry platform and its webhook capabilities to understand the data it sends to the client. Based on this information, you can build a schema for it.

#### Step 2

Based on the data you receive, create a model in the [model folder](https://github.com/intelops/kubviz/tree/main/model)

#### Step 3

Write a function that read all the data from the event, transforms it based on our schema, and publishes it to NATS.

```bash
func (ah *APIHandler) PostEventDockerHub(c *gin.Context) {
	defer func() {
		_, _ = io.Copy(io.Discard, c.Request.Body)
		_ = c.Request.Body.Close()
	}()
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil || len(payload) == 0 {
		log.Printf("%v: %v", ErrReadingBody, err)
		c.Status(http.StatusBadRequest)
		return
	}
	log.Printf("Received event from docker artifactory: %v", string(payload))
	err = ah.conn.Publish(payload, "Dockerhub_Registry")
	if err != nil {
		log.Printf("%v: %v", ErrPublishToNats, err)
		c.Status(http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusOK)
}
```

#### Step 4

Once the data is published, you can subscribe to it from the client based on the [event](https://github.com/intelops/kubviz/blob/main/client/pkg/clients/container_client.go) that occurred.

#### Step 5

Finally, insert the data into the ClickHouse database.

### How to Test?

In order to visualize container events in Kubviz, it is necessary to create a webhook for the respective repository.

You can create a webhook with your own customized data, and in the URL section, you can specify the following format.

#### Step 1

Go to your container registry platform and set up a webhook event with the required data, such as the name of the event and the URL.

The URL for a Container Registry will appear in the following format:

```bash
http://<INGRESS HOSTNAME>/event/docker/hub
```

Please replace the section with the specific ingress host name of your container bridge, and /event/docker/hub may vary depending on you configured in your code.

Possible values are:

Values | Platform |
------ | -------- |
`/github` | GitHub |
`/gitlab` | GitLab |
`/gitea` | Gitea |
`/bitbucket` | BitBucket |
`/azure` | Azure |

#### Step 2

Trigger an event, such as push an image, and the data will be sent to your URL.

#### Step 3

Check the data in the ClickHouse database by querying it, or visualize the data in Grafana.


Congratulations! You have successfully integrated a new Container platform into KubViz, expanding its capabilities and enhancing your workflow!