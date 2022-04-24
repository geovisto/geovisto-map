import { IMapData } from "../../../../../index.core";

/**
 * Type definition of Datasets used in Data Provider tool.
 *
 * @author Petr Knetl
 */

/**
 * This type provides specification of dataset content obtained from backend parser.
 */
export type IDataset = {
  geometry: unknown;
  centroids: unknown;
  data: IMapData;
};

/**
 * This type provides specification of dataset descriptive data obtained form backend parser.
 */
export type IDatasetMetadata = {
  id: string;
  name: string;
  description: string;
  fields: object;
  thumbnail: URL;
  structuredLicence: object;
  publisher: string;
  tags: string[];
  recordCount: number;
  url: string;
  data: URL;
};
