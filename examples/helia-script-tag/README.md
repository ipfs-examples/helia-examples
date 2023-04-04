<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Using Helia via <code><script/></code> tags from CDN</b></h3>

<p align="center">
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://ipfs.github.io/helia/modules/helia.html">Explore the docs</a>
  .
  <a href="https://codesandbox.io/p/sandbox/helia-script-tag-g420c3">View codesandbox Demo</a>
  ·
  <a href="https://github.com/ipfs-examples/helia-examples/issues">Report Bug</a>
  ·
  <a href="https://github.com/ipfs-examples/helia-examples/issues">Request Feature/Example</a>
</p>

## Table of Contents

- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Running example](#installation-and-running-example)
- [Usage](#usage)
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

Then open your browser to http://localhost:8888.

## Usage

This example is basic demo and proof of concept for using helia via script tags. Other examples use build-scripts that may be too complicated for your needs. If you have a website where you manage your dependencies via script tags in an HTML file, you may benefit from looking at this example instead of the others at https://github.com/ipfs-examples/helia-examples/tree/main/examples.

If you are seeing errors like `ERR_REQUIRE_ESM` or `ERR_PACKAGE_PATH_NOT_EXPORTED` when trying to use this example, please check out `/examples/helia-cjs` instead.

The main areas of focus should be two files: `index.html` and `src/index.js`.

If you're confused about what the different methods under 'Some Suggestions' are doing, you may want to check out [helia-101](https://github.com/ipfs-examples/helia-101) for a full breakdown of the code.

### Using the example

The page you will see is broken up into 4 sections:

1. The intro: title and global variables you can play with in your browser console
2. Node Status: The status of the helia node, which is updated every 500ms
   * Helia will start up on page load. You can use the 'Start Helia' and 'Stop Helia' to call `helia.start()` and `helia.stop()` respectively.
   * Updated content (look for `nodeUpdateInterval = ` in `src/index.js` to change or edit what's updated):
      * Node Status - shows either "Online" or "Offline".
      * ID - Shows the PeerId of your Helia node.
      * Discovered Peers - The count of peers discovered. Check the event log at the bottom of the page to see their IDs.
      * Connected Peers - The count of peers your helia node is connected to. Also, a list of their `PeerId`s will render if the count is > 0.
3. Suggestions: Try out these code snippets in your browser terminal, in order.
4. Event Log: Elapsed-TimeStamped messages showing you some of what Helia and it's managed libp2p node are doing. This event log shows:
   * instantiation of the libp2p instance passed to helia
   * instantiation of the Helia node
   * peer discovery
   * peer connection
   * peer disconnection

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
