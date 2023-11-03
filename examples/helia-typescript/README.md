<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>Building Helia with TypeScript</b></h3>

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

[ECMAScript Modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) are how JavaScript applications organise code into multiple files and import those files into other parts of the application. They became part of the language in [2015](https://262.ecma-international.org/6.0/) and are now supported on all platforms.

Prior to this the de facto standard for JavaScript modules was [CommonJS](https://en.wikipedia.org/wiki/CommonJS) though this scheme was never adopted as a standard so remains a userland attempt to solve the problems of code modularisation.

As part of the standard, an `import` of an ES module returns a Promise whereas a `require` of a CJS module returns the module itself so unfortunately these two schemes are incompatible with each other. Most transpilation engines allow the use of `import` with CJS, however the reverse is not true.

The normal way to load one TypeScript module from another is to use the ESM-looking `import` statement, however by default it will output CJS code:

**Config**

```json
{
  "compilerOptions": {
    "target": "ES2015",

    "moduleResolution": "node",
    "skipLibCheck": true,
    "outDir": "./dist"
  }
}
```

**Source code**

```ts
import { createHelia } from 'helia'

createHelia()
  .then(() => {
    console.info('Helia is running')
    console.info('PeerId:', helia.libp2p.peerId.toString())
  })
```

**Compiled code**

```js
Object.defineProperty(exports, "__esModule", { value: true });
const helia_1 = require("helia");
(0, helia_1.createHelia)().then(() => {
    console.info('Helia is running');
    console.info('PeerId:', helia.libp2p.peerId.toString());
});
```

Helia is bundled using ESM and not CJS so this will fail at runtime:

```console
% node dist/index.js
node:internal/modules/cjs/loader:544
      throw e;
      ^

Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in /path/to/project/node_modules/helia/package.json
    at new NodeError (node:internal/errors:399:5)
    at exportsNotFound (node:internal/modules/esm/resolve:361:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:641:13)
    at resolveExports (node:internal/modules/cjs/loader:538:36)
    at Module._findPath (node:internal/modules/cjs/loader:607:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1033:27)
    at Module._load (node:internal/modules/cjs/loader:893:27)
    at Module.require (node:internal/modules/cjs/loader:1113:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/path/to/project/index.js:4:17) {
  code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
}
```

To fix this error, `"module"` and `"target"` must be set to at least `"ES2015"`.

These are the very minimum versions that will build ESM and not CJS - your application may require something more recent depending on which JavaScript features you are using.

If in doubt, look at the compiled code your application generates.  If you see use of the `require` function, you are building CJS and need to change your `"module"` setting.

**Config**

```json
{
  "compilerOptions": {
    "module": "ES2015",
    "target": "ES2015",

    "moduleResolution": "node",
    "skipLibCheck": true,
    "outDir": "./dist"
  }
}
```

**Source code**

```ts
import { createHelia } from 'helia'

createHelia()
  .then(() => {
    console.info('Helia is running')
  })
```

**Compiled code**

```js
import { createHelia } from 'helia';
createHelia()
    .then(helia => {
    console.info('Helia is running');
    console.info('PeerId:', helia.libp2p.peerId.toString());
});
```

**Output**

```console
% node dist/index.js
Helia is running
PeerId: 12D3KooWNj6PKy8boHWnDi39NTEJKomw4u6gW9umfpfRNzJPCv7e
```

## Usage

You can use [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to build the project and then node to run it with:

```console
% npm start
```

## About The Project

- Read the [docs](https://ipfs.github.io/helia/modules/helia.html)
- Look into other [examples](https://github.com/ipfs-examples/helia-examples) to learn how to spawn a Helia node in Node.js and in the Browser
- Visit https://dweb-primer.ipfs.io to learn about IPFS and the concepts that underpin it
- Head over to https://proto.school to take interactive tutorials that cover core IPFS APIs
- Check out https://docs.ipfs.io for tips, how-tos and more
- See https://blog.ipfs.io for news and more
- Need help? Please ask 'How do I?' questions on https://discuss.ipfs.io

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