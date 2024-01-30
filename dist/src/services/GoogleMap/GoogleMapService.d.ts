/// <reference types="google.maps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
import { LoaderOptions } from '@googlemaps/js-api-loader'
export interface IGoogleMapServiceProps {
  loaderOptions: LoaderOptions
}
export declare class GoogleMapService {
  loaderOptions: LoaderOptions
  google?: typeof google
  constructor({ loaderOptions }: IGoogleMapServiceProps)
  init(): Promise<void>
}
