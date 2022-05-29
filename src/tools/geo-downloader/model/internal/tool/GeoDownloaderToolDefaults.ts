import { 
	IMapToolConfig, 
	MapToolDefaults 
} from "../../../../../index.core";

import IGeoDownloaderToolDefaults from "../../types/tool/IGeoDownloaderToolDefaults";

/**
 * Defaults class for GeoDownloaderTool
 * @author Vojtěch Malý
 */
class GeoDownloaderToolDefaults extends MapToolDefaults implements IGeoDownloaderToolDefaults {

    public static TYPE = "geovisto-tool-geo-downloader";

    public getType() : string {
		return GeoDownloaderToolDefaults.TYPE;  
    }

    public isSingleton(): boolean {
		return true; 
	}
    
	public getLabel(): string {
		return "Downloader Tool";
	}

	public getIcon(): string {
		return '<i class="fa fa-cloud-download"></i>';
	}
  
	public getConfig(): IMapToolConfig {
		return super.getConfig();
	}
}

export default GeoDownloaderToolDefaults;