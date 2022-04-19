import { IMapToolConfig, MapToolDefaults } from "../../../..";
import IDownloaderToolDefaults from "../types/IDownloaderToolDefaults";

class DownloaderToolDefaults extends MapToolDefaults implements IDownloaderToolDefaults {
    public static TYPE="geovisto-tool-downloader";

    public getType() : string {
		return DownloaderToolDefaults.TYPE;  
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

export default DownloaderToolDefaults;