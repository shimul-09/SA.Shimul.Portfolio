# Shahrier Alam Shimul - Portfolio

A responsive personal portfolio website for Shahrier Alam Shimul, a software developer and Computer Science & Engineering student. The site presents his background, skills, education, projects, research interests, resume, and contact links in an interactive single-page experience.

## Features

- Responsive desktop and mobile navigation
- Dark night mode and light day mode with saved preference
- Animated loading screen, particle background, custom cursor, and scroll reveals
- Animated project and skills sections
- Education timeline and animated portfolio statistics
- Social links and email contact actions
- Accessible labels for interactive controls
- No framework, build tool, or package manager required

## Tech Stack

- HTML5
- CSS3 with custom properties, responsive layouts, and animations
- Vanilla JavaScript
- Google Fonts: Inter and Space Grotesk
- Devicon CDN for technology icons

## Run Locally

Because this is a static website, it can be opened directly in a browser:

1. Open `index.html` in a browser.

For a more reliable local preview, serve the folder with any static file server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project Structure

```text
.
├── index.html    # Portfolio markup and page content
├── style.css     # Layout, theme variables, responsive styles, and animations
├── script.js     # Navigation, theme toggle, particles, counters, and interactions
├── avatar2.jpeg  # Profile image
├── favicon.png   # Browser tab icon
└── favicon.svg   # Vector favicon asset
```

## Customization

Most personal content is in `index.html`:

- Update the name, biography, education, projects, and social URLs.
- Replace `avatar2.jpeg` with a new profile image, keeping the same filename or updating the image source.
- Add a real CV file and change the `Download CV` link from `#` to its file path.

Visual changes belong in `style.css`:

- Edit the color and typography variables near the top of the file.
- Adjust responsive breakpoints and component styles as needed.

Interactive behavior belongs in `script.js`. The theme preference is stored in `localStorage` under `portfolio-theme`.

## Deployment

The site can be deployed to any static hosting provider, including GitHub Pages, Netlify, Vercel, or Cloudflare Pages. Upload or connect the repository and use the project root as the publish directory. No build command is required.

## Notes

- Technology icons are loaded from the Devicon CDN, so an internet connection is needed for those icons.
- Google Fonts are loaded remotely and fall back to the local CSS font families if unavailable.
- Update external social and project links before publishing.