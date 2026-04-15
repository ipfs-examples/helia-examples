<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Test Helia with Jest and TypeScript</b></h3>

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

[Jest](https://jestjs.io/) is a JavaScript testing framework that transpiles code on the fly to enable a fast-feedback testing cycle for the developer.

It is typically used to test browser code, whereby it injects an artificial DOM implementation into the global scope to enable running the actual tests on [Node.js](https://nodejs.org) to take advantage of faster startup times at the cost of not always having 100% feature/behavior parity with the actual target platform.

In some circumstances this is helpful but it can also result in hard to debug errors, particularly around resolving modules and loading them.

Some developers also use Jest to test pure Node.js code which the benefit of familiarity but also has the same issues around transpilation.

Adding [TypeScript](https://www.typescriptlang.org/) into the mix adds another layer of misdirection so the error messages are more cryptic than just running plain JS.

```
Cannot find module 'helia' from '../src/index.ts'

Require stack:
  /path/to/project/src/index.ts
  index.spec.ts

> 1 | import { createHelia } from 'helia'
  2 | import type { Helia } from '@helia/interface'
```

In this example we are going to cover the config necessary to use Jest with TypeScript that compiles to ESM modules.

### 1. TypeScript and ESM

Please see the [helia-typescript](https://github.com/ipfs-examples/helia-typescript) example to ensure your application is building your TypeScript source to ESM correctly.

At the very minimum you should check the compiled output of your application to ensure no calls to `require` are present and instead all modules are loaded via `import`.

### 2. `ts-jest` Transform

[ts-jest](https://www.npmjs.com/package/ts-jest) is a Jest transformer for your `.ts` source files that are under test.

By default it will transpile code to [CommonJS](https://en.wikipedia.org/wiki/CommonJS) which is undesirable if your codebase is designed to be consumed as ESM.

To get it to transform code to ESM, the [useESM](https://kulshekhar.github.io/ts-jest/docs/next/getting-started/options/useESM/) option must be set:

**jest.config.json**

```json
{
  "transform": {
    "^.+\\.(t|j)s$": ["ts-jest", {
      "useESM": true
    }]
  }
}
```

### 3. `ts-jest` Presets

By default `ts-jest` will not be able to load ES Modules:

```
FAIL  test/index.spec.ts
 ● Test suite failed to run

  Cannot find module 'helia' from '../src/index.ts'

  Require stack:
    /Users/alex/Documents/Workspaces/ipfs-examples/helia-examples/examples/helia-jest-typescript/src/index.ts
    index.spec.ts

  > 1 | import { createHelia } from 'helia'
      | ^
    2 | import type { Helia } from '@helia/interface'
```

To fix this it is necessary to tell Jest to use the `ts-jest` `default-esm` preset:

**jest.config.json**

```json
{
  "preset": "ts-jest/presets/default-esm"
}
```

### 4. Importing other files from the same project

When authoring ESM, [file extensions are mandatory](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions), however `ts-jest` will not resolve (for example) `./index.ts` when importing `./index.js`:

```
Cannot find module '../src/index.js' from 'index.spec.ts'

  at Resolver._throwModNotFoundError (../../../node_modules/jest-resolve/build/resolver.js:427:11)
```

The solution is to use a module name mapper to remove the file extension from relative imports and then Jest can fall back to it's version of the Node.js [require.resolve algorithm](https://nodejs.org/api/modules.html#all-together) which will locate `index.ts` from an `index.js` import:

**jest.config.json**

```json
{
  "moduleNameMapper": {
    "^(\\.{1,2}/.*)\\.[jt]s$": "$1"
  }
}
```

## Putting it all together

Your `jest.config.json` should look something like this:

```json
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "test",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": ["ts-jest", {
      "useESM": true
    }]
  },
  "preset": "ts-jest/presets/default-esm",
  "moduleNameMapper": {
    "^(\\.{1,2}/.*)\\.[jt]s$": "$1"
  }
}
```

We can now run the tests:

```console
% NODE_OPTIONS=--experimental-vm-modules jest

 PASS  test/index.spec.ts (6.055 s)
  Helia
    libp2p
      ✓ should have a peer id (519 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        6.134 s
Ran all test suites.
```

That's it! You just successfully ran a suite that can test your Helia application.

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
> npm test
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