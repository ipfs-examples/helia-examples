<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Using Helia inside a NestJS app</b></h3>

<p align="center">
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://ipfs.github.io/helia/modules/helia.html">Explore the docs</a>
  ·
  <a href="https://github.com/ipfs-examples/helia-examples/issues">Report Bug</a>
  ·
  <a href="https://github.com/ipfs-examples/helia-examples/issues">Request Feature/Example</a>
</p>

## About

This is an example of how to run [Helia](https://github.com/ipfs/helia) in a [NestJS](https://nestjs.com/) application.

This demo was created by running the `nest new` command to bootstrap a basic project.

A few changes to the default project config were necessary:

1. Ensure TypeScript outputs ESM and not CJS
    - Please see the [helia-typescript](https://github.com/ipfs-examples/helia-typescript) example for more information
2. Ensure Jest can run TypeScript ESM tests
    - Please see the [helia-jest-typescript](https://github.com/ipfs-examples/helia-jest-typescript) example for more information

## Getting Started

### Prerequisites

https://github.com/ipfs-examples/helia-examples#prerequisites

### Installation and Running example

```console
> npm install
> npm start
```

Now open your browser at `http://localhost:3000`

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

#### `npm test`

Runs the [Jest](https://www.npmjs.com/package/jest) unit test suite.

#### `npm run test:e2e`

Runs the [Jest](https://www.npmjs.com/package/jest) end-to-end test suite.

## Usage

This is a [NestJS](https://nestjs.com/) project bootstrapped with [`nest new $project_name`](https://docs.nestjs.com/#installation) integrated with `helia`.

You can start editing the app by modifying `src/main.js`.

### Learn More

To learn more about NestJS, take a look at the following resources:

- [NestJS Documentation](https://docs.nestjs.com/) - learn about NestJS features and API.

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
