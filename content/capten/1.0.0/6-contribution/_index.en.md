---
title: "Contribution"
date: 2023-07-24
weight: 6
draft: false
---

# Contribution Guidelines
Please read this guide if you plan to contribute to the Capten. We welcome any kind of contribution. No matter if you are an experienced programmer or just starting, we are looking forward to your contribution.

## Reporting Issues

If you find a bug while working with the Capten, please open an issue on GitHub with the label `bug` and let us know what went wrong. We will try to fix it as quickly as we can.

## Feature Requests

We're always open to new ideas and improvements. If you have a feature in mind that you'd like to see implemented, please feel free to suggest it by opening an issue for Capten Plugins, kad, or Capten.

You are more than welcome to open issues to the below projects 

[suggest new features for Capten CLI](https://github.com/intelops/capten/issues/new?labels=kind%2Ffeature&template=feature-request.md&title=Feature%20Request:)


[suggest new features for kad](https://github.com/kube-tarian/kad/issues/new?labels=kind%2Ffeature&template=feature-request.md&title=Feature%20Request:)

[suggest new features for capten-plugins](https://github.com/intelops/capten-plugins/issues/new?labels=kind%2Ffeature&template=feature-request.md&title=Feature%20Request:)

 

## Contributing Code
This project is written in Golang 

To contribute code.
1. Ensure you are running golang version 1.21 or greater for go module support
2. Set the following environment variables:
    ```
    GO111MODULE=on
    GOFLAGS=-mod=vendor
    ```

3. Go ahead and **fork** the repository.Make any changes you want to your fork, and when you're ready to send  those changes to us, go to your fork and create a new pull request.

4. Once your pull request has been opened, it will be assigned to one or more reviewers. Those reviewers will do a thorough code review, looking for correctness, bugs, opportunities for improvement, documentation, comments, and style.

5. Make sure you include relevant updates or additions to documentation when creating or modifying features. Once you’ve received review and approval, your commits are squashed, and your PR is ready for merging.

- Congrats you’re officially a Capten contributor 🎊

---
