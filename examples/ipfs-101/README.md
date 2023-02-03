<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://raw.githubusercontent.com/ipfs/helia/feat/initial-implementation/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Tutorial 101</b></h3>

<p align="center">
  <b><i>Getting started with Helia</i></b>
  <br />
  <br />
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
  - [Installation and Running example](#installation-and-running-example)
- [Usage](#usage)
  - [Code analysis](#code-analysis)
    - [Blockstore](#blockstore)
    - [Datastore](#datastore)
    - [libp2p](#libp2p)
    - [Helia](#helia)
    - [Putting it all together](#putting-it-all-together)
    - [File systems](#file-systems)
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
> npm start
```

## Usage

In this tutorial, we go through spawning a Helia node, adding a file and cat'ing the file [CID][] locally and through the gateway.

You can find a complete version of this tutorial in [index.js](./index.js). For this tutorial, you need to install all dependencies in the `package.json` using `npm install`.

### Code analysis

#### Blockstore

At it's heart the Interplanetary Filesystem is about blocks.  When you add a file to your local Helia node, it is split up into a number of blocks, all of which are stored in a [blockstore](https://www.npmjs.com/package/interface-blockstore).

Each block has a [CID][], an identifier that is unique to that block and can be used to request it from other nodes in the network.

A blockstore is a key/value store where the keys are [CID][]s and the values are [Uint8Array][]s.

By default we're going to use an in-memory blockstore, though later you may wish to use one that stores blocks on a filesystem.

```js
import { MemoryBlockstore } from 'blockstore-core'

const blockstore = new MemoryBlockstore()
```

#### Datastore

Some facility to store information is required, this needs a [datastore](https://www.npmjs.com/package/interface-datastore).

Similar to the blockstore, a datastore is a key/value store where the keys are strings and the values are [Uint8Array][]s.

```js
import { MemoryDatastore } from 'datastore-core'

const datastore = new MemoryDatastore()
```

#### libp2p

[libp2p][] is the networking layer that IPFS works on top of.  It is a modular system, comprising of transports, connection encrypters, stream multiplexers, etc.

```js
import { createLibp2p } from 'libp2p'
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
  connectionEncryption: [
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
  ]
})
```

#### Helia

Now we have the components we need, we can create our Helia instance and print out some information about the node:

```js
import { createHelia } from 'helia'

const helia = await createHelia({
  libp2p,
  datastore,
  blockstore
})

const info = await helia.info()

console.info(info.peerId)
```

#### Putting it all together

Running the code above gets you:

```console
> node index.js
PeerId(12D3KooW...)
```

#### File systems

Blocks are all good and well, but to really get moving we need a filesystem.  Add the `@helia/unixfs` dependency to your project, create an instance and add some data:

```js
import { unixfs } from '@helia/unixfs`

// create an UnixFS instance by passing the Helia node to the factory function
const fs = unixfs(helia)

// we will use the `TextEncoder` to turn a string into a Uint8Array
const encoder = new TextEncoder()

// add the bytes to your Helia node and receive a CID
const cid = await fs.add(encoder.encode('Hello World 101'))

// let's see what it looks like
console.log('Added file:', cid)
```

You can now go to an IPFS Gateway and load the printed hash from a gateway. Go ahead and try it!

```bash
> node 1.js
Version: 0.31.2

Added file: bafkreife2klsil6kaxqhvmhgldpsvk5yutzm4i5bgjoq6fydefwtihnesa
# Copy that hash and load it on the gateway, here is a prefiled url:
# https://ipfs.io/ipfs/bafkreife2klsil6kaxqhvmhgldpsvk5yutzm4i5bgjoq6fydefwtihnesa
```

The last step of this tutorial is retrieving the file back using the `cat` 😺 call.

```js
const decoder = new TextDecoder()
let text = ''

for await (const chunk of fs.cat(cid)) {
  text += decoder.decode(chunk, {
    stream: true
  })
}

console.log('Added file contents:', text)
```

That's it! You just added and retrieved a file from the Distributed Web!

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