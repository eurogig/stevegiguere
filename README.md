# Steve Giguere

**Live website: [stevegiguere.com](https://stevegiguere.com/)**

Steve's personal website: AI security, speaking, writing, experiments, and life beyond the keyboard. A console-inspired design with responsive layouts, an interactive agent trust-boundary illustration, and a hidden introductory security challenge.

Source: [eurogig/stevegiguere](https://github.com/eurogig/stevegiguere). Hosted on Vercel, with `stevegiguere.com` as the canonical domain and `www.stevegiguere.com` redirecting to it.

## Updating the live site

1. Edit the content or source files in this repository.
2. Commit and push changes to `main`.
3. Vercel builds and deploys the update automatically. Wait for the deployment to finish before checking the live site.

Vercel uses `npm run build` and publishes `dist/`, as configured in `vercel.json`. Build output is generated rather than committed. Domain redirects are managed in the Vercel project's domain settings.

## Managing content

Edit [content.json](content.json) in your editor or GitHub's file editor. This is the central place for your profile, featured article, resource cards, speaking topics, biography, and contact links.

- **Featured article:** update `featured.title`, `subtitle`, `description`, `date`, `url`, and `linkLabel`.
- **Podcast, blog, or project cards:** edit or add objects in `resources`. Array order is display order. Each entry needs `category`, `title`, `description`, `source`, `url`, and `linkLabel`.
- **Profile and portrait:** update `profile`. The current portrait is `public/assets/steve.png`, referenced as `/assets/steve.png`. Add new images to `public/assets/` and reference them with `/assets/filename`.
- **Contact links:** update `links` once; repeated buttons use the same values.
- **Speaking and biography:** edit `speaking.topics`, `speaking.description`, and `about`.

Keep the JSON valid: double quotes, no trailing commas or comments. Text is plain text; HTML is escaped automatically. Use `\n` within resource titles for an intentional line break.

`featured.image` is `null` to keep the diagram. To use an article image, replace it with an object such as:

```json
{
  "url": "/assets/article.jpg",
  "alt": "A description of the image"
}
```

External links must use HTTPS. Missing fields or invalid URLs stop the build with a field-specific error. Content is rendered into HTML during the build, so visitors do not need JavaScript to read it.

## Source layout

- `content.json`: editable content and references.
- `index.html`: HTML template and page structure.
- `style.css`: visual design, responsive layouts, and section framing.
- `app.js`: workflow inspector, automatic scrolling, command palette, and hidden challenge.
- `public/assets/`: portrait, favicon, and other published images.
- `scripts/`: content rendering, validation tests, build, and local preview.
- `vercel.json`: deployment configuration.
- `BRIEF.md`: creative direction and project context.

## Local development

Requires Node.js 20 or later. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:3000. Content is rendered on each request; refresh after editing `content.json`. Restart the server after changing its code.

```sh
npm run check
npm run build
```

Checks cover JavaScript syntax and content rendering. The build generates the deployable site in `dist/`; the root `index.html` contains template placeholders and should not be opened directly as the finished site.

## About the interactive elements

The agent workflow is an educational illustration. The hidden challenge is a browser-only puzzle with a deliberately discoverable flag. Neither makes live model calls or uses credentials. Fonts load from Google Fonts, with system fallbacks.

This is a personal website. Opinions are Steve's own; no employer endorsement is implied. See [LICENSE.md](LICENSE.md) for the repository license.
