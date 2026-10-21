# robert-dream

## Carousel World

A touch-first 3D fairground playground built with Three.js and Vite. Twelve original procedural sculptures: horse, roadster, biplane, rocket, swan, teacup, fire engine, locomotive, helicopter, submarine, elephant and friendly dragon.

### Play
Insert a pretend coin, tap a physical ride or its accessible button, watch the visitor board, and pull down (or tap) the mechanical start lever. Choose 30 seconds, 1 minute or 2 minutes. The carousel accelerates and stops gently. Music is optional and off by default. Drag the scene to orbit; pinch to zoom; reset view returns the original camera.

No real payments, prizes, ads, analytics, accounts or personal-data collection. Audio is generated locally after a user gesture. All models and music are original; no downloaded character assets.

### Develop
Node 22 or newer. Run `npm ci`, then `npm run dev`. Run `npm test` and `npm run build` for checks. `node tests/smoke.mjs` runs a local Chromium browser smoke test if Chromium is installed at `/usr/bin/chromium` and a Vite server is running on port 5173.

### Design references
World fairgrounds inspire the form, not copied assets or branding:
- [Zamperla Merry Go Round](https://www.zamperla.com/product/merry-go-round-7m): circular platform, ornate canopy and traditional horses.
- [Falgas kiddie rides](https://www.falgas.com/en/product-category/kiddie-rides/page/2/): distinct playful vehicle silhouettes.
- [NPS Dentzel carousel preservation](https://home.nps.gov/glec/learn/historyculture/carousel-preservation.htm): carved menagerie animals.
- [Tweetsie Railroad rides](https://tweetsie.com/explore-the-park/rides): aviation and train themes.
- [Toverland teacups](https://www.toverland.com/en/rides/theekopjes): cup and saucer geometry.

### Rendering and accessibility
PBR enamel, brass and rubber materials; soft shadows and environment reflections. Pixel ratio is capped to keep phone rendering manageable. Every ride can be selected with a keyboard-accessible button; the lever has a tap/keyboard alternative. A friendly error is shown if WebGL is unavailable. Actual device performance varies.
