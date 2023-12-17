import { IKeyValue, IMapGoogleConfig } from "../@types/interfaces";

export function mapGoogleConfigToDataGridRows(config: IMapGoogleConfig): IKeyValue[] {
  return Object.entries(config).map(([key, value]) => {
    return {
      id: key,
      key,
      value,
    };
  });
}
