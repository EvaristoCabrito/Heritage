# Modular wooden fortifications

## Ground footprint

The game uses a flat painted map with independently positioned building sprites. World x is a percentage of map width. World y has a separate scale, so the engine uses `Y_TO_X_SCALE` to compare distances on the ground.

Every straight wall or gate occupies one 9-unit grid edge. East–west and north–south sections share grid vertices. A square uses four equal-length sides, and adjoining sections can share endpoints without overlapping. Installing an upgraded wall or gate uses the same edge and endpoints as its basic version.

## Art specification

- Start with the Level 1 wall as the reference module. Check it at native resolution and composited onto the actual City and Wilds maps at their in-game scale.
- Establish standard rail heights and timber widths from that module. End grain, rail heights, ground contact, color, and lighting must match where pieces meet. Keep vertical posts upright in both views. North–south shows the narrow face of a single wall plane, with the far end receding up the map.
- A corner uses one shared join post, with both wall rails terminating at it. Modules must meet at that anchor without overlapping end posts or leaving an exposed strip of ground. Orientations need a common projected ground anchor despite their different visible bounds.
- A gate occupies one wall edge. Reuse the adjacent wall ends, top profile, and rails on both sides. The center contains the hinged leaves. The Level 2 gate uses the same opening and hinge positions, with heavier wood and iron hardware.
- Both wall levels and both gate levels use wood with iron fittings. The sprites and construction phases have no masonry or stone base.
- Prepare early, mid, and completed views on the same ground anchors. The first two phases of an upgrade keep the older wall line in place while the timber reinforcement goes on. Use individual high-resolution transparent photorealistic assets.
- Verify depth against walking characters. The current site and hero layers have separate stacking contexts, so their individual y-based z-index values do not by themselves let a wall occlude a character on the far side.

## Acceptance checks

1. Place a square with at least two wall sections per side and one gate. Inspect all four corner joins and the gate seams on the actual map at normal zoom and close up.
2. Switch a section from early to mid to complete, then upgrade it in place. The art must stay on the original ground line; adjacent joints must stay aligned.
3. Send a peasant, a hero, wildlife, and an attacker toward each gate orientation. Peasants and heroes pass while wildlife and attackers remain blocked. Destroy a wall section and verify that it creates a breach only at that location.
4. Save and reload with a north–south section and an upgrade in progress. The edge, orientation, and phase must survive the reload.

The weapons, supply icons, and other siege props follow the construction assets in the art queue.
