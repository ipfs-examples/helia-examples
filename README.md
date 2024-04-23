<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center">A collection of Helia examples</h3>

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
  - [Examples](#examples)
    - [Basics](#basics)
    - [Frameworks](#frameworks)
    - [Bundlers](#bundlers)
    - [Testing](#testing)
    - [Other tooling](#other-tooling)
  - [Prerequisites](#prerequisites)
- [IPFS Tutorials at ProtoSchool](#ipfs-tutorials-at-protoschool)
- [Documentation](#documentation)
- [Contributing](#contributing)
  - [How to add a new example](#how-to-add-a-new-example)
    - [Examples must](#examples-must)
    - [Update `helia` to run tests against the repo](#update-helia-to-run-tests-against-the-repo)
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

### Examples

Feel free to jump directly into the examples, however going through the following sections will help build context and background knowledge.

#### Basics

- [Helia-101](/examples/helia-101/): Spawn a Helia node, add a file and cat the file
- [Helia CommonJS](/examples/helia-cjs/): Just like Helia-101, but with [CommonJS](https://en.wikipedia.org/wiki/CommonJS) instead of [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Helia via CDNs](/examples/helia-script-tag/): A simple proof-of-concept to distributing and using Helia using `<script>` tags
- [Creating a CAR file with Helia](/examples/helia-create-car/): An example showing how to create a car file with Helia. CAR files are useful for making Filecoin deals.

#### Frameworks

- [Helia with Electron](/examples/helia-electron/): Create an Electron app with Helia
- [Helia with Next.js](/examples/helia-nextjs/): Create a Next.js app with Helia
- [Helia with NestJS](/examples/helia-nestjs/): Create a NestJS app with Helia
- [Helia with Vue](/examples/helia-vue/): Create a vue app with Helia
- [Helia with Vite](/examples/helia-vite/): Create a react+vite app with Helia

#### Bundlers

- [Helia with esbuild](/examples/helia-esbuild/): Bundle Helia with esbuild
- [Helia with Webpack](/examples/helia-webpack/): Bundle Helia with webpack

#### Testing

- [Helia with Jest](/examples/helia-jest/): Test Helia with Jest
- [Helia with Jest and TypeScript](/examples/helia-jest-typescript/): Test Helia with Jest and TypeScript

#### Other tooling

- [Helia with TypeScript](/examples/helia-typescript/): Building Helia with TypeScript
- [Helia with ts-node](/examples/helia-ts-node/): Run Helia using ts-node

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## IPFS Tutorials at ProtoSchool

Explore [ProtoSchool's IPFS tutorials](https://proto.school/#/tutorials?course=ipfs) for interactive Helia coding challenges, deep dives into DWeb concepts like content addressing, and more.

## Documentation

- [IPFS Primer](https://dweb-primer.ipfs.io/)
- [IPFS Docs](https://docs.ipfs.io/)
- [Tutorials](https://proto.school)
- [More examples](https://github.com/ipfs-examples/helia-examples)
- [API - Helia](https://ipfs.github.io/helia/modules/helia.html)
- [API - @helia/unixfs](https://ipfs.github.io/helia-unixfs/modules/helia.html)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the IPFS Examples Project (`https://github.com/ipfs-examples/helia-examples`)
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -a -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### How to add a new example

1. Decide on a pithy folder name for your example, it should start with `helia-` and ideally be one or two words that describe what it's about - e.g. `helia-transfer-files`
1. Create a folder in this repo under `examples`, eg. `./examples/helia-transfer-files`
1. Add the files and tests that make up the example
1. Add the folder name to the `project-list` lists in the `examples` and `push-changes` jobs in this repositories `./github/ci.yml`
1. Open a PR with your changes
1. :warning: Maintainer required: Use the [helia-example-fork-go-template](https://github.com/ipfs-examples/example-fork-go-template) to create a new repo in the `ipfs-examples` org for the new example to live in.
   - Give it the same name as the example folder, e.g. `https://github.com/ipfs-examples/helia-transfer-files`
   - Disable wikis, projects, and issues
1. :warning: Maintainer required: Review the example
   1. Does it show the example clearly and concisely?
   1. Does it have tests?
   1. Does it contain the `.github` folder?
   1. Has it been added to the `project-list` lists in the `examples` and `push-changes` jobs in the  `./github/ci.yml` file of this repo?
1. :warning: Maintainer required: Merge the example, after a successful build all files should be copied into the newly created repo.

#### Examples must

- Live inside the `/examples/` folder
- Have tests and should make use of `test-util-ipfs-example` library
- Implement the following scripts:
 - `clean`: used to clean all the unnecessary code (e.g.: files generated by bundlers and package managers)
 - `build`: used to build the example
 - `start`: used to start the example
 - `test`: used to test the example
- The `README.md` must have (see example inside `example-template`):
  - Link to `Codesandbox.com` for one-click running demonstration
  - References for documentation/tutorials used to build the example
  - _Optional:_ Screenshots, gifs, etc... under `img/` folder
- Update the CI to run the tests of the new example as standalone
  - Edit `github/workflows/ci.yml`
  - Add the test name to `project` under `matrix`

#### Update `helia` to run tests against the repo

Open a PR to the [ipfs/helia](https://github.com/ipfs/helia) project that edits the `.github/workflows/examples.yml` in order to make sure a Helia release does not break your new example.

Search `.github/workflows/test.yml` for the `test-examples` section and add a block at the end of the `example` matrix key similar to:

```yml
- name: my super fun new example
  repo: https://github.com/ipfs-examples/helia-my-super-fun-new-example.git
  deps: helia@$PWD/packages/helia/dist
```

The value of the `deps` key will vary depending on which modules from Helia your example uses. Above we override the `helia` module, but your example may different deps.

Please see the existing setup in `.github/workflows/test.yml` for how to ensure you are overriding the correct modules.

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
