# Aster House storefront prototype

A responsive, static storefront concept built around the two bedding photographs supplied in the workspace. No build step or package installation is required.

## Run locally

Serve this folder with any static file server (for example, `npx serve .` or Python's `http.server`) and open the served root. Opening `index.html` directly may block the catalog fetch in some browsers; `products.json` is loaded at runtime.

## Included

- Editorial home page and dedicated About page with mobile navigation, collection anchors, quality story, newsletter interaction, footer, and product discovery.
- Product data loaded at runtime from `products.json`; unknown price, SKU, materials, sizes, stock, rating, thread count, and review facts are `null`.
- Collection filtering, sorting, and search across product names, category, collection, color, and tags.
- Persistent browser cart and wishlist, quantity changes, removal, empty states, and responsive drawers.
- Reduced-motion support, semantic landmarks, keyboard focus styles, image alternative text, page description, canonical link, and basic Open Graph metadata.

## Production work still required

This workspace had no existing app, API, database, CMS, product specifications, policies, business contact details, domain, or payment credentials. The result is a working storefront prototype, not a production commerce backend. Before launch:

1. Confirm the brand name and approve the temporary “Aster House” identity; replace it if needed. The nearby Spark English logo is unrelated and was not reused.
2. Populate confirmed product prices, variants/sizes, material, care instructions, inventory, SKU, shipping details, and any validated ratings in the catalog or a CMS.
3. Connect a server-side database and catalog API, authentication, order management, rate limiting, and admin access. Do not expose private keys in browser code.
4. Implement a real checkout endpoint and connect a payment gateway such as Razorpay/Stripe with server-side verification. The current checkout action explicitly does not claim payment success.
5. Confirm return, shipping, privacy, terms, support contact, social accounts, and newsletter consent/provider. Footer links are placeholders until those destinations exist.
6. Add actual product detail, collection, account, order, policy, FAQ, contact, and admin routes; sitemap and robots directives need the deployed canonical domain.
7. Optimize the source photographs into responsive WebP/AVIF variants and configure image caching, analytics consent, structured data, and deployment monitoring.

The provided product images are used unchanged. Only `ab1.jpeg` and `ab2.jpeg` were relevant bedding visuals among the nearby files; unrelated personal images and a tutoring-brand logo were not incorporated.
