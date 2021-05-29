import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
})
export class PreviewComponent implements OnInit, OnChanges {
  @Input() selectedClipart: string;
  @Input() selectedProduct: string;
  @Input() aspectRatioStatus: boolean;
  @Input() selectedColor: string;
  @Input() coOrdinateObject: any;

  productUrl: string;
  imageLoading = false;

  constructor() {}

  ngOnInit() {
    this.selectedProduct = "GRWINDSOR BLACK0001";
    this.selectedClipart = "C1";
    this.selectedColor = "#fff";
    this.setDefaultCoordsObjByProductCode(this.selectedProduct);
    this.updatePreviewImage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.coOrdinateObject && !changes.coOrdinateObject.currentValue) {
      return;
    }
    if (changes.selectedProduct) {
      this.setDefaultCoordsObjByProductCode(
        changes.selectedProduct.currentValue
      );
    }
    this.updatePreviewImage();
  }

  loadImage(url: string, callback: Function) {
    const image = new Image();
    image.addEventListener("load", () => {
      callback(url);
    });
    image.src = url;
  }

  private updatePreviewImage() {
    const url = this.getUpdateProductUrl();
    this.imageLoading = true;
    this.loadImage(url, (image) => {
      this.productUrl = image;
      this.imageLoading = false;
    });
  }

  private getUpdateProductUrl(): string {
    let url =
      "https://integrationimagelab.artifi.net/Designer/Image/GetImage?" +
      "format=png&" +
      "webApiClientKey=96c1270e-046b-4d0e-a015-e11f8325df35&" +
      "websiteId=49&" +
      "sku=" +
      encodeURIComponent(this.selectedProduct) +
      "&" +
      "viewCode=A2&";
    if (!this.coOrdinateObject) {
      url +=
        "parameters=" +
        encodeURIComponent(
          '[{"type":"image", "src":"' +
            this.selectedClipart +
            '","widget_key":"W1", "customFilters": [{"Color":"' +
            this.selectedColor +
            '","Opacity":1,"type":"Tint"}] }]'
        );
    } else {
      url +=
        "parameters=" +
        encodeURIComponent(
          '[{"type":"image", "width":"' +
            this.coOrdinateObject.width +
            '", "height":"' +
            this.coOrdinateObject.height +
            '", "top": "' +
            this.coOrdinateObject.y +
            '", "left": "' +
            this.coOrdinateObject.x +
            '", "src":"' +
            this.selectedClipart +
            '","widget_key":"W1", "customFilters": [{"Color":"' +
            this.selectedColor +
            '","Opacity":1,"type":"Tint"}] }]'
        );
    }
    return url;
  }

  private setDefaultCoordsObjByProductCode(productCode: string) {
    switch (productCode) {
      case "GRWINDSOR BLACK0001": {
        this.coOrdinateObject = { y: 112, x: 72, width: 148.2, height: 224.8 };
        break;
      }
      case "BELARTE CLARET0001": {
        this.coOrdinateObject = {
          y: 15.84,
          x: 137.28,
          width: 274.56,
          height: 31.68,
        };
        break;
      }
      case "MUGEDGE WHITE0001": {
        this.coOrdinateObject = {
          y: 80.16,
          x: 63.84,
          width: 127.68,
          height: 160.32,
        };
        break;
      }
      case "MUGERIKA BLACK0001": {
        this.coOrdinateObject = {
          y: 82.08,
          x: 108,
          width: 216,
          height: 164.16,
        };
        break;
      }
      default: {
        this.coOrdinateObject = { y: 112, x: 72, width: 148.2, height: 224.8 };
        break;
      }
    }
  }
}
