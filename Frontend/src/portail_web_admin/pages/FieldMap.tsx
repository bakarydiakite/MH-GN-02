import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  MapPin,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Satellite,
  Map,
  MapPinned,
  LocateFixed,
  Search,
  X,
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { Map as LeafletMap, TileLayer } from 'leaflet';

import 'leaflet/dist/leaflet.css';

export type FieldMapBaseLayer = 'satellite' | 'streets';

export interface FieldMapPoint {
  id: string;
  lat: number;
  lng: number;
  createdAt: string;
  statut: string;
  iun: string | null;
  agentName: string;
  enfant: string;
  lieuNaissance?: string | null;
}

export interface FieldMapPrefecture {
  id: string;
  nom: string;
  code: string | null;
  region: string | null;
  birthCount: number;
  untouched: boolean;
}

export interface UnvisitedPlaceRow {
  type: 'PREFECTURE' | 'CENTRE_DE_SANTE' | 'COMMUNE';
  id: string;
  nom: string;
  prefecture: string | null;
  region: string | null;
  motif: string;
  lat: number | null;
  lng: number | null;
}

export interface FieldMapResponse {
  from: string;
  to: string;
  summary: {
    totalBirths: number;
    withGps: number;
    withoutGps: number;
    untouchedPrefectureCount: number;
  };
  points: FieldMapPoint[];
  prefectures: FieldMapPrefecture[];
  unvisitedPlaces?: UnvisitedPlaceRow[];
  coverageRadiusKm?: number;
}

export interface CoverageSummary {
  gpsCount: number;
  spreadRadiusKm: number | null;
  bufferRadiusKm: number;
}

const GUINEA_CENTER: [number, number] = [10.5, -10.7];
const DEFAULT_ZOOM = 6;

const GUINEA_SW: [number, number] = [7.05, -15.05];
const GUINEA_NE: [number, number] = [12.65, -7.35];

/** Défaut si l’API ne renvoie pas `coverageRadiusKm`. */
const DEFAULT_COVERAGE_RADIUS_KM = 18;

const ESRI_IMAGERY =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

function createBasemapLayer(L: typeof import('leaflet').default, mode: FieldMapBaseLayer) {
  if (mode === 'satellite') {
    return L.tileLayer(ESRI_IMAGERY, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics',
    });
  }
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
}

/** Accepte nombres ou chaînes JSON pour lat/lng côté API. */
function finiteLatLng(lat: unknown, lng: unknown): { lat: number; lng: number } | null {
  const la = typeof lat === 'number' ? lat : lat != null && lat !== '' ? Number(lat) : NaN;
  const lo = typeof lng === 'number' ? lng : lng != null && lng !== '' ? Number(lng) : NaN;
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  return { lat: la, lng: lo };
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function buildCoverageSummary(
  points: { lat: number; lng: number }[],
  bufferRadiusKm: number,
): CoverageSummary {
  const gpsCount = points.length;
  let spreadRadiusKm: number | null = null;
  if (points.length >= 2) {
    const cx = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const cy = points.reduce((s, p) => s + p.lng, 0) / points.length;
    const meanDist =
      points.reduce((s, p) => s + distanceKm({ lat: cx, lng: cy }, p), 0) / points.length;
    spreadRadiusKm = Math.round(meanDist * 10) / 10;
  } else if (points.length === 1) {
    spreadRadiusKm = 0;
  }
  return { gpsCount, spreadRadiusKm, bufferRadiusKm };
}

function nearestDossierKm(lat: number, lng: number, pts: { lat: number; lng: number }[]): number | null {
  if (pts.length === 0) return null;
  const here = { lat, lng };
  return Math.round(Math.min(...pts.map((p) => distanceKm(here, p))) * 10) / 10;
}

function isInsideAnyBuffer(
  lat: number,
  lng: number,
  pts: { lat: number; lng: number }[],
  radiusKm: number,
): boolean {
  const here = { lat, lng };
  return pts.some((p) => distanceKm(here, p) <= radiusKm);
}

function fitMapView(
  map: import('leaflet').Map,
  L: typeof import('leaflet').default,
  allRecordPoints: [number, number][],
  userPos: { lat: number; lng: number } | null,
  searchPos: { lat: number; lng: number } | null,
) {
  const bounds = L.latLngBounds([]);
  bounds.extend(GUINEA_SW);
  bounds.extend(GUINEA_NE);
  for (const ll of allRecordPoints) bounds.extend(ll);
  if (userPos) bounds.extend([userPos.lat, userPos.lng]);
  if (searchPos) bounds.extend([searchPos.lat, searchPos.lng]);

  const latSpan = bounds.getNorth() - bounds.getSouth();
  const lngSpan = bounds.getEast() - bounds.getWest();
  const maxSpan = Math.max(latSpan, lngSpan);
  let maxZoom = 14;
  if (maxSpan > 22) maxZoom = 4;
  else if (maxSpan > 14) maxZoom = 5;
  else if (maxSpan > 8) maxZoom = 6;
  else if (maxSpan > 4) maxZoom = 7;
  else if (maxSpan > 2) maxZoom = 9;
  else if (maxSpan > 0.85) maxZoom = 11;

  map.fitBounds(bounds, { padding: [48, 48], maxZoom });
}

export default function FieldMap() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const baseTileRef = useRef<TileLayer | null>(null);
  const lastBuiltDataRef = useRef<FieldMapResponse | null>(null);
  const lastOverlayKeyRef = useRef<string>('');
  const geoWatchRef = useRef<number | null>(null);
  const geoRefineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geoMountedRef = useRef(true);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState<FieldMapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseLayer, setBaseLayer] = useState<FieldMapBaseLayer>('streets');
  const [showMarkers, setShowMarkers] = useState(true);
  const [showRiskCenters, setShowRiskCenters] = useState(true);
  const [myPosition, setMyPosition] = useState<{
    lat: number;
    lng: number;
    accuracyM: number | null;
  } | null>(null);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [geoWorking, setGeoWorking] = useState(false);

  const [placeQuery, setPlaceQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ lat: number; lng: number; displayName: string }[]>([]);
  const [searchHit, setSearchHit] = useState<{ lat: number; lng: number; displayName: string } | null>(null);

  const round4 = (n: number) => Math.round(n * 1e4) / 1e4;
  const myPosKey = myPosition
    ? `me:${round4(myPosition.lat)}:${round4(myPosition.lng)}:a${
        myPosition.accuracyM != null ? Math.round(myPosition.accuracyM / 20) : 'na'
      }`
    : 'nome';
  const searchKey = searchHit
    ? `s:${round4(searchHit.lat)}:${round4(searchHit.lng)}`
    : 'nos';
  const overlayKey = `${showMarkers}|${showRiskCenters}|${myPosKey}|${searchKey}`;

  const clearGeoWatch = useCallback(() => {
    if (geoWatchRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchRef.current);
      geoWatchRef.current = null;
    }
    if (geoRefineTimerRef.current != null) {
      clearTimeout(geoRefineTimerRef.current);
      geoRefineTimerRef.current = null;
    }
  }, []);

  const applyGeoPosition = useCallback(
    (pos: GeolocationPosition, enableRefine: boolean) => {
      if (!geoMountedRef.current) return;
      const acc =
        pos.coords.accuracy != null && Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null;
      setMyPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracyM: acc,
      });
      setGeoWorking(false);
      setGeoMessage(null);

      if (!enableRefine) return;

      const needRefine = acc == null || acc > 280;
      if (!needRefine || !navigator.geolocation.watchPosition) return;

      clearGeoWatch();
      setGeoMessage('Affinage de la position (quelques secondes)…');

      let best = pos;
      geoWatchRef.current = navigator.geolocation.watchPosition(
        (p) => {
          if (!geoMountedRef.current) return;
          const a =
            p.coords.accuracy != null && Number.isFinite(p.coords.accuracy) ? p.coords.accuracy : 99_999;
          const ba =
            best.coords.accuracy != null && Number.isFinite(best.coords.accuracy)
              ? best.coords.accuracy
              : 99_999;
          if (a < ba - 15) {
            best = p;
            setMyPosition({
              lat: p.coords.latitude,
              lng: p.coords.longitude,
              accuracyM:
                p.coords.accuracy != null && Number.isFinite(p.coords.accuracy) ? p.coords.accuracy : null,
            });
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 0 },
      );

      geoRefineTimerRef.current = setTimeout(() => {
        clearGeoWatch();
        if (geoMountedRef.current) setGeoMessage(null);
      }, 12000);
    },
    [clearGeoWatch],
  );

  const requestMyPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoMessage('Géolocalisation non disponible sur ce navigateur.');
      return;
    }
    clearGeoWatch();
    setGeoWorking(true);
    setGeoMessage('Localisation en cours (haute précision, jusqu’à ~45 s)…');

    const failFinal = (err: GeolocationPositionError) => {
      setGeoWorking(false);
      if (err.code === 1) {
        setGeoMessage('Position refusée : autorisez la localisation dans le navigateur (icône cadenas / site).');
      } else if (err.code === 3) {
        setGeoMessage('Délai dépassé. Réessayez ou utilisez « Précision réduite » (bouton ci‑dessous).');
      } else {
        setGeoMessage('Position indisponible (GPS / réseau).');
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => applyGeoPosition(pos, true),
      () => {
        if (!geoMountedRef.current) return;
        setGeoMessage('Seconde tentative (précision réduite, ~25 s)…');
        navigator.geolocation.getCurrentPosition(
          (pos) => applyGeoPosition(pos, true),
          failFinal,
          { enableHighAccuracy: false, timeout: 28000, maximumAge: 0 },
        );
      },
      { enableHighAccuracy: true, timeout: 48000, maximumAge: 0 },
    );
  }, [applyGeoPosition, clearGeoWatch]);

  useEffect(() => {
    geoMountedRef.current = true;
    return () => {
      geoMountedRef.current = false;
      clearGeoWatch();
    };
  }, [clearGeoWatch]);

  useEffect(() => {
    requestMyPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule demande au montage ; le bouton « Réessayer » rappelle requestMyPosition
  }, []);

  const coverageSummary = useMemo(() => {
    if (!data) return null;
    const pts = data.points.map((p) => ({ lat: p.lat, lng: p.lng }));
    const bufferKm = data.coverageRadiusKm ?? DEFAULT_COVERAGE_RADIUS_KM;
    return buildCoverageSummary(pts, bufferKm);
  }, [data]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (from) q.set('from', new Date(from + 'T00:00:00').toISOString());
      if (to) q.set('to', new Date(to + 'T23:59:59').toISOString());
      const qs = q.toString() ? `?${q.toString()}` : '';
      const res = (await apiService.getFieldMap(qs)) as FieldMapResponse;
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        baseTileRef.current = null;
        lastBuiltDataRef.current = null;
        lastOverlayKeyRef.current = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!data || !mapDivRef.current || !coverageSummary) return;

    let cancelled = false;

    const run = async () => {
      try {
        const L = (await import('leaflet')).default;
        if (cancelled || !mapDivRef.current) return;

        const mapExisting = mapRef.current;
        const onlyBasemapSwap =
          mapExisting &&
          baseTileRef.current &&
          lastBuiltDataRef.current === data &&
          lastOverlayKeyRef.current === overlayKey;

        if (onlyBasemapSwap) {
          if (cancelled) return;
          mapExisting.removeLayer(baseTileRef.current);
          const nextBase = createBasemapLayer(L, baseLayer);
          nextBase.addTo(mapExisting);
          baseTileRef.current = nextBase;
          mapExisting.invalidateSize();
          return;
        }

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          baseTileRef.current = null;
        }

        const el = mapDivRef.current;
        el.innerHTML = '';

        const map = L.map(el, {
          scrollWheelZoom: true,
        }).setView(GUINEA_CENTER, DEFAULT_ZOOM);

        const baseTile = createBasemapLayer(L, baseLayer);
        baseTile.addTo(map);
        baseTileRef.current = baseTile;

        const overlayRoot = L.layerGroup().addTo(map);
        const pts = data.points.map((p) => ({ lat: p.lat, lng: p.lng }));
        const bufferKm = data.coverageRadiusKm ?? DEFAULT_COVERAGE_RADIUS_KM;

        const riskCenters = (data.unvisitedPlaces ?? []).flatMap((r) => {
          if (r.type !== 'CENTRE_DE_SANTE') return [];
          const ll = finiteLatLng(r.lat, r.lng);
          if (!ll) return [];
          return [{ ...r, lat: ll.lat, lng: ll.lng }];
        });

        if (showRiskCenters && riskCenters.length > 0) {
          const redPin = L.divIcon({
            className: 'naissancechain-leaflet-pin',
            html: `<svg width="32" height="40" viewBox="0 0 32 40" aria-hidden="true" style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))">
              <path fill="#EA4335" d="M16 2C9.4 2 4 7.15 4 13.2c0 8.2 12 22.8 12 22.8s12-14.6 12-22.8C28 7.15 22.6 2 16 2z"/>
              <circle cx="16" cy="13" r="5" fill="#fff"/>
            </svg>`,
            iconSize: [32, 40],
            iconAnchor: [16, 38],
          });

          for (const row of riskCenters) {
            L.marker([row.lat, row.lng], {
              icon: redPin,
              title: row.nom,
              zIndexOffset: 500,
            })
              .bindPopup(
                `<div style="font:13px Inter,system-ui,sans-serif;max-width:260px">
                  <strong style="color:#c5221f">${escapeHtml(row.nom)}</strong><br/>
                  <span style="color:#64748b">Centre — priorité terrain</span><br/><br/>
                  ${escapeHtml(row.motif)}
                </div>`,
              )
              .addTo(overlayRoot);
          }
        }

        if (showMarkers) {
          const greenPin = L.divIcon({
            className: 'naissancechain-leaflet-pin',
            html: `<svg width="32" height="40" viewBox="0 0 32 40" aria-hidden="true" style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))">
              <path fill="#34A853" d="M16 2C9.4 2 4 7.15 4 13.2c0 8.2 12 22.8 12 22.8s12-14.6 12-22.8C28 7.15 22.6 2 16 2z"/>
              <circle cx="16" cy="13" r="5" fill="#fff"/>
            </svg>`,
            iconSize: [32, 40],
            iconAnchor: [16, 38],
          });

          for (const p of data.points) {
            const html = `
            <div style="min-width:200px;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:1.45">
              <strong>${escapeHtml(p.enfant)}</strong><br/>
              <span style="color:#64748b">Agent</span> ${escapeHtml(p.agentName)}<br/>
              <span style="color:#64748b">Date saisie</span> ${escapeHtml(new Date(p.createdAt).toLocaleString('fr-GN'))}<br/>
              <span style="color:#64748b">Statut</span> ${escapeHtml(p.statut)}<br/>
              ${p.iun ? `<span style="color:#64748b">IUN</span> ${escapeHtml(p.iun)}` : ''}
              ${p.lieuNaissance ? `<br/><span style="color:#64748b">Lieu naissance</span> ${escapeHtml(p.lieuNaissance)}` : ''}
            </div>`;
            L.marker([p.lat, p.lng], {
              icon: greenPin,
              title: `${p.agentName} — ${p.enfant}`,
              zIndexOffset: 800,
            })
              .bindPopup(html)
              .addTo(overlayRoot);
          }
        }

        if (myPosition) {
          const acc = myPosition.accuracyM;
          if (acc != null && acc > 25 && acc < 100_000) {
            const radiusM = Math.min(Math.max(acc, 40), 15_000);
            L.circle([myPosition.lat, myPosition.lng], {
              radius: radiusM,
              color: '#2563eb',
              weight: 1,
              fillColor: '#2563eb',
              fillOpacity: 0.14,
            }).addTo(overlayRoot);
          }

          const meIcon = L.divIcon({
            className: 'naissancechain-leaflet-pin',
            html: '<div style="width:26px;height:26px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 12px rgba(37,99,235,.5)"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });
          const accLine =
            acc != null && Number.isFinite(acc)
              ? `<br/><span style="color:#64748b">±${Math.round(acc)} m</span>${
                  acc > 1500
                    ? `<br/><span style="color:#b45309;font-size:12px">Souvent imprécis sans GPS matériel.</span>`
                    : ''
                }`
              : '';
          L.marker([myPosition.lat, myPosition.lng], {
            icon: meIcon,
            title: 'Votre position',
            zIndexOffset: 2000,
          })
            .bindPopup(
              `<div style="font:13px Inter,system-ui,sans-serif">
                <strong>Position</strong><br/>
                ${myPosition.lat.toFixed(5)}, ${myPosition.lng.toFixed(5)}
                ${accLine}
              </div>`,
            )
            .addTo(overlayRoot);
        }

        if (searchHit) {
          const covered = isInsideAnyBuffer(searchHit.lat, searchHit.lng, pts, bufferKm);
          const nearest = nearestDossierKm(searchHit.lat, searchHit.lng, pts);
          const searchIcon = L.divIcon({
            className: 'naissancechain-leaflet-pin',
            html: '<div style="width:26px;height:26px;background:#ea580c;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(234,88,12,.45)"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });
          const statusLine = covered
            ? `<strong style="color:#15803d">Couvert</strong> : à moins de ${bufferKm} km d’au moins un <strong>passage enregistré</strong> (point vert).`
            : pts.length === 0
              ? `<strong style="color:#b91c1c">Aucun passage GPS</strong> sur la période — impossible de mesurer la couverture.`
              : `<strong style="color:#b91c1c">Non couvert</strong> : à plus de ${bufferKm} km de tout passage enregistré (point vert).`;

          L.marker([searchHit.lat, searchHit.lng], {
            icon: searchIcon,
            title: searchHit.displayName,
            zIndexOffset: 1500,
          })
            .bindPopup(
              `<div style="font:13px Inter,system-ui,sans-serif;max-width:280px">
                <strong>${escapeHtml(searchHit.displayName)}</strong><br/><br/>
                ${statusLine}
                ${
                  nearest != null && !covered
                    ? `<br/><br/><span style="color:#64748b">Distance au dossier GPS le plus proche : ~${nearest} km</span>`
                    : ''
                }
              </div>`,
            )
            .addTo(overlayRoot);
        }

        const centerLatLngs = riskCenters.map((r) => [r.lat, r.lng] as [number, number]);
        const allRecordLatLngs = [...data.points.map((p) => [p.lat, p.lng] as [number, number]), ...centerLatLngs];
        fitMapView(
          map,
          L,
          allRecordLatLngs,
          myPosition,
          searchHit ? { lat: searchHit.lat, lng: searchHit.lng } : null,
        );

        mapRef.current = map;
        lastBuiltDataRef.current = data;
        lastOverlayKeyRef.current = overlayKey;

        map.invalidateSize();
        setTimeout(() => map.invalidateSize(), 220);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Carte indisponible');
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [data, baseLayer, overlayKey, coverageSummary]);

  const focusOnMe = useCallback(() => {
    const m = mapRef.current;
    if (!m || !myPosition) return;
    m.flyTo([myPosition.lat, myPosition.lng], Math.max(m.getZoom(), 14), { duration: 0.55 });
  }, [myPosition]);

  const runPlaceSearch = useCallback(async () => {
    const q = placeQuery.trim();
    if (q.length < 2) {
      setSearchError('Saisissez au moins 2 caractères.');
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await apiService.geocodeGuinea(q);
      setSearchResults(res.results);
      if (res.results.length === 0) setSearchError('Aucun résultat en Guinée. Précisez le nom ou la commune.');
    } catch (e: unknown) {
      setSearchError(e instanceof Error ? e.message : 'Erreur de recherche');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [placeQuery]);

  const pickSearchResult = useCallback((r: { lat: number; lng: number; displayName: string }) => {
    setSearchHit(r);
    setSearchResults([]);
    setPlaceQuery('');
    setSearchError(null);
  }, []);

  const clearSearchHit = useCallback(() => {
    setSearchHit(null);
  }, []);

  const touchedPrefCount =
    data != null ? data.prefectures.filter((p) => !p.untouched).length : 0;
  const summary = coverageSummary;

  const searchCoverageText = useMemo(() => {
    if (!searchHit || !data) return null;
    const pts = data.points.map((p) => ({ lat: p.lat, lng: p.lng }));
    const rk = data.coverageRadiusKm ?? DEFAULT_COVERAGE_RADIUS_KM;
    const covered = isInsideAnyBuffer(searchHit.lat, searchHit.lng, pts, rk);
    const nearest = nearestDossierKm(searchHit.lat, searchHit.lng, pts);
    if (pts.length === 0) return 'Aucun passage GPS sur la période.';
    if (covered) return `Lieu couvert (≤ ${rk} km d’un passage).`;
    return `Hors zone enregistrée. Dossier GPS le plus proche : ~${nearest ?? '—'} km.`;
  }, [searchHit, data]);

  const unvisitedRows = data?.unvisitedPlaces ?? [];

  const centresAvecCoordsCount = useMemo(() => {
    if (!data?.unvisitedPlaces) return 0;
    return data.unvisitedPlaces.filter(
      (r) => r.type === 'CENTRE_DE_SANTE' && finiteLatLng(r.lat, r.lng) != null,
    ).length;
  }, [data]);

  const flyToUnvisited = useCallback((row: UnvisitedPlaceRow) => {
    const ll = finiteLatLng(row.lat, row.lng);
    if (!ll) return;
    mapRef.current?.flyTo([ll.lat, ll.lng], 13, { duration: 0.55 });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={28} color="#0D7A5F" />
            Couverture terrain
          </h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
            <Calendar size={16} />
            Du
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={dateInputStyle} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
            au
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={dateInputStyle} />
          </label>
          <button
            type="button"
            onClick={() => void fetchData()}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#0D7A5F',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 16px',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            padding: 12,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {data && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: 'Dossiers (période)', value: data.summary.totalBirths },
            { label: 'Avec position GPS', value: data.summary.withGps },
            { label: 'Sans position GPS', value: data.summary.withoutGps },
            { label: 'Préfectures sans dossier', value: data.summary.untouchedPrefectureCount },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 18px',
                minWidth: 160,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          background: '#1a2332',
          minHeight: 560,
        }}
      >
        <div
          ref={mapDivRef}
          style={{
            width: '100%',
            height: 'min(72vh, 720px)',
            minHeight: 560,
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 12,
            right: 12,
            zIndex: 1002,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: 8,
            maxWidth: 420,
          }}
        >
          <div
            style={{
              flex: '1 1 260px',
              minWidth: 200,
              display: 'flex',
              gap: 6,
              padding: 8,
              borderRadius: 12,
              background: 'rgba(255,255,255,.97)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 12px rgba(15,23,42,.1)',
            }}
          >
            <input
              type="search"
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void runPlaceSearch();
              }}
              placeholder="Lieu en Guinée (ex. Kindia, Matoto…)"
              style={{
                flex: 1,
                minWidth: 0,
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: 13,
              }}
            />
            <button
              type="button"
              disabled={searchLoading}
              onClick={() => void runPlaceSearch()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: '#0D7A5F',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: searchLoading ? 'wait' : 'pointer',
              }}
            >
              <Search size={16} />
              Chercher
            </button>
          </div>
          {searchHit && (
            <button
              type="button"
              onClick={clearSearchHit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: '#fff',
                fontSize: 12,
                fontWeight: 700,
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
              Effacer le lieu
            </button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 62,
              left: 12,
              zIndex: 1003,
              width: 'min(96%, 400px)',
              maxHeight: 220,
              overflowY: 'auto',
              borderRadius: 12,
              background: '#fff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(15,23,42,.12)',
            }}
          >
            {searchResults.map((r, i) => (
              <button
                key={`${r.lat}-${r.lng}-${i}`}
                type="button"
                onClick={() => pickSearchResult(r)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  fontSize: 12,
                  color: '#334155',
                  border: 'none',
                  borderBottom: i < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                {r.displayName}
              </button>
            ))}
          </div>
        )}

        {(geoMessage || geoWorking) && (
          <div
            style={{
              position: 'absolute',
              top: 128,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1001,
              maxWidth: 'min(92%, 440px)',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(254, 252, 232, 0.97)',
              border: '1px solid #fde047',
              color: '#854d0e',
              fontSize: 12,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,.08)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span>{geoMessage || (geoWorking ? 'Localisation…' : '')}</span>
            <button
              type="button"
              disabled={geoWorking}
              onClick={() => requestMyPosition()}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #ca8a04',
                background: '#fff',
                fontWeight: 700,
                fontSize: 11,
                cursor: geoWorking ? 'wait' : 'pointer',
                color: '#854d0e',
              }}
            >
              Réessayer position
            </button>
          </div>
        )}

        {searchError && (
          <div
            style={{
              position: 'absolute',
              top: 62,
              left: 12,
              zIndex: 1001,
              maxWidth: 400,
              padding: '8px 12px',
              borderRadius: 10,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {searchError}
          </div>
        )}

        <div
          role="toolbar"
          aria-label="Affichage carte"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              padding: 4,
              borderRadius: 12,
              background: 'rgba(255,255,255,.96)',
              boxShadow: '0 2px 12px rgba(15,23,42,.12)',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setBaseLayer('satellite')}
              aria-pressed={baseLayer === 'satellite'}
              style={layerToggleStyle(baseLayer === 'satellite')}
            >
              <Satellite size={16} style={{ flexShrink: 0 }} />
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setBaseLayer('streets')}
              aria-pressed={baseLayer === 'streets'}
              style={layerToggleStyle(baseLayer === 'streets')}
            >
              <Map size={16} style={{ flexShrink: 0 }} />
              Plan
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: 6,
              borderRadius: 12,
              background: 'rgba(255,255,255,.96)',
              boxShadow: '0 2px 12px rgba(15,23,42,.12)',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setShowRiskCenters((v) => !v)}
              aria-pressed={showRiskCenters}
              style={overlayToggleStyle(showRiskCenters)}
            >
              <MapPinned size={16} />
              Centres non couverts
            </button>
            <button
              type="button"
              onClick={() => setShowMarkers((v) => !v)}
              aria-pressed={showMarkers}
              style={overlayToggleStyle(showMarkers)}
            >
              <MapPin size={16} />
              Passages (vert)
            </button>
            {myPosition && (
              <button
                type="button"
                onClick={focusOnMe}
                style={{
                  ...overlayToggleStyle(true),
                  marginTop: 4,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #93c5fd',
                }}
              >
                <LocateFixed size={16} />
                Ma position
              </button>
            )}
          </div>
        </div>

        {data && summary && (
          <div
            style={{
              position: 'absolute',
              left: 12,
              bottom: 12,
              zIndex: 1000,
              maxWidth: 320,
              borderRadius: 14,
              background: 'rgba(255,255,255,.96)',
              boxShadow: '0 4px 20px rgba(15,23,42,.14)',
              border: '1px solid #e2e8f0',
              padding: '14px 16px',
              fontSize: 12,
              color: '#334155',
              lineHeight: 1.45,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 10 }}>Analyse couverture</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
              <StatMini label="Passages GPS (période)" value={String(summary.gpsCount)} accent="#0D7A5F" />
              <StatMini
                label="Rayon couverture (règle)"
                value={`${summary.bufferRadiusKm} km`}
                accent="#0f172a"
              />
              <StatMini
                label="Dispersion (km)"
                value={summary.spreadRadiusKm != null ? `~${summary.spreadRadiusKm}` : '—'}
                accent="#64748b"
              />
              <StatMini label="Lieu sur la carte" value={searchHit ? 'Oui' : '—'} accent="#ea580c" />
            </div>
            {summary.gpsCount === 0 && centresAvecCoordsCount === 0 && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  color: '#92400e',
                  fontWeight: 600,
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 10,
                  padding: '8px 10px',
                  lineHeight: 1.45,
                }}
              >
                <strong>Pas d’épingle</strong> : il faut des dossiers avec GPS sur la période (vert) et des centres avec
                coordonnées GPS (rouge). Données vides ou seed démo non appliqué.
              </div>
            )}
            {myPosition?.accuracyM != null && myPosition.accuracyM > 2000 && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  color: '#1e40af',
                  fontWeight: 600,
                  background: '#eff6ff',
                  border: '1px solid #93c5fd',
                  borderRadius: 10,
                  padding: '8px 10px',
                  lineHeight: 1.45,
                }}
              >
                Position approximative (±{Math.round(myPosition.accuracyM / 1000)} km). Le cercle = zone possible, pas
                un point exact.
              </div>
            )}
            {searchHit && searchCoverageText && (
              <div style={{ marginTop: 10, fontSize: 11, color: '#475569', fontWeight: 600 }}>{searchCoverageText}</div>
            )}
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px solid #e2e8f0',
                fontSize: 11,
                color: '#64748b',
              }}
            >
              <div style={{ fontWeight: 800, color: '#334155', marginBottom: 8 }}>Légende</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <LegendPinMini color="#34A853" />
                <span>
                  <strong style={{ color: '#15803d' }}>Vert</strong> — dossier saisi avec GPS (période).
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <LegendPinMini color="#EA4335" />
                <span>
                  <strong style={{ color: '#c5221f' }}>Rouge</strong> — centre géolocalisé, sans passage à {summary.bufferRadiusKm} km.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={legendSwatch('#ea580c', false)} /> <strong>Orange</strong> — résultat de recherche.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={legendSwatch('#2563eb', false)} /> <strong>Bleu</strong> — votre position ; disque = incertitude.
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#64748b' }}>
              Préfectures : <strong style={{ color: '#0D7A5F' }}>{touchedPrefCount}</strong> avec dossiers ·{' '}
              <strong style={{ color: '#b91c1c' }}>{data.summary.untouchedPrefectureCount}</strong> sans dossier
            </div>
          </div>
        )}
      </div>

      {data && unvisitedRows.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px 20px 20px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', marginTop: 0, marginBottom: 8 }}>
            Zones et lieux à prioriser ({unvisitedRows.length})
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 14, lineHeight: 1.5 }}>
            Préfectures sans dossier lié, centres de santé avec coordonnées GPS hors rayon des passages terrain, et
            communes situées dans ces préfectures (liste limitée). Cliquez sur une ligne avec « Carte » pour zoomer.
          </p>
          <div style={{ overflowX: 'auto', maxHeight: 480, overflowY: 'auto', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={tableThStyle}>Type</th>
                  <th style={tableThStyle}>Lieu</th>
                  <th style={tableThStyle}>Préfecture</th>
                  <th style={tableThStyle}>Région</th>
                  <th style={tableThStyle}>Motif</th>
                  <th style={{ ...tableThStyle, width: 100 }}>Carte</th>
                </tr>
              </thead>
              <tbody>
                {unvisitedRows.map((row) => (
                  <tr key={`${row.type}-${row.id}`} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={tableTdStyle}>{unvisitedTypeLabel(row.type)}</td>
                    <td style={{ ...tableTdStyle, fontWeight: 700, color: '#0f172a' }}>{row.nom}</td>
                    <td style={tableTdStyle}>{row.prefecture ?? '—'}</td>
                    <td style={tableTdStyle}>{row.region ?? '—'}</td>
                    <td style={{ ...tableTdStyle, color: '#475569', maxWidth: 360 }}>{row.motif}</td>
                    <td style={tableTdStyle}>
                      {finiteLatLng(row.lat, row.lng) != null ? (
                        <button
                          type="button"
                          onClick={() => flyToUnvisited(row)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1px solid #0D7A5F',
                            background: '#ecfdf5',
                            color: '#0D7A5F',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          Voir
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function unvisitedTypeLabel(t: UnvisitedPlaceRow['type']): string {
  switch (t) {
    case 'PREFECTURE':
      return 'Préfecture';
    case 'CENTRE_DE_SANTE':
      return 'Centre';
    case 'COMMUNE':
      return 'Commune';
    default:
      return t;
  }
}

const tableThStyle: CSSProperties = {
  padding: '10px 12px',
  fontWeight: 800,
  fontSize: 11,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.02,
};

const tableTdStyle: CSSProperties = {
  padding: '10px 12px',
  verticalAlign: 'top',
};

function LegendPinMini({ color }: { color: string }) {
  return (
    <svg
      width={18}
      height={22}
      viewBox="0 0 32 40"
      aria-hidden
      style={{ display: 'block', flexShrink: 0, marginTop: 2 }}
    >
      <path
        fill={color}
        d="M16 2C9.4 2 4 7.15 4 13.2c0 8.2 12 22.8 12 22.8s12-14.6 12-22.8C28 7.15 22.6 2 16 2z"
      />
      <circle cx="16" cy="13" r="4" fill="#fff" />
    </svg>
  );
}

function legendSwatch(color: string, ring?: boolean): CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: ring ? 999 : 3,
    background: color,
    flexShrink: 0,
    border: '1px solid rgba(0,0,0,.12)',
    opacity: ring ? 0.45 : 1,
  };
}

function StatMini({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.02 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: accent }}>{value}</div>
    </div>
  );
}

function layerToggleStyle(active: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? '#0D7A5F' : 'transparent',
    color: active ? '#fff' : '#475569',
  };
}

function overlayToggleStyle(active: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? '#ecfdf5' : '#f8fafc',
    color: active ? '#0D7A5F' : '#64748b',
    border: active ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
    justifyContent: 'flex-start',
  };
}

const dateInputStyle: CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13,
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
