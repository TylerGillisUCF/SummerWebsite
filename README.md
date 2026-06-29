# Periphery Passive Engagement

An interactive web exhibit that demonstrates an academic argument:
**historical video games teach players history through environmental design —
architecture, landscape, color, and space — even when players skip the
cutscenes and dialogue.**

Rather than reading the full paper, a visitor experiences the argument by
clicking through scenes from real games. Each scene is a screenshot with
numbered hotspots; clicking a hotspot reveals something a player would absorb
*passively*, just by moving through the world.

## Live site

This is a static site with no build step, so it runs anywhere — including
GitHub Pages. To publish: in the repository settings, enable **Pages** from
the branch's root, then open the provided URL.

## What's in here

| File | Purpose |
|------|---------|
| `index.html` | Page structure (header, tabs, stage, footer). |
| `styles.css` | All styling — a restrained "museum label" look. |
| `data.js` | **The content.** Every scene, hotspot, caption, and image path. This is the only file you normally edit. |
| `app.js` | Rendering and interaction logic (reads `data.js` and draws the page). |
| `images/` | The five committed screenshots. |
| `README.md` | This file. |

## How it works

The whole tool is just a **data file of images plus annotations** read by a few
dozen lines of display code. The scenes are grouped into four "sessions" (one
per game):

- **Assassin's Creed Odyssey** — *The Odeon of Pericles*, *Painted Statues* (the core case study)
- **Red Dead Redemption 2** — *The Wilderness*, *Saint-Denis*
- **Assassin's Creed IV: Black Flag** — *The Colonial Caribbean*

Pick a session, pick a scene, and click the markers.

## Editing the content

Open `data.js` — it is commented for non-programmers. Each scene is an object
with a `title`, `intro`, `image` path, and a list of `hotspots`. Each hotspot
has a `title`, `text`, and an `x`/`y` position given as **percentages of the
image** (so markers stay aligned no matter the screen size).

- **Move a marker:** change its `x`/`y` numbers.
- **Edit a caption:** change its `text`.
- **Add a scene:** copy an existing scene block and edit it.
- **Add a game:** copy an existing session block and edit it.

Because the positions are percentages and the images are referenced with
relative paths, anyone can fork this project, drop their own images into
`images/`, swap in their own annotations, and have an interactive version of
their own work.
