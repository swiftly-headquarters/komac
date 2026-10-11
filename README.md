# Komachi

> **Fork notice:** Komachi is a fork of [Kumo](https://kumo-ui.com/) ([source](https://github.com/cloudflare/kumo)), the component library by Cloudflare, Inc. It is not affiliated with or endorsed by Cloudflare. Kumo is MIT licensed; see [LICENSE](./LICENSE).

Komachi component library (`packages/komachi`, published to npm as `@swiftlylabs/komachi`) and its documentation website (`packages/komachi-web`, Astro static site).

```bash
pnpm install
pnpm dev      # docs site at http://localhost:4321
pnpm build    # builds the library, then the site into packages/komachi-web/dist
pnpm start    # serves the built site on $PORT (default 3000)
pnpm test     # library unit tests
```

## Deploy the website (Railpack)

`railpack.json` at the repo root builds with `pnpm run build` and serves `packages/komachi-web/dist` with `pnpm run start`. Point Railpack at the repo root; no extra config needed.

## Publish to npm

Publishing runs from GitHub Actions (`.github/workflows/publish.yml`) when a GitHub Release is published. Bump `version` in `packages/komachi/package.json` first, and add an `NPM_TOKEN` repository secret.

## License

MIT. Includes work derived from [Kumo](https://kumo-ui.com/) by Cloudflare, Inc. (MIT); see [LICENSE](./LICENSE).
