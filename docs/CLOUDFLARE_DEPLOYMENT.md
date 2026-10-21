# Peptivelo deployment

The Worker is named `peptivelo` and enables its public workers.dev address.
Preview URLs remain disabled. Indexing remains disabled with SITE_INDEXABLE=false.

## GitHub build settings

- Repository: leoleonar071/Peptivelo
- Production branch: main
- Root path: /
- Build command: npm run build:vinext
- Deploy command: npx cf deploy --prebuilt
- Preview builds: disabled for the initial deployment

## After the first successful deployment

1. Copy the actual HTTPS address assigned by Cloudflare. The account subdomain
   cannot be inferred from the GitHub username.
2. In the Worker's Settings > Build configuration, add the build environment
   variable NEXT_PUBLIC_SITE_URL with that exact origin (no trailing slash).
3. Trigger a new build/deployment so canonical, Open Graph and sitemap URLs use
   that origin. Check those outputs and the home/comparison routes online.
4. When connecting a custom domain, replace NEXT_PUBLIC_SITE_URL with its HTTPS
   origin and rebuild again. Configure the domain in Cloudflare as well; setting
   the variable alone does not connect DNS or TLS.

Do not enable indexing until content, operator/legal details and production
checks are complete. SITE_INDEXABLE is currently set in cloudflare.config.ts;
change the versioned setting deliberately for launch.

The earlier CLOUDFLARE_COMPATIBILITY.md records the historical local assessment;
its statements about disabled workers.dev describe that earlier configuration.
