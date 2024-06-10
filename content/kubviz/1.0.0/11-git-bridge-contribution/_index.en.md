---
title: "Git Bridge Contribution"
date: 2024-06-10
weight: 11
draft: false
---


KubViz offers a seamless integration with Git repositories, empowering you to effortlessly track and monitor changes that occur within your codebase. By capturing events such as commits, merges, and other Git activities, KubViz provides valuable insights into the evolution of your code. This comprehensive change tracking capability allows you to analyze the effects of code modifications on your development and deployment workflows, facilitating efficient collaboration among teams.

Currently, KubViz supports integration with the top five Git platforms: GitHub, GitLab, Gitea, Azure, and Bitbucket. You can contribute by adding support for new Git platforms. The following step-by-step documentation will guide you through the process.

#### Step 1

First, you need to explore the Git platform and its webhook capabilities to understand the data it sends to the client. Based on this information, you can build a schema for it.

#### Step 2

Based on the data you receive, create a model in the [model folder](https://github.com/intelops/kubviz/tree/main/model)

#### Step 3

Write a function that receives the raw data from the webhook call, transforms it based on our schema, and publishes it to NATS.

```bash
func (app *Application) PostGithub(c *gin.Context) {
	log.Println("github handler called...")

	tracer := otel.Tracer("github-git")
	_, span := tracer.Start(c.Request.Context(), "PostGithub")
	span.SetAttributes(attribute.String("http.method", "POST"))
	defer span.End()

	defer log.Println("github handler exited...")

	event := c.Request.Header.Get(string(model.GithubHeader))
	if len(event) == 0 {
		log.Println("error getting the github event from header")
		c.Status(http.StatusBadRequest)
		return
	}
	jsonData, err := c.GetRawData()
	if err != nil {
		log.Println("Error Reading Request Body")
		c.Status(http.StatusInternalServerError)
		return
	}
	log.Printf("GITHUB DATA: %#v", string(jsonData))
	app.conn.Publish(jsonData, string(model.GithubProvider), model.GithubHeader, model.EventValue(event))
}
```

#### Step 4

Once the data is published, you can subscribe to it from the client based on the [event](https://github.com/intelops/kubviz/blob/main/client/pkg/clients/bridge_client.go) that occurred.

#### Step 5

Finally, insert the data into the ClickHouse database.

### How to Test?

In order to visualize git events in Kubviz, it is necessary to create a webhook for the respective repository.

You can create a webhook with your own customized data, and in the URL section, you can specify the following format.

#### Step 1

Go to your Git platform and set up a webhook event with the required data, such as the name of the event and the URL.

The URL for a git repository will appear in the following format:

```bash
https://<INGRESS HOSTNAME>/github
```

Please replace the section with the specific ingress host name of your git bridge, and the path /github may vary depending you configured in your code.

Possible values are:

Values | Platform |
------ | -------- |
`/github` | GitHub |
`/gitlab` | GitLab |
`/gitea` | Gitea |
`/bitbucket` | BitBucket |
`/azure` | Azure |

#### Step 2

Trigger an event, such as a push or merge, and the data will be sent to your URL.

#### Step 3

Check the data in the ClickHouse database by querying it, or visualize the data in Grafana.


Congratulations! You have successfully integrated a new Git platform into KubViz, expanding its capabilities and enhancing your workflow!






