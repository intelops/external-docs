---
title: "Docs structure"
date: 2023-03-31
weight: 1
draft: false
---

![Compage-banner](compage_logo.svg#gh-light-mode-only)

## Mindmap

```mermaid
mindmap
  root(Learn a programming language)
    Changelog
    Ruby
    Go
    Operating System
      VCS Hosting
      Version Control System
```

<hr/>

## Flowchart

```mermaid
flowchart TD
  A[Changelog] -->|Go| B(Go shopping)
  B --> C{Let me think}
  C -->|One| D[Laptop]
  C -->|Two| E[iPhone]
  C -->|Three| F[fa:fa-car Car]
```

<hr/>

## C4Context

```mermaid
C4Deployment
  title Deployment Diagram for Internet Banking System - Live

  Deployment_Node(mob, "Customer's mobile device", "Apple IOS or Android"){
    Container(mobile, "Changelog", "Xamarin", "Provides a limited subset of the Internet Banking functionality to customers via their mobile device.")
  }

  Deployment_Node(comp, "Customer's computer", "Microsoft Windows or Apple macOS"){
    Deployment_Node(browser, "Web Browser", "Google Chrome, Mozilla Firefox,<br/> Apple Safari or Microsoft Edge"){
      Container(spa, "Go", "JavaScript and Angular", "Provides all of the Internet Banking functionality to customers via their web browser.")
    }
  }

  Deployment_Node(plc, "Big Bank plc", "Big Bank plc data center"){
    Deployment_Node(dn, "bigbank-api*** x8", "Ubuntu 16.04 LTS"){
      Deployment_Node(apache, "Apache Tomcat", "Apache Tomcat 8.x"){
        Container(api, "API Application", "Java and Spring MVC", "Provides Internet Banking functionality via a JSON/HTTPS API.")
      }
    }
    Deployment_Node(bb2, "bigbank-web*** x4", "Ubuntu 16.04 LTS"){
      Deployment_Node(apache2, "Apache Tomcat", "Apache Tomcat 8.x"){
        Container(web, "Web Application", "Java and Spring MVC", "Delivers the static content and the Internet Banking single page application.")
      }
    }
    Deployment_Node(bigbankdb01, "bigbank-db01", "Ubuntu 16.04 LTS"){
      Deployment_Node(oracle, "Oracle - Primary", "Oracle 12c"){
        ContainerDb(db, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
      }
    }
    Deployment_Node(bigbankdb02, "bigbank-db02", "Ubuntu 16.04 LTS") {
      Deployment_Node(oracle2, "Oracle - Secondary", "Oracle 12c") {
        ContainerDb(db2, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
      }
    }
  }

  Rel(mobile, api, "Makes API calls to", "json/HTTPS")
  Rel(spa, api, "Makes API calls to", "json/HTTPS")
  Rel_U(web, spa, "Delivers to the customer's web browser")
  Rel(api, db, "Reads from and writes to", "JDBC")
  Rel(api, db2, "Reads from and writes to", "JDBC")
  Rel_R(db, db2, "Replicates data to")

  UpdateRelStyle(spa, api, $offsetY="-40")
  UpdateRelStyle(web, spa, $offsetY="-40")
  UpdateRelStyle(api, db, $offsetY="-20", $offsetX="5")
  UpdateRelStyle(api, db2, $offsetX="-40", $offsetY="-20")
  UpdateRelStyle(db, db2, $offsetY="-10")
```

<hr/>

## ZenUML

```mermaid
zenuml
  title Reply message
  Changelog->A.method() {
    GO.method() {
      if(condition) {
        return Changelog
        // return early
        @return
        A->Changelog: x11
      }
    }
    return go
  }
```

```mermaid
zenuml
  BookLibService.Borrow(id) {
    User = Changelog.GetUser()
    if(User.isActive) {
      try {
        BookRepository.Update(id, onLoan, User)
        receipt = new Receipt(id, dueDate)
      } catch (BookNotFoundException) {
        ErrorService.onException(BookNotFoundException)
      } finally {
        Connection.close()
      }
    }
    return receipt
  }
```

<hr/>

<!-- hidding this twitter for now since twitter account is having issues.

[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/fold_left.svg?style=social&label=Follow%20%40IntelOpsAi)](https://twitter.com/IntelOpsAi) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Draw%20and%20Generate%20Code&url=https://github.com/intelops/compage&via=IntelOpsAi&hashtags=compage,codegeneration,cloud,devops)

-->

This section is a high-level overview of how the Compage Documentation is structured. It will help you use the documentation more effectively by guiding you on where to look for specific information.

The Compage Documentation covers everything you need to know about Compage. It made up of four main sections which are:

- [Getting started](../3-installation)
- [Contributing](../6-contribution)
- [User Guide](../5-guides)
- [FAQs](../8-faq)

## Introduction

In the `introduction` section, you will find the three pages below. Head over to the `Installation` page to get the Compage up and running on your KinD cluster.
The `What is Compage?` page summarizes the goals and features of the Compage project.

- [What is Compage?](../2-overview)
- [Community](../4-community)
- [Installation](../3-installation)

## Contributing

Compage is written in `Golang`, `NodeJS` and `ReactJS` and is `Apache License` - contributions are always welcome whether that means providing feedback, be it through GitHub, through the `#feedback` channel on our [Discord server](https://discord.gg/DeapQc22qe) or testing existing and new features. All the relevant information below:

- [Contribute](../6-contribution)

## Guides

We want to be able to give Compage users the tips and guidance necessary to be able to get the most value from the tool as quickly as possible. That's why we will be continuously adding and updating informative guides and series in which try to relay valuable and actionable advice.

- [How to use Compage](../5-guides)

## FAQs

Find all the answers to all the Compage related questions you might have. Feel free to reach out via the `#feedback` channel on [Discord](https://discord.gg/DeapQc22qe) to request the inclusion of additional questions.

- [FAQs](../8-faq)
