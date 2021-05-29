import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from "@angular/core";
import { Clipart } from "./clipart";
import { CoOrdinate } from "./co-ordinate";

@Component({
  selector: "app-clipart",
  templateUrl: "./clipart.component.html",
  styleUrls: ["./clipart.component.css"],
})
export class ClipartComponent implements OnInit, OnChanges {
  @Output() clipartSelected = new EventEmitter();
  @Output() keepAspectRatioToggled = new EventEmitter();
  @Output() colorChanged = new EventEmitter();
  @Output() coOrdinateChanged = new EventEmitter();
  @Input() selectedProduct: string;

  keepAspectRatio: boolean = true;
  selctedHex: string = "#fff";
  selctedClipart: string = "C1";
  coOrdinate: CoOrdinate;

  cliparts: Clipart[] = [];
  constructor() {}

  ngOnInit() {
    this.cliparts = [
      new Clipart("../../assets/images/one.png", "C1"),
      new Clipart("../../assets/images/two.png", "C2"),
      new Clipart("../../assets/images/three.png", "C3"),
      new Clipart("../../assets/images/four.png", "C4"),
      new Clipart("../../assets/images/five.png", "C5"),
      new Clipart("../../assets/images/six.png", "C6"),
      new Clipart("../../assets/images/seven.png", "C7"),
    ];
    this.setDefaultCoordsObjByProductCode("");
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedProduct) {
      this.setDefaultCoordsObjByProductCode(
        changes.selectedProduct.currentValue
      );
    }
  }

  setDefaultCoordsObjByProductCode(productCode: string) {
    switch (productCode) {
      case "GRWINDSOR BLACK0001": {
        this.coOrdinate = { y: 112, x: 72, width: 148.2, height: 224.8 };
        break;
      }
      case "BELARTE CLARET0001": {
        this.coOrdinate = { y: 15.84, x: 137.28, width: 274.56, height: 31.68 };
        break;
      }
      case "MUGEDGE WHITE0001": {
        this.coOrdinate = { y: 80.16, x: 63.84, width: 127.68, height: 160.32 };
        break;
      }
      case "MUGERIKA BLACK0001": {
        this.coOrdinate = { y: 82.08, x: 108, width: 216, height: 164.16 };
        break;
      }
      default: {
        this.coOrdinate = { y: 112, x: 72, width: 148.2, height: 224.8 };
        break;
      }
    }
  }

  clipartSelectedHnd(code: string) {
    this.selctedClipart = code;
    this.clipartSelected.emit(code);
  }

  aspectRatioHnd() {
    this.keepAspectRatioToggled.emit(this.keepAspectRatio);
  }

  colorChangedHnd(hex: string) {
    this.selctedHex = hex;
    this.colorChanged.emit(hex);
  }

  coOrdinateChangedHnd() {
    this.coOrdinateChanged.emit({
      x: this.coOrdinate["x"],
      y: this.coOrdinate["y"],
      width: this.coOrdinate["width"],
      height: this.coOrdinate["height"],
    });
  }
}
