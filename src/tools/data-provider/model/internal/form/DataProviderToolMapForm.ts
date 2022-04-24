import axios from "axios";

// Geovisto core
import {
  IMapForm,
  LabeledTextFormInput,
  MapObjectForm,
  TabDOMUtil,
} from "../../../../../index.core";
import { IDataset, IDatasetMetadata } from "../../types/dataset/TDatasets";

import IDataProviderTool from "../../types/tool/IDataProviderTool";

/**
 * This class provides controls for management of data provider tool form inputs.
 *
 * @author Petr Knetl
 */
class DataProviderToolMapForm
  extends MapObjectForm<IDataProviderTool>
  implements IMapForm
{
  private htmlContent!: HTMLDivElement;
  private resultContentDiv: HTMLDivElement;
  private searchInput: string;

  /**
   * It creates new map form with respect to the given props.
   *
   * @param tool
   */
  public constructor(tool: IDataProviderTool) {
    super(tool);
    this.searchInput = "";
    this.resultContentDiv = document.createElement("div");
  }

  /**
   * It fills and returns a HTML div element conatining the form.
   */
  public getContent(): HTMLDivElement {
    this.htmlContent = document.createElement("div");
    this.htmlContent.classList.add("data-provider-tab-wrapper");

    const div: HTMLDivElement = this.htmlContent.insertBefore(
      document.createElement("div"),
      null
    );
    div.classList.add("searchbar");
    const searchBar = new LabeledTextFormInput({
      label: "Search for dataset",
      onChangeAction: (e) => this.setSearchInput(e),
    }).create();

    const input: HTMLInputElement = searchBar.getElementsByClassName(
      "geovisto-input-text-input"
    )[0] as HTMLInputElement;
    input.onkeydown = (e) => {
      if (e.key == "Enter") {
        this.setSearchInput(e);
        this.handleSearchQuery();
      }
    };
    div.appendChild(searchBar);

    // append apply button
    const searchButton: HTMLButtonElement = TabDOMUtil.createButton(
      "Search",
      () => {
        this.handleSearchQuery();
      },
      "searchBtn"
    );
    div.appendChild(searchButton);

    this.resultContentDiv.classList.add("results-wrapper");
    this.resultContentDiv.insertAdjacentHTML(
      "afterbegin",
      "Type in any keyword that represents the dataset you are looking for. The ArcGIS Hub will be searched and results displayed."
    );
    this.htmlContent.insertBefore(this.resultContentDiv, null);

    // UI for importing local file
    const uploadWrapper: HTMLDivElement = document.createElement("div");
    uploadWrapper.classList.add("upload-div");
    uploadWrapper.innerHTML = "Or import local file: ";
    const fileInput: HTMLInputElement = document.createElement("input");
    fileInput.type = "file";
    fileInput.addEventListener("change", (event) => {
      const eventTarget = event.target! as HTMLInputElement;
      const file: File = eventTarget.files![0];
      this.importLocalFile(file);
    });
    uploadWrapper.appendChild(fileInput);

    this.resultContentDiv.appendChild(uploadWrapper);
    return this.htmlContent;
  }

  /**
   * Based on datasets metadata renders visual representation.
   * @param datasetMetadata
   */
  private renderDatasetCard(datasetMetadata: IDatasetMetadata) {
    /** Dataset Card **/
    const datasetCardDiv: HTMLDivElement = document.createElement("div");
    datasetCardDiv.classList.add("dataset-card");

    const rowDiv: HTMLDivElement = document.createElement("div");
    rowDiv.classList.add("row-div");
    datasetCardDiv.appendChild(rowDiv);

    /** LEFT COLUMN **/
    const leftColDiv: HTMLDivElement = document.createElement("div");
    leftColDiv.classList.add("col");
    leftColDiv.classList.add("left-col-div");
    rowDiv.appendChild(leftColDiv);

    const titleHeader: HTMLHeadingElement = document.createElement("h1");
    titleHeader.innerHTML = datasetMetadata.name;
    leftColDiv.appendChild(titleHeader);

    const iconHref: HTMLAnchorElement = document.createElement("a");
    iconHref.href = datasetMetadata.url;
    iconHref.target = "_blank"; // open in new tab
    titleHeader.appendChild(iconHref);

    const headerIcon: HTMLElement = document.createElement("i");
    headerIcon.classList.add("fa");
    headerIcon.classList.add("fa-info-circle");
    headerIcon.classList.add("header-icon");
    headerIcon.title = "See detailed ArcGIS HUB page.";
    iconHref.appendChild(headerIcon);

    const publisherHeader: HTMLHeadingElement = document.createElement("h2");
    publisherHeader.innerHTML = datasetMetadata.publisher;
    leftColDiv.appendChild(publisherHeader);

    const descriptionDiv: HTMLHeadingElement = document.createElement("div");
    let description = datasetMetadata.description || "No description provided";
    const max_length = 400;

    if (description.length > max_length) {
      description = description.substring(0, max_length - 3) + "...   ";
      descriptionDiv.innerHTML = description;
      const suffixLink: HTMLAnchorElement = document.createElement("a");
      suffixLink.href = datasetMetadata.url;
      suffixLink.innerHTML =
        '(more <i class="fa fa-external-link-square"></i>)';
      descriptionDiv.appendChild(suffixLink);
    } else {
      descriptionDiv.innerHTML = description;
    }

    leftColDiv.appendChild(descriptionDiv);

    /** RIGHT COLUMN **/
    const rightColDiv: HTMLDivElement = document.createElement("div");
    rightColDiv.classList.add("col");
    rightColDiv.classList.add("right-col-div");
    rowDiv.appendChild(rightColDiv);

    const thumbnailImg: HTMLImageElement = document.createElement("img");
    thumbnailImg.setAttribute("src", String(datasetMetadata.thumbnail));
    rightColDiv.appendChild(thumbnailImg);

    const recordCountDiv: HTMLDivElement = document.createElement("div");
    recordCountDiv.innerHTML = `records count: ${datasetMetadata.recordCount}`;
    rightColDiv.appendChild(recordCountDiv);

    const tagsWrapperDiv: HTMLDivElement = document.createElement("div");
    tagsWrapperDiv.classList.add("tags-wrapper");
    tagsWrapperDiv.innerHTML = `Keywords: ${datasetMetadata.tags.join(", ")}`;
    rightColDiv.appendChild(tagsWrapperDiv);

    const downloadButton: HTMLButtonElement = TabDOMUtil.createButton(
      "Import Data",
      (e) => {
        this.handleDatasetDownload(e, datasetMetadata.id);
      },
      "downloadButton"
    );
    rightColDiv.appendChild(downloadButton);

    this.resultContentDiv.insertBefore(datasetCardDiv, null);
  }

  /**
   * Helper function for setting result div content.
   */
  private setResultContent(content = ""): void {
    this.resultContentDiv.innerHTML = content;
  }

  /**
   * Helper function fo obtaining query matching datasets metadata.
   * @param query searched string
   * @returns List of datasets metadata or 'undefined' on request error.
   */
  private async fetchDatasetsMetadata(
    query: string
  ): Promise<IDatasetMetadata[] | undefined> {
    try {
      const ENPOINT_URL = this.getMapObject()
        .getState()
        .getDataSourceEndpoint();
      const response = await axios.get(ENPOINT_URL, { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Helper function fo obtaining geospatial dataset from data provider API.
   * @param datasetID
   * @returns Dataset geospatial data or 'undefined' on request error.
   */
  private async fetchDataset(datasetID: string): Promise<IDataset | undefined> {
    try {
      const ENPOINT_URL = this.getMapObject()
        .getState()
        .getDataSourceEndpoint();
      const response = await axios.get(`${ENPOINT_URL}${datasetID}/`);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Handler for querying list of matching dataset metadatas and rendering the in the form.
   */
  private async handleSearchQuery(): Promise<void> {
    const datasets: IDatasetMetadata[] | undefined =
      await this.fetchDatasetsMetadata(this.searchInput);
    this.setResultContent();

    if (datasets === undefined) {
      this.setResultContent(
        "Error occured. Unable to search dataset. Try again later."
      );
    } else if (datasets.length === 0) {
      this.setResultContent(
        "Unfortunately no dataset match this search query. Try again with differnt keywords."
      );
    } else {
      // display datasets
      datasets.forEach((datasetMetadata: IDatasetMetadata) =>
        this.renderDatasetCard(datasetMetadata)
      );
    }
  }

  /**
   * Handler function for downloading dataset geospatial data and importing it to the map state.
   * @param datasetID
   */
  private async handleDatasetDownload(
    e: Event,
    datasetID: string
  ): Promise<void> {
    const eventTarget = e.target as HTMLButtonElement;
    const oldContent = eventTarget.innerHTML;
    eventTarget.innerHTML = 'Loading... <div class="loader"></div>';
    eventTarget.disabled = true;
    const dataset: IDataset | undefined = await this.fetchDataset(datasetID);
    eventTarget.innerHTML = oldContent;
    eventTarget.disabled = false;
    if (dataset) {
      let saveToFile: boolean = confirm(
        "Do you want to save dowloaded dataset to local storage for later?"
      );
      if (saveToFile === true) {
        this.saveDatasetToFile(dataset);
      }
      const tool: IDataProviderTool = this.getMapObject();
      tool.importDatasetToMapState(dataset);
      alert("Dataset was successfully imported.");
    } else {
      alert(
        "An error occured while obtaining the data. Please, try it again later."
      );
    }
  }

  /**
   * Saves searchInput value into internal state of form.
   * @param e
   */
  private setSearchInput(e: Event): void {
    if (e !== null) {
      const target = e.target as HTMLInputElement;
      this.searchInput = target.value;
    }
  }

  /**
   * Help function for saving object-like dataset to file storage.
   * @param dataset
   */
  private saveDatasetToFile(dataset: IDataset): void {
    let bl = new Blob([JSON.stringify(dataset)], {
      type: "text/javascript",
    });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "dataset.json";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "this is invisible anyway";
    a.click();
  }

  /**
   * Help function for loading local file dataset to internal Geovisto state.
   * @param inputFile
   */
  private importLocalFile(inputFile: File): void {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const reader = event.target!;
      const dataset = JSON.parse(reader.result as string) as IDataset;
      if (dataset.centroids && dataset.data && dataset.geometry) {
        // valid file structure
        this.getMapObject().importDatasetToMapState(dataset);
        alert("Dataset was successfully imported.");
      } else {
        // import failed
        alert(
          "Selected file is not a valid Geovisto dataset. Please try again with a different file."
        );
      }
    });
    reader.readAsText(inputFile);
  }
}
export default DataProviderToolMapForm;
