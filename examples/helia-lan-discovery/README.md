<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Helia LAN discovery</b></h3>

<p align="center">
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://ipfs.github.io/helia/modules/helia.html">Explore the docs</a>
  ·
  <a href="https://codesandbox.io/p/sandbox/infallible-haibt-e3lcd4">View Demo</a>
  ·
  <a href="https://github.com/ipfs-examples/helia-examples/issues">Report Bug</a>
  ·
  <a href="https://github.com/ipfs-examples/helia-examples/issues">Request Feature/Example</a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Running example](#installation-and-running-example)
- [Usage](#usage)
  - [General flow](#general-flow)
  - [Testing](#testing)
  - [Further exploration of this example](#further-exploration-of-this-example)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Want to hack on IPFS?](#want-to-hack-on-ipfs)

## About The Project

- Read the [docs](https://ipfs.github.io/helia/modules/helia.html)
- Look into other [examples](https://github.com/ipfs-examples/helia-examples) to learn how to spawn a Helia node in Node.js and in the Browser
- Visit https://dweb-primer.ipfs.io to learn about IPFS and the concepts that underpin it
- Head over to https://proto.school to take interactive tutorials that cover core IPFS APIs
- Check out https://docs.ipfs.io for tips, how-tos and more
- See https://blog.ipfs.io for news and more
- Need help? Please ask 'How do I?' questions on https://discuss.ipfs.io

## Getting Started

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

### Installation and Running example

```console
> npm install

# then in one terminal
> npm run server

# in another terminal
> npm run client
```

To run the test

```console
npm run test
```

You should see all of the output from the server and client nodes, and the test should pass.

## Usage

This example shows how you can use mdns to connect two nodes. Either server/client node can be run first.

Both scripts (src/server.js & src/client.js) will create a helia node, and subscribe to a known pubsub topic, and shut each other down (for ease of testing).

Note: No WAN functionality is enabled, so only nodes on your local network can help with peer-discovery, and only nodes on your local network can be discovered as the code currently stands.. If you want to enable connecting to nodes outside of your WAN, you will need to connect to a bootstrap node and add the `kadDHT` service from `@libp2p/kad-dht`.

### General flow

When you run these two scripts, the general flow works like this:

1. Each node subscribes to the known pubsub topic.
1. When the client node detects a subscription change on the pubsub topic, it will send a `wut-CID` message to the server node.
1. The server node will respond to the `wut-CID` message with the string representation of a CID the server node is providing.
1. The client node will request the content for that CID via `heliaDagCbor.get(CID.parse(msg))`
1. Once the content is received, the client will publish a `done` message to the pubsub topic.
1. The server node will detect the `done` message, and respond with a `done-ACK` message.
1. The client node will detect the `done-ACK` message, respond with a `done-ACK` message of it's own, and shutdown after a timeout (to allow for the message to be sent)
1. The server node will detect the `done-ACK` message, and shutdown immediately.

### Testing

Both scripts should be able to be run in any order, and the flow should work as expected. You can run `npm run test` to check this. The test will fail if the test runs for more than 10 seconds, or errors, but this failure mode is dependent upon the `timeout` command currently.

### Further exploration of this example

Some things to try:

1. See if you can get ping/pong messages working without the nodes shutting down
1. Run the server node from one computer on your local network, and the client node from another computer on your local network
1. Try removing the shutdown code from the scripts, and see if you can get multiple clients to connect
1. See if you can get the server to respond with a list of CIDs in it's blockstore, and have the client choose which one to request
1. See if you can connect to bootstrap nodes with one of your nodes, and use the other node as a LAN only node.


_For more examples, please refer to the [Documentation](#documentation)_

## Documentation

- [IPFS Primer](https://dweb-primer.ipfs.io/)
- [IPFS Docs](https://docs.ipfs.io/)
- [Tutorials](https://proto.school)
- [More examples](https://github.com/ipfs-examples/helia-examples)
- [API - Helia](https://ipfs.github.io/helia/modules/helia.html)
- [API - @helia/unixfs](https://ipfs.github.io/helia-unixfs/modules/helia.html)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the IPFS Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -a -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Want to hack on IPFS?

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)

The IPFS implementation in JavaScript needs your help! There are a few things you can do right now to help out:

Read the [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md) and [JavaScript Contributing Guidelines](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md).

- **Check out existing issues** The [issue list](https://github.com/ipfs/helia/issues) has many that are marked as ['help wanted'](https://github.com/ipfs/helia/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22) or ['difficulty:easy'](https://github.com/ipfs/helia/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Adifficulty%3Aeasy) which make great starting points for development, many of which can be tackled with no prior IPFS knowledge
- **Look at the [Helia Roadmap](https://github.com/ipfs/helia/blob/main/ROADMAP.md)** This are the high priority items being worked on right now
- **Perform code reviews** More eyes will help
  a. speed the project along
  b. ensure quality, and
  c. reduce possible future bugs
- **Add tests**. There can never be enough tests

[cid]: https://docs.ipfs.tech/concepts/content-addressing  "Content Identifier"
[Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[libp2p]: https://libp2p.io
