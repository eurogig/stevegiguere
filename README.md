# stevegiguere.com

Steve Giguere's personal site. A fresh build: AI security, public speaking, writing, and curiosity.

## Local development

Requires Node.js 20+. No packages need installing.

```sh
npm run dev
```

Open http://localhost:3000. Content is rendered on every request: after changing `content.json`, refresh the browser. No server restart is needed. If a previous preview server is running, restart it once to pick up the new renderer.

Run `npm run check` for syntax and content-rendering tests, and `npm run build` to generate `dist/`. Serve or deploy `dist/`; the root `index.html` is now a template.

## Deployment

Import `eurogig/stevegiguere` into Vercel, using the Other framework preset. The checked-in configuration builds to `dist/`. Connect the custom domain when ready.

## Editing

- `content.json`: editable profile, portrait, featured article, resources, speaking topics, bio, and shared contact links.
- `index.html`: page layout with build-time content placeholders.
- `style.css`: visual system, responsive layouts, motion preferences.
- `app.js`: workflow inspector, command palette, and introductory hidden challenge.
- `BRIEF.md`: creative direction and follow-up work.

### Updating content

Edit `content.json` in your editor or GitHub's file editor. Keep the JSON valid (double quotes, no trailing commas or comments). Text is plain text; HTML is escaped automatically. Use `\n` within resource titles for an intentional line break.

- **Featured article:** update `featured.title`, `subtitle`, `description`, `date`, `url`, and `linkLabel`.
- **Podcast, blog, or project cards:** edit or add objects in `resources`. Array order is display order. Each needs `category`, `title`, `description`, `source`, `url`, and `linkLabel`.
- **Profile and portrait:** update `profile`. `profile.portrait.url` can use an HTTPS URL or a local `/assets/steve.jpg` path. Put local images in `public/assets/`; the build copies them to `dist/assets/`.
- **Contact links:** update `links` once; repeated buttons use the same value.
- **Speaking and biography:** edit `speaking.topics`, `speaking.description`, and `about`.

`featured.image` is `null` to keep the current diagram. To show an article image instead, use an object such as:

```json
"image": {
  "url": "/assets/article.jpg",
  "alt": "A description of the image"
}
```

External links must use HTTPS. Missing fields or invalid URLs stop the build with a field-specific error. The built page contains all content, so it does not need a browser-side fetch or JavaScript to display it. Once Vercel is connected to GitHub, a commit to its configured production branch triggers a rebuild.

The agent workflow is an educational illustration, not live telemetry. The hidden challenge is a client-side puzzle: its flag is deliberately public, not a security secret. There are no live model calls or credentials. Fonts use Google Fonts with local system fallbacks.

The repository is a personal project; no employer endorsement is implied.
