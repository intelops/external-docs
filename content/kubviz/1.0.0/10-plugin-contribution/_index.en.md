---
title: "Plugin Contribution"
date: 2024-05-21
weight: 10
draft: false
---

You can enhance your cluster monitoring in Kubviz by integrating new plugins. We have integrated several plugins in Kubviz, such as Trivy, Kuberhealthy, Rakees etc. You can add your own favorite plugins to Kubviz to enhance your cluster monitoring capabilities. Here’s how you can do it easily:

1. **Understand the Plugin:** First, get to know the plugin well. Learn how it works, its use cases, and whether it's a CLI application or something else.

2. **Study the Code:** Familiarize yourself with the plugin's code flow. Experiment with the plugin locally to understand its functionality.

3. **Integration Steps:** Once you're comfortable with the plugin, you can start integrating it into Kubviz. Follow these steps for a smooth integration process.

These are the three main steps you need to follow first. Once you complete these steps, you can move on to the next section.

1. **Clone the Repository:** First, clone the Kubviz repository. Create a new branch named after the specific plugin you want to integrate.

2. **Focus on the Agent Side:** Navigate to the agent [plugins directory](https://github.com/intelops/kubviz/tree/main/agent/kubviz/plugins)

3. **Create a New Folder:** In this directory, create a new folder with the plugin's name.

4. **Add the Required Code:** Add the necessary code to run the plugin in the new folder within the agent directory.

5. **Publish Function:** After adding all the required code, create an extra function called Publish (or any name you prefer, as long as it’s not an existing function name used by other plugins). This function is responsible for sending all the data from the plugin output to NATS. The client will then consume this data from NATS for future use (we will explain the client part in the next section). Once you set up the publish function, you are done with the agent side.

Let's take the Ketall plugin as an example. It's a CLI application, so we need to add the required code to run Ketall. We have done this in the file [ketall.go](https://github.com/intelops/kubviz/blob/main/agent/kubviz/plugins/ketall/ketall.go) We also created the `PublishAllResources` function to send all the JSON data to NATS.

As you know, the function needs to be called in the main function. So, you need to call the `PublishAllResources` function in the main() function, which you can find in [k8smetrics_agent.go](https://github.com/intelops/kubviz/blob/main/agent/kubviz/k8smetrics_agent.go)

Now that the agent part is completed, let's look at the client side. The agent will publish all the data to NATS using the Publish function, and the client will consume the data using the Subscribe function. You can refer to the implementation [here](https://github.com/intelops/kubviz/blob/main/client/pkg/clients/kubviz_client.go)

For both the agent and client, you need to set up the configuration for publishing and consuming the data. Data will be published and consumed using the specified subject name and stream name.


Finally, you need to create a schema based on your JSON output and write an insert function to store the data in the ClickHouse database.

### A Quick Demo

#### Directory Structure

```
└── kubviz
    ├── agent
    │   ├── config
    │   │   └── config.go
    │   ├── container
    │   │   ├── api
    │   │   │   └── agent.gen.go
    │   │   ├── cfg.yaml
    │   │   ├── main.go
    │   │   ├── openapi.yaml
    │   │   └── pkg
    │   │       ├── application
    │   │       │   ├── application.go
    │   │       │   ├── github.go
    │   │       │   ├── githubmodule.go
    │   │       │   └── handlers.go
    │   │       ├── clients
    │   │       │   └── nats_client.go
    │   │       ├── config
    │   │       │   └── configuration.go
    │   │       └── handler
    │   │           ├── api_handler.go
    │   │           ├── azure_container.go
    │   │           ├── docker_event_dockerhub.go
    │   │           ├── jfrog_container.go
    │   │           └── quay_handler.go
    │   ├── git
    │   │   ├── api
    │   │   │   └── agent.gen.go
    │   │   ├── cfg.yaml
    │   │   ├── info.txt
    │   │   ├── main.go
    │   │   ├── openapi.yaml
    │   │   └── pkg
    │   │       ├── application
    │   │       │   ├── application.go
    │   │       │   └── handlers.go
    │   │       ├── clients
    │   │       │   └── nats_client.go
    │   │       └── config
    │   │           └── configuration.go
    │   ├── kubviz
    │   │   ├── application
    │   │   │   └── application.go
    │   │   ├── k8smetrics_agent.go
    │   │   ├── plugins
    │   │   │   ├── events
    │   │   │   │   └── event_metrics_utils.go
    │   │   │   ├── ketall
    │   │   │   │   ├── ketall.go
    │   │   │   │   └── ketall_test.go
    │   │   │   ├── kubepreupgrade
    │   │   │   │   └── kubePreUpgrade.go
    │   │   │   ├── kuberhealthy
    │   │   │   │   ├── kuberhealthy.go
    │   │   │   │   └── kuberhealthy_test.go
    │   │   │   ├── kubescore
    │   │   │   │   ├── kube_score.go
    │   │   │   │   └── kubescore_test.go
    │   │   │   ├── outdated
    │   │   │   │   ├── outdated.go
    │   │   │   │   └── outdated_test.go
    │   │   │   ├── rakkess
    │   │   │   │   ├── rakees_agent.go
    │   │   │   │   ├── rakkess.go
    │   │   │   │   └── rakkes_test.go
    │   │   │   └── trivy
    │   │   │       ├── trivy.go
    │   │   │       ├── trivy_image.go
    │   │   │       ├── trivy_sbom.go
    │   │   │       └── trivy_test.go
    │   │   └── scheduler
    │   │       ├── scheduler.go
    │   │       └── scheduler_watch.go
    │   └── server
    │       └── server.go
    ├── charts
    │   ├── agent
    │   │   ├── Chart.yaml
    │   │   ├── templates
    │   │   └── values.yaml
    │   └── client
    │       ├── Chart.yaml
    │       ├── templates
    │       └── values.yaml
    ├── client
    │   ├── main.go
    │   └── pkg
    │       ├── application
    │       │   └── application.go
    │       ├── clickhouse
    │       │   ├── db_client.go
    │       │   └── statements.go
    │       ├── clients
    │       │   ├── bridge_client.go
    │       │   ├── clients.go
    │       │   ├── container_client.go
    │       │   └── kubviz_client.go
    │       ├── config
    │       │   └── config.go
    │       └── storage
    │           └── store.go
    ├── cmd
    │   └── cli
    │       ├── commands
    │       │   └── sql.go
    │       ├── config
    │       │   ├── config.go
    │       │   └── utils.go
    │       └── main.go
    ├── CODE_OF_CONDUCT.md
    ├── constants
    │   └── constants.go
    ├── dockerfiles
    │   ├── agent
    │   │   ├── container
    │   │   │   └── Dockerfile
    │   │   ├── git
    │   │   │   └── Dockerfile
    │   │   └── kubviz
    │   │       └── Dockerfile
    │   ├── client
    │   │   └── Dockerfile
    │   └── migration
    │       └── Dockerfile
    ├── docker-registry-config.yaml
    ├── docs
    │   ├── CODE_OF_CONDUCT.md
    │   ├── CONFIGURATION_HEALTHCHECK.md
    │   ├── CONFIGURATION.md
    │   ├── CONFIGURATION_MTLS.md
    │   ├── CONFIGURATION_TTL.md
    │   ├── CONTRIBUTING.md
    │   └── LICENSE.md
    ├── gitmodels
    │   ├── azuremodel
    │   │   └── azuremodel.go
    │   └── dbstatement
    │       └── dbstatement.go
    ├── go.mod
    ├── go.sum
    ├── grafana
    │   ├── azure-dashboard.json
    │   ├── bitBucket-dashboard.json
    │   ├── containerBridge-dashboard.json
    │   ├── giTea-dashboard.json
    │   ├── gitHub-dashboard.json
    │   ├── gitLab-dashboard.json
    │   ├── kubeData-dashboard.json
    │   ├── kuberhealthy-dashboard.json
    │   ├── kubeScore-dashboard.json
    │   ├── kubvizDsahboard.json
    │   ├── kubvizFeatures-dashboard.json
    │   └── trivy-dashboard.json
    ├── mocks
    │   └── trivy_client_mock.go
    ├── model
    │   ├── azurecontainer.go
    │   ├── db_event.go
    │   ├── depricatedapi.go
    │   ├── dockercontainerevents.go
    │   ├── gitbridge.go
    │   ├── githubcontainer.go
    │   ├── github_docker.go
    │   ├── jfrogcontainer.go
    │   ├── ketall.go
    │   ├── kuberhealthy.go
    │   ├── kubescore.go
    │   ├── metrics.go
    │   ├── outdated.go
    │   ├── quay.go
    │   ├── rakees.go
    │   ├── trivy.go
    │   ├── trivy_image.go
    │   └── trivy_sbom.go
    ├── pkg
    │   ├── mtlsnats
    │   │   └── mtlsnats.go
    │   └── opentelemetry
    │       └── opentelemetry.go
    ├── quickstart
    │   ├── config
    │   └── dockerfiles
    │       ├── agent
    │       │   ├── Dockerfile.Container
    │       │   ├── Dockerfile.Git
    │       │   └── Dockerfile.Kubviz
    │       └── client
    │           └── Dockerfile.Clients
    ├── quickstart.yml
    ├── README.md
    ├── script
    │   └── wait-for-clickhouse.sh
    ├── SECURITY.md
    └── sql
```

#### Step 1

Consider the below json data you received from the plugin.

```bash
{
  "event": {
    "eventId": "evt-001",
    "eventType": "NodeStatus",
    "eventTime": "2024-05-21T12:30:00Z",
    "node": {
      "nodeId": "node-01",
      "nodeName": "WorkerNode1",
      "status": "Healthy",
      "cpuUsage": 45.2,
      "memoryUsage": 67.8,
      "diskUsage": 70.5
    }
  }
}
```

#### Step 2

Create a Go struct in the [model](https://github.com/intelops/kubviz/tree/main/model) folder to represent the JSON data. This model will be used for both publishing and receiving data from NATS, as well as for storing the data in the database.

```bash
package model

import "time"

type Node struct {
	NodeID      string  `json:"nodeId"`
	NodeName    string  `json:"nodeName"`
	Status      string  `json:"status"`
	CPUUsage    float64 `json:"cpuUsage"`
	MemoryUsage float64 `json:"memoryUsage"`
	DiskUsage   float64 `json:"diskUsage"`
}

type Event struct {
	EventID   string    `json:"eventId"`
	EventType string    `json:"eventType"`
	EventTime time.Time `json:"eventTime"`
	Node      Node      `json:"node"`
}
```

#### Step 3

Once you've finished creating the model, you can proceed to create the publish function. To publish data, you'll use this model. Additionally, you'll need to utilize NATS JetStream to publish the data. Both the model and NATS JetStream will be passed as arguments to your publish function.

To publish the data effectively, you'll require a specific [subject name](https://github.com/intelops/kubviz/blob/main/constants/constants.go). This subject name will serve as the identifier for where our data will be published to NATS. NATS will use this subject name and a consumer name (client side) to consume the data.

```bash
package event

import (
	"encoding/json"
	"log"

	"github.com/nats-io/nats.go"
)

func PublishEvent(event model.Event, js nats.JetStreamContext) error {
	eventJson, err := json.Marshal(event)
	if err != nil {
		return err
	}

	Eventsubject := "METRICS.events"

	_, err = js.Publish(Eventsubject, eventJson)
	if err != nil {
		return err
	}

	log.Printf("Event with ID %s has been published", event.EventID)
	return nil
}
```

#### Step 4

Now that your data is with NATS, you need to consume it from the client side. Remember the subject name in the constants folder we created for our plugin. Use that subject name and the corresponding consumer name to get the data.

Do you need to create a brand new struct to get the data? No, you can use the same struct we used in the publish function.

Below is the [subscription function](https://github.com/intelops/kubviz/blob/main/client/pkg/clients/kubviz_client.go) to get the data from NATS to the client.

```bash
func SubscribeEvent(js nats.JetStreamContext, conn *database.Connection, cfg Config) error {
	subscription, err := js.QueueSubscribe("METRICS.events", "EventConsumer", func(msg *nats.Msg) {
		msg.Ack()
		var event model.Event
		err := json.Unmarshal(msg.Data, &event)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("Event Received: %#v", event)
		conn.InsertEvent(event)
		log.Println()
	})
	if err != nil {
		return err
	}

	log.Printf("Subscribed to subject: %s with consumer: %s", constants.EventSubject, cfg.EventConsumer)
	return nil
}
```

#### Step 5

Finally, use the [insert function](https://github.com/intelops/kubviz/blob/main/client/pkg/clickhouse/db_client.go) to store your data in ClickHouseDB for further evaluation and visualization.

```bash
package clickhouse

import (
	"log"
	"time"
	"github.com/intelops/kubviz/model"
)

const InsertEventQuery = `
INSERT INTO events (event_id, event_type, event_time, node_id, node_name, status, cpu_usage, memory_usage, disk_usage)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`

type DBClient struct {
	conn *sql.DB // Assuming you're using the standard library database/sql package
}

// InsertEvent inserts an Event into the database
func (c *DBClient) InsertEvent(event model.Event) {

	tx, err := c.conn.Begin()
	if err != nil {
		log.Fatalf("error beginning transaction, clickhouse connection not available: %v", err)
	}

	stmt, err := tx.Prepare(InsertEventQuery)
	if err != nil {
		log.Fatalf("error preparing statement: %v", err)
	}
	defer stmt.Close()

	currentTime := time.Now().UTC()

	if _, err := stmt.Exec(
		event.EventID,
		event.EventType,
		event.EventTime,
		event.Node.NodeID,
		event.Node.NodeName,
		event.Node.Status,
		event.Node.CPUUsage,
		event.Node.MemoryUsage,
		event.Node.DiskUsage,
	); err != nil {
		log.Fatalf("error executing statement: %v", err)
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("error committing transaction: %v", err)
	}
}
```

Hurray! Finally, you've received the data on your client side and stored it in the database. Execute the database and confirm that your data is indeed stored in the database.