# Deployment

This project deploys to Cloudflare Pages only after CI passes on `main`.

## CI-Gated Deployment

Production deploys are triggered by GitHub Actions, not by Cloudflare Git auto-deploy:

1. Commit your changes (use conventional commit format, e.g. `feat: add feature`):
   ```sh
   git add .
   git commit -m "feat: your feature description"
   ```

2. Push to the main branch:
   ```sh
   git push origin main
   ```

3. The **Test and Deploy** workflow runs lint, unit tests, `yarn build`, and E2E tests, then uploads the `build/` output as an artifact.

4. If Test and Deploy passes on a push to `main`, the **Deploy** job in the same workflow downloads that artifact and uploads it to Cloudflare Pages via Wrangler — the same build that was tested in CI, with no second build step.

If Test and Deploy fails, production stays on the previous deploy. Release commits (`[skip ci]`) do not trigger Deploy. Deploy verifies `https://nickhs.dev` returns HTTP 200 before marking the GitHub deployment successful.

See [Releases](releases.md) for automated versioning and changelog generation.

## Cloudflare Pages Configuration

The Cloudflare Pages project (`portfolio`) uses direct upload from CI. Automatic production branch deployments should be disabled in the Cloudflare dashboard (**Settings → Build & deployments → Branch control**).

GitHub repo secrets required for Deploy:

- `CLOUDFLARE_API_TOKEN` — API token with Account → Cloudflare Pages → Edit
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

## Custom Domain

The custom domain `nickhs.dev` is configured in Cloudflare:

1. DNS is managed through Cloudflare
2. SSL/TLS is automatically handled
3. CDN caching and optimization are enabled

To update the domain or DNS settings, visit your Cloudflare dashboard.

## Local Development Build

To create a production build locally without deploying:

```sh
yarn build
```

This creates an optimized build in the `build` folder. To preview the production build locally:

```sh
yarn preview
```

This will serve the production build at `localhost:4173`.

## Notes

- Production deploys typically complete in 1–2 minutes after Test and Deploy passes
- Cloudflare provides automatic HTTPS, CDN, and DDoS protection
