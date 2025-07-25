<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Getting started with Helia</b></h3>

<p align="center">
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://ipfs.github.io/helia/modules/helia.html">Explore the docs</a>
  ·
  <a href="https://codesandbox.io/">View Demo</a>
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
  - [Installation](#installation)
  - [Running Examples](#running-examples)
- [Usage](#usage)
  - [101 - Basics](#101---basics)
  - [201 - Storage](#201---storage)
    - [Blockstore](#blockstore)
    - [Datastore](#datastore)
  - [202 - Persistent Peer ID](#202---persistent-peer-id)
  - [301 - Networking](#301---networking)
    - [libp2p](#libp2p)
  - [302 - Local Peer Discovery](#302---local-peer-discovery)
  - [303 - Prometheus Metrics](#303---prometheus-metrics)
  - [304 - Private Network](#304---private-network)
  - [401 - Pinning](#401---pinning)
  - [402 - Providing](#402---providing)
  - [403 - Block Brokers](#403---block-brokers)
  - [501 - IPNS](#501---ipns)
  - [Putting it all together](#putting-it-all-together)
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

### Installation

```console
> npm install
```

### Running Examples

```console
> npm run 101-basics
> npm run 102-unixfs-dirs
> npm run 103-glob-unixfs
> npm run 201-storage
> npm run 202-persistent-peer
> npm run 301-networking
> npm run 302-mdns
> npm run 303-metrics
> npm run 304-pnet
> npm run 401-pinning
> npm run 402-providing
> npm run 403-block-brokers
```

## Usage

In this tutorial, we go through spawning a Helia node and interacting with [UnixFS](https://docs.ipfs.tech/concepts/glossary/#unixfs), adding bytes, directories, and files to the node and retrieving them.

It is split into multiple parts, each part builds on the previous one - basics of interaction with UnixFS, storage, networking, and finally providing, garbage collection and pinning.

For this tutorial, you need to install all dependencies in the `package.json` using `npm install`.

### 101 - Basics

The [first example](./101-basics.js) goes into the the basics of interacting with UnixFS, adding bytes, directories, and files to the node and retrieving them.

To run it, use the following command:

```console
> npm run 101-basics
```

### 102 - UnixFS Dirs

The [second example](./102-unixfs-dirs.js) goes into the basics of working with directories with UnixFS.

To run it, use the following command:

```console
> npm run 102-unixfs-dirs
```

### 103 - Glob UnixFS

The [third example](./103-glob-unixfs.js) goes into using [`globSource`] to merkelize files and directories from your local file system into UnixFS and exporting the UnixFS DAG as a CAR file.

To run it, use the following command:

```console
> npm run 103-glob-unixfs
```

### 201 - Storage

Take a look at [201-storage.js](./201-storage.js) where we explore how to configure different types of persistent storage for your Helia node.

To run it, use the following command:

```console
> npm run 201-storage
```

If you run the example twice: you may notice that the second time the file is found in the blockstore without being added again.

#### Blockstore

At it's heart IPFS is about blocks of data addressed by a [CID][]. When you add a file to your local Helia node, it is split up into a number of blocks, all of which are stored in a [blockstore](https://www.npmjs.com/package/interface-blockstore).

Each block has a [CID][], an identifier that is unique to that block and can be used to request it from other nodes in the network.

A blockstore is a key/value store where the keys are [CID][]s and the values are [Uint8Array][]s.

By default we're going to use an in-memory blockstore, though later you may wish to use one that stores blocks on a filesystem.

```js
import { MemoryBlockstore } from 'blockstore-core'

const blockstore = new MemoryBlockstore()
```

There are many blockstore implementations available. Some common ones are:

- [blockstore-fs](https://www.npmjs.com/package/blockstore-fs) - store blocks in a directory on the filesystem using Node.js
- [blockstore-idb](https://www.npmjs.com/package/blockstore-idb) - store blocks in [IndexedDB][] in the browser
- [blockstore-s3](https://www.npmjs.com/package/blockstore-s3) - store blocks in an AWS [S3][] bucket

#### Datastore

The [datastore](https://www.npmjs.com/package/interface-datastore) stores Helia and libp2p state, such as IPNS names, MFS root CID, pin metadata, kad-dht routing table, and peer store data including WebRTC certificates.

Similar to the blockstore, a datastore is a key/value store where the keys are strings and the values are [Uint8Array][]s.

```js
import { MemoryDatastore } from 'datastore-core'

const datastore = new MemoryDatastore()
```

Commonly used datastore implementations are:

- [datastore-level](https://www.npmjs.com/package/datastore-level) - store key/value pairs in a [LevelDB](https://github.com/google/leveldb) instance
- [datastore-idb](https://www.npmjs.com/package/datastore-idb) - store key/value pairs in [IndexedDB][] in the browser
- [datastore-s3](https://www.npmjs.com/package/datastore-s3) - store key/value pairs in an AWS [S3][] bucket

### 202 - Persistent Peer ID

The [202-persistent-peer.js](./202-persistent-peer.js) example demonstrates how to create a Helia node with a persistent peer ID using the [FsDatastore](https://www.npmjs.com/package/datastore-fs).

This is useful when you want your node to maintain the same identity in the network, allowing other peers to recognize and trust your node consistently.
To run it, use the following command:

```console
> npm run 202-persistent-peer
```

If you run the example twice, you will see that the peer ID is the same.

### 301 - Networking

The final example is [301-networking.js](./301-networking.js).

Adding blocks to your local blockstore is great but using your Helia node's libp2p instance allows you to unlock the full power of the distributed web.

With libp2p configured you can retrieve blocks from remote peers, and those peers can retrieve blocks from you.

#### libp2p

[libp2p][] is the networking layer that IPFS works on top of.  It is a modular system, comprising of transports, connection encrypters, stream multiplexers, etc.

```js
import { createLibp2p } from 'libp2p'
import { identifyService } from 'libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'
import { MemoryDatastore } from 'datastore-core'

const datastore = new MemoryDatastore()

const libp2p = await createLibp2p({
  datastore,
  transports: [
    webSockets()
  ],
  connectionEncrypters: [
    noise()
  ],
  streamMuxers: [
    yamux()
  ],
  peerDiscovery: [
    bootstrap({
      list: [
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
      ]
    })
  ],
  services: {
    identify: identifyService()
  }
})
```

### 302 - Local Peer Discovery

The [302-mdns.js](./302-mdns.js) example demonstrates how to use multicast DNS for local peer discovery.

This allows Helia nodes on the same local network to automatically discover each other without requiring bootstrap nodes or DHT lookups.

```js
import { mdns } from '@libp2p/mdns'

// Configure libp2p with mDNS discovery
const libp2p = await createLibp2p({
  // ... other configuration ...
  peerDiscovery: [
    mdns()
  ],
  // ... rest of configuration ...
})

// Listen for peer discovery events
node.libp2p.addEventListener('peer:discovery', (evt) => {
  console.log(`Discovered new peer (${evt.detail.id.toString()}) via MDNS`)
  node.libp2p.dial(evt.detail.multiaddrs)
})
```

To run this example, use the following command:

```console
> npm run 302-mdns
```

### 303 - Prometheus Metrics

The [303-metrics.js](./303-metrics.js) example shows how to enable and expose Prometheus metrics for your Helia node, and how to expose the Prometheus HTTP metrics endpoint.

This is useful for monitoring the performance and behavior of your node in production environments.

```js
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { register } from 'prom-client'

const helia = await createHelia({
  // ... other configuration ...
  libp2p: {
    metrics: prometheusMetrics(),
  }
})

// Create a simple HTTP server to expose metrics
const metricsServer = createServer((req, res) => {
  if (req.url === '/metrics' && req.method === 'GET') {
    register.metrics()
      .then((metrics) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(metrics)
      })
  }
})
metricsServer.listen(9999, '0.0.0.0')
```

To run this example, use the following command:

```console
> npm run 303-metrics
```

#### Other Metrics Implementations

js-libp2p supports two other metrics implementations:

- [@libp2p/devtools-metrics](https://github.com/libp2p/js-libp2p/tree/main/packages/metrics-devtools): for use in the browser with the [js-libp2p DevTools browser extension](https://github.com/libp2p/js-libp2p-devtools)
- [@libp2p/opentelemetry](https://github.com/libp2p/js-libp2p/tree/main/packages/metrics-opentelemetry): for use with OpenTelemetry for both metrics and tracing

### 304 - Private Network

The [304-pnet.js](./304-pnet.js) example demonstrates how to:
- Create a private IPFS network using pre-shared keys
- Connect nodes in a private swarm
- Share content between nodes in the private network

This is useful for creating isolated IPFS networks where only nodes with the correct pre-shared key can connect and share content.

To run this example, use the following command:

```console
> npm run 304-pnet
```

### 401 - Pinning

The [401-pinning.js](./401-pinning.js) example demonstrates how to:
- Run garbage collection
- Pin blocks to prevent them from being garbage collected
- Add metadata to pins

To run it, use the following command:

```console
> npm run 401-pinning
```

### 402 - Providing

The [402-providing.js](./402-providing.js) example shows how to:
- Provide content to the DHT (Distributed Hash Table)
- Make content discoverable by other nodes in the network

To run it, use the following command:

```console
> npm run 402-providing
```

### 403 - Block Brokers

The [403-block-brokers.js](./403-block-brokers.js) example demonstrates how to:
- Configure different block brokers (Bitswap and Trustless Gateway)
- Set up routing options (libp2p and HTTP Gateway)

To run it, use the following command:

```console
> npm run 403-block-brokers
```

### 501 - IPNS

The [501-ipns.js](./501-ipns.js) example demonstrates how to:

- Create and manage IPNS (InterPlanetary Name System) records
- Use DAG-CBOR for encoding data
- Set record lifetime and TTL

To run it, use the following command:

```console
> npm run 501-ipns
```

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
[IndexedDB]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[S3]: https://aws.amazon.com/s3/
