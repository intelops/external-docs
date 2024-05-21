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