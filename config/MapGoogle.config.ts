import type { IMapGoogleConfig } from '../src/components/molecules/MapGoogle/MapGoogle/@types/interfaces/IMapGoogleConfig'

// The Google Maps / Places browser key is never committed. Storybook (dev,
// static build and the Vitest story project) reads it from the
// STORYBOOK_GOOGLE_MAPS_API_KEY env var: put it in a git-ignored `.env` (see
// `.env.example`). The library build (`yarn build`) only exposes VITE_* vars,
// so the published package always ships an empty key: consumers pass their own
// `config.apiKey`. See README "Google Maps API key" for rotation.
type EnvMeta = ImportMeta & { env?: Record<string, string | undefined> }

export const MapGoogleConfig: IMapGoogleConfig = {
  apiKey: (import.meta as EnvMeta).env?.STORYBOOK_GOOGLE_MAPS_API_KEY ?? '',
}
