# GitHub Actions with Distributed Press

This repository includes examples for deploying websites using [Helia](https://helia.io/) and [Distributed Press](https://distributed.press), an open-source tool for publishing to the World Wide Web and decentralized protocols like IPFS (via [Helia](https://github.com/hyphacoop/api.distributed.press/pull/101)) and [Hypercore](https://holepunch.to/).

## GitHub Actions Workflows

Two GitHub Actions templates are provided in `.github/workflows/`:

1. **static-deploy.yml**: For static websites.

   - [.github/workflows/static-deploy.yml](.github/workflows/static-deploy.yml)
   - **Customize**:
     - `publish_dir`: Set to your static site's output folder ( defaults to root `./`).
     - `site_url`: Replace `example.com` with your domain.

2. **build-deploy.yml**: For projects requiring a build step.
   - [.github/workflows/build-deploy.yml](.github/workflows/build-deploy.yml)
   - **Customize**:
     - `publish_dir`: Set to your build output folder (e.g., `build`).
     - `site_url`: Replace `example.com` with your domain.
     - `publish_branch`: Adjust `gh-pages` to your preferred branch (e.g., `prod`).

> **Note:** Setting `deploy_hyper: true` in the workflows enables the Hypercore P2P protocol, allowing access via `hyper://example.com`.

## Distributed Press Token Setup

1. Obtain a free Distributed Press token from [get-a-token](https://distributed.press/2024/10/18/get-a-token/) page.
2. Add it as `DISTRIBUTED_PRESS_TOKEN` in your repository's **Settings > Secrets and variables > Actions > Secrets**.

### Domain Setup

Configure your domain for Distributed Press:

| Type    | Name                   | Value                    |
| ------- | ---------------------- | ------------------------ |
| `CNAME` | `example.com`          | `api.distributed.press.` |
| `NS`    | `_dnslink.example.com` | `api.distributed.press.` |

**Note**: Include the trailing dot (`.`) in `api.distributed.press.`.

- To obtain an SSL certificate, contact the Distributed Press team. For HTTP publishing, the most convenient method is GitHub Pages. See [GitHub Pages domain setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) for details.

## Deployment Options

There are three ways you can deploy your site:

1. **Sutty CMS**: A no-code platform with templates for easy publishing.
2. **GitHub Actions**: Automate deployment via workflows (as provided above).
3. **Distributed Press CLI**: A command-line tool for advanced site management.

> With the Fediverse [Social Inbox](https://hypha.coop/dripline/announcing-dp-social-inbox/) integration support, your site can receive comments, likes, and replies from the Fediverse.

Please see [Distributed Press Documentation](https://docs.distributed.press/deployment/).

## Congratulations!

Your site is now published over IPFS and can be accessed via `ipns://yourdomain.com`. You’ll also see it on our [explore page](https://explore.distributed.press/) 👀.
