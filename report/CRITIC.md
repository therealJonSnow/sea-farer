# Visual critic: final review (round 5 of 5)

## Gate status: NOT passed

The gate was "nothing above MINOR". The last round still reports **1 MAJOR and 4 MODERATE** findings. The loop was stopped here on the owner's instruction, so these were not fixed.

## How the review worked

- A separate subagent saw only rendered images, never the code or my reasoning. Each round it got:
  - eight fixed camera poses at 2560×1440,
  - 1:1 native crops,
  - a 2×2 tile of four consecutive 60 fps frames at native resolution (for shimmer and popping),
  - contact sheets from the scripted 60 s fly-through,
  - from round 4 on, phone-sized mobile layouts.
- The renders came from headless Chromium using WebGPU on SwiftShader (a software renderer), through an offscreen capture path. This container has no GPU, and SwiftShader cannot present to a canvas, so this was the only option.
- The fly-through sheets in round 5 came from the previous build. The reviewer was told to use them only for motion and continuity.
- In rounds 1 and 3 my ffmpeg tiling produced black tiles in the 60 fps burst. This was fixed from round 4 on.

## Severity by round

| Round | Highest | Main items raised |
| --- | --- | --- |
| 1 | MAJOR (8) | Foam net looked like cracked glass, airbrushed wind streaks, hard shallow halos, faceted trees |
| 2 | MAJOR (1) | Anchor did not read as held at a distance; square foam quads; straight-ribbon wake |
| 3 | MAJOR (1) | Bow did not point at the anchor; lantern invisible; inconsistent night tint |
| 4 | MAJOR (1) | Anchor rope drawn as two floating rods |
| 5 | MAJOR (1) | Lighthouse beam starts at the shoreline, not the lamp |

## Still open after round 5

**MAJOR**

1. **Pose 7 (night): the lighthouse beam reads as a decal on the water.** It starts at the island's shoreline, not the lamp, and fans across about 40% of the frame in teal. It should be a narrow warm shaft from the lamp, leaving only a faint strip on the water.

**MODERATE**

2. **Pose 7 and pose 8: the bow lantern doesn't read as a light source.**
   - Pose 7: the whole hull looks self-lit and there is no pool of light around the bow.
   - Pose 8: the pool is a hard-edged cream blob that sits apart from the boat.
3. **Pose 3: the boat still casts a full sail-shaped shadow while anchored with the sail furled.**
4. **Pose 3 chart: the red line to the anchor doesn't show, and the anchor mark sits too close to the hull.**
5. **Palm trees look flat and plastic next to the rest of the painterly scene.**

**MINOR (12)**

- A mauve stain of shadow on the sand.
- Shadows from off-frame trees falling on the water.
- Wind ticks that still read as rain.
- The stronger-wind pose looks no rougher than calm water.
- Layer-cake cliffs.
- A pale gap inside the transom.
- In pose 6, the sailor is hidden behind the sail.
- The sail's shadow looks like a fish tail.
- Chart contrast is low.
- In mobile landscape, the tiller stick is cut off at the bottom edge.
- In mobile portrait, the rope control is heavy.
- Too many gulls.

**NIT (3)**

- A uniform wave-line pattern.
- Night water that is too saturated.
- A featureless face.

**Checks that passed in the final round**

- No flicker, popping or crawling across the 60 fps frames (the reviewer could not confirm sub-pixel shimmer at 1:1).
- The fly-through is continuous, with nothing ungrounded.
- Daytime poses 1, 2, 4 and 5 look good: vibrant colour, working wash and grain, clean ink lines.
- The world-edge paper (pose 6) works.
- Mobile layouts fit on screen and nothing covers the boat.

## Owner feedback items (final round)

| Item | Status |
| --- | --- |
| a. No water inside the boat | Fixed (one pale gap at the transom in the close-up) |
| b. Character model, hand on tiller | Fixed |
| c. Tiller connected to rudder | Fixed |
| d. Minimap with wind/sail diagram | Fixed (legibility is minor) |
| e. Anchor holds at a distance, bow to anchor | Fixed in scene; chart line not visible |
| f. Gull wings, folded when perched | Fixed |
| g. Rare monsters, no snake | Fixed |
| h. Night lights (lighthouse, boat) | Not fixed (see the MAJOR and the first MODERATE) |

Final renders are in `report/renders/` (downscaled to 1280 wide).
