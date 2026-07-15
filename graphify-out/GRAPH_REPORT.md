# Graph Report - .  (2026-07-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 248 nodes · 357 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `31668a2c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `compilerOptions` - 22 edges
3. `compilerOptions` - 18 edges
4. `Mode` - 9 edges
5. `DeliveryStop` - 8 edges
6. `tailwind` - 6 edges
7. `aliases` - 6 edges
8. `Badge()` - 6 edges
9. `Card()` - 6 edges
10. `CardContent()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `SidebarProps` --references--> `SearchResult`  [EXTRACTED]
  src/components/Sidebar.tsx → src/hooks/useAddressSearch.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `ProgressTrack()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/progress.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (21): CostTrackerProps, Badge(), badgeVariants, Button(), buttonVariants, Card(), CardAction(), CardContent() (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (31): @base-ui/react, class-variance-authority, clsx, @fontsource-variable/geist, leaflet, lucide-react, dependencies, @base-ui/react (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (29): DOM, DOM.Iterable, google.maps, src, vite/client, compilerOptions, allowImportingTsExtensions, baseUrl (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (16): DeliveryMarker(), DeliveryMarkerProps, FleetMapViewProps, FleetMarkerProps, JAKARTA_CENTER, ManifestStop, FleetSidebarProps, MapViewProps (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (22): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (13): FleetMarker(), FleetMarkerProps, FleetOptimization(), distances, etas, getOptimizedManifest(), manifest, ManifestItem (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (7): Tab, Dashboard(), MapView(), Sidebar(), SearchResult, useAddressSearch(), useDeliveryRoute()

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

## Knowledge Gaps
- **115 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 1` to `Community 9`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 3` to `Community 9`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14453781512605043 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._