# sea-farer

A small isometric, watercolour sailing scene rendered with raw WebGPU. No engine, no asset files: every mesh, texture and shader is generated at start-up. The deliverable is the single file `index.html`.

Open `index.html` in a WebGPU browser (it needs a secure context, so serve it from `localhost` or https rather than `file://` if your browser insists).

## Controls

| Key | Action |
| --- | --- |
| `S` / `D` | push the tiller left / right (a tiller turns the bow the opposite way) |
| `I` / `O` | sheet the sail in / let it out |
| `A` | drop / weigh anchor |
| wheel | zoom |

The wind blows from a fixed direction (the streaks on the water, the trees and the masthead pennant all show it). The boom swings downwind until the sheet stops it; the sail only drives when it is held at an angle to the wind, so let it out when running and haul it in when beating. Point too close to the wind and it luffs. The dial in the corner shows the hull, the boom, the sheet limit and the apparent wind.

## Layout

- `index.html` – minified single-file build (the deliverable)
- `src/index.html` – readable source
- `tools/build.js` – minifier (`npm i terser`, then `node tools/build.js`)
- `tools/shot.js`, `tools/poses.json` – deterministic review renders and fly-through frames via headless Chromium
- `report/` – performance report, visual critic review, review renders

## URL flags

- `?bench` – runs the scripted 60 s fly-through and reports frame intervals plus GPU time from timestamp queries (avg / p99 / max). Full log in `__bench`.
- `?w=2560&h=1440` – force the render resolution.
- `?cap` – capture mode used by `tools/shot.js` (renders offscreen on demand).
