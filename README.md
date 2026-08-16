# Recode Law Einladungsgenerator

Static site (plain HTML/CSS/JS, no build step) for generating Recode Law Stammtisch invitation images and a matching social media post text.

## Running locally

This is a static site, so any local static file server works. From the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/index.html.

Claude Code users: a `.claude/launch.json` config named `static-preview` is already set up, so the dev server can be started via the preview tool without any manual steps.

## Structure

- `index.html` — page markup and form controls
- `static/app.js` — canvas rendering of the invite image + invitation text generation/copy logic
- `images/` — background assets, per format (`linkedin`, `instagram`)
