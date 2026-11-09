import 'maplibre-gl/dist/maplibre-gl.css';

import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
import { FunctionComponent, useEffect, useRef } from 'react';

import { useAnchorSize, useSettings } from '../../../components/index.js';

// A map filling the content layer (MapLibre, OpenStreetMap's tiles; dark,
// by the color scheme: filtered, see style.css): the page an island floats
// over. Following the island (`isFollowing`), its camera
// kept clear of it (its padding: the bottom anchor's size, as the island
// settles); its controls kept clear of it and of the safe areas always (by
// the content layer's `--uikit-viewport-anchor-block-end`, see style.css).
// Loaded as it's shown (client only); its worker the file it ships, as an
// asset (its own lookup, by its module's URL, finds none in a bundle).

/** OpenStreetMap's standard tiles, credited (dark: by a filter, see style.css). */
const style: StyleSpecification = {
  layers: [{ id: 'osm', source: 'osm', type: 'raster' }],
  sources: {
    osm: {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxzoom: 19,
      tileSize: 256,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      type: 'raster',
    },
  },
  version: 8,
};

/** Where it shows: a harbor (Hamburg's). */
const center: [number, number] = [9.9666, 53.5442];

export const MapView: FunctionComponent<{
  /** Its camera kept clear of the island, as it settles. */
  isFollowing?: boolean;
}> = ({ isFollowing = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | undefined>(undefined);
  const bottom = useAnchorSize('block-end');
  const { colorScheme } = useSettings();

  useEffect(() => {
    let isGone = false;
    import('maplibre-gl')
      .then(({ Map, setWorkerUrl }) => {
        const { current: container } = ref;
        if (isGone || !container) return;
        setWorkerUrl(
          new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url)
            .href,
        );
        map.current = new Map({
          attributionControl: { compact: true },
          center,
          container,
          style,
          zoom: 15,
        });
        // (Its credits collapsed at first, as a drag of the map collapses
        // them: MapLibre's own class for shown.)
        map.current.once('load', () => {
          container
            .querySelector('.maplibregl-compact-show')
            ?.classList.remove('maplibregl-compact-show');
        });
      })
      .catch(() => undefined);

    return () => {
      isGone = true;
      map.current?.remove();
      map.current = undefined;
    };
  }, []);

  // (Its camera's center above the island, as it settles.)
  useEffect(() => {
    const { current: container } = ref;
    if (!isFollowing || !container) return;
    // (The anchor's size its content's: its safe area padding besides.)
    const inset =
      Number.parseFloat(
        getComputedStyle(container).getPropertyValue(
          '--uikit-safe-area-inset-bottom',
        ),
      ) || 0;
    map.current?.easeTo({ duration: 300, padding: { bottom: bottom + inset } });
  }, [bottom, isFollowing]);

  // (Its own element MapLibre's: its stylesheet positions that.)
  return (
    <div
      className="island-demo-map"
      data-color-scheme={colorScheme}
    >
      <div ref={ref} />
    </div>
  );
};
