# Performance report

## Status: gate NOT verified on the target machine

The target is an RTX 5070 Ti at 2560×1440 (GPU frame ≤ 11 ms average, no frame > 16.7 ms over the scripted 60 s fly-through). The build container has **no GPU**: WebGPU there runs on SwiftShader, a CPU rasteriser, and cannot present to a canvas at all. Nothing measured in it says anything about the target, so this gate is open until the benchmark is run on real hardware.

## How to run it (about 65 seconds)

Open the page in Chrome on the target machine with the window on the 1440p display:

```
index.html?bench&w=2560&h=1440
```

It sails the scripted fly-through for 60 s on autopilot, then shows frame-interval and GPU-time statistics (average, 99th percentile, max) and a PASS/FAIL line for the gate. The complete per-frame log is in `__bench` (`copy(JSON.stringify(__bench))` in DevTools).

- GPU time comes from `timestamp-query`: start of the shadow pass to end of the post pass, every frame. Chrome quantises these to 100 µs unless `chrome://flags/#enable-webgpu-developer-features` is on.
- Timestamps are resolved and appended to one buffer on the GPU each frame and only mapped after the run, so the measurement adds no per-frame JavaScript allocation.
- Frame intervals are `requestAnimationFrame` deltas.

## What was checked here

| Check | Result |
| --- | --- |
| Benchmark harness runs end to end (fly-through, timestamp resolve, readback, report) | Yes, on SwiftShader at 320×180 for 3 s |
| Numbers from that run | Not meaningful (CPU rasteriser): GPU span ≈ 556 ms/frame |
| Autopilot completes the 60 s route without grounding | Yes (deterministic capture run) |

## Why it should fit the budget (reasoning, not measurement)

Per frame at 1440p the renderer does:

- one 2048² depth-only shadow pass (terrain + instanced props),
- one 4× MSAA scene pass to two targets (rgba8 colour, rgba16f normal/depth for the ink lines): a few dozen instanced draw calls, with a full-screen water shader (two 9-tap cell lookups, a handful of noise taps, 4-tap PCF),
- one full-screen post pass (about 14 taps).

No compute, no ray marching, no per-pixel loops beyond those. That is a small load for the target card, but it is an estimate until the benchmark above is run.

## Allocation discipline

The frame loop (simulation, uniform and instance updates, wake ribbon, encoding) allocates nothing of its own: all typed arrays, pass descriptors and the submit array are created once and reused. What remains per frame is what WebGPU itself hands back: one command encoder, three pass encoders, one command buffer and the swap-chain texture view. On touch devices the on-screen helm writes a style string when the tiller or sheet actually moves; on the desktop target that code is not active.
