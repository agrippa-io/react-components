import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";

export interface IGoogleMapServiceProps {
  loaderOptions: LoaderOptions;
}

export class GoogleMapService {
  loaderOptions: LoaderOptions;
  google: typeof google;
  api: any;

  constructor({ loaderOptions }: IGoogleMapServiceProps) {
    this.loaderOptions = loaderOptions;
  }

  async init() {
    const clientLoader = new Loader({
      version: "weekly",
      libraries: [],
      ...this.loaderOptions,
    });

    try {
      this.google = await clientLoader.load();
    } catch (err) {
      console.error("Failed to load Google Maps Client", err);
    }
  }
}
