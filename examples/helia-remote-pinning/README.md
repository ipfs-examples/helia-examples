<p align="center">
  <a href="https://github.com/ipfs/helia" title="Helia">
    <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" width="300" />
  </a>
</p>

<h3 align="center"><b>How to pin content to a remote IPFS pinning service using Helia</b></h3>

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

## About

When we add content to an IPFS node, it needs to remain online in order for
others to retrieve that content.

Some environments such as web browsers are fundamentally short lived - the user
may navigate away from the page, close their browser or laptop lid, for example.

Where users are creating content in these environments, we should use a remote
pinning service to ensure the content is resolvable long after the original
creator has gone offline.

A remote pinning service is a third party node that stores content on behalf of
other nodes. It may be a commercial service or one you have set up yourself.

## Network

We are going to start four nodes.

1. Publisher

This is a browser node which we will use to create some content.

1. Pinning service

This will run under Node.js and it will be used to make the content available
after the publisher has gone offline.

3. Resolver

Another browser node that wishes to fetch the content created by the publisher.

4. Bootstrapper

A Node.js node we will use to allow these peers to discover each other.

## Start the servers

First start the bootstrapper:

```console
$ npm run bootstrapper
bootstrapper listening on
/ip4/127.0.0.1/tcp/64484/p2p/12D3KooWNkqtx14iU9sJV76PgksX3nYW7CPdKZAQPG6ueqzAMgxD
... more addresses here
```

Next start the pinning service:

```console
$ npm run pinning-service.js
pinning service listening on
http://127.0.0.1:64486
```

Now start the publisher:

```console
$ npm run publisher
```

A web browser will open.

Wait for the status to become "Ready". When this has happened, the libp2p node
running on the page has acquired a relay address from the bootstrap node and
can accept incoming WebRTC connections from the pinning service node. This is
necessary for the pinning service to request pinned blocks from the publisher.

Enter some text into the input box and click the "Publish" button.

Copy the CID that is shown on the screen.

You may now close the publisher window if you wish.

Finally start the resolver:

```console
$ npm run resolver
```

When the web browser opens, take the CID you copied previous and enter it into
the input box.

Click "Resolve", after a short delay you should see the content you entered into
the input on the publisher page.

You have just published content using a remote pinning service, then resolved
that content using a different node.

## About The Project

- Read the [docs](https://ipfs.github.io/helia/modules/helia.html)
- Look into other [examples](https://github.com/ipfs-examples/helia-examples) to learn how to spawn a Helia node in Node.js and in the Browser
- Visit https://dweb-primer.ipfs.io to learn about IPFS and the concepts that underpin it
- Head over to https://proto.school to take interactive tutorials that cover core IPFS APIs
- Check out https://docs.ipfs.io for tips, how-tos and more
- See https://blog.ipfs.io for news and more
- Need help? Please ask 'How do I?' questions on https://discuss.ipfs.io

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
