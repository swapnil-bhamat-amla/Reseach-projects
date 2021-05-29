import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from './product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Output() productSelected = new EventEmitter();
  products: Product[] = [];
  constructor() { }

  ngOnInit() {
    this.products = [
      new Product('../../assets/images/GRWINDSOR~BLACK0001_FRONT.png','GRWINDSOR BLACK0001'),
      new Product('../../assets/images/BELARTE~CLARET0001_FRONT.png','BELARTE CLARET0001'),
      new Product('../../assets/images/MUGEDGE~WHITE0001_FRONT.png','MUGEDGE WHITE0001'),
      new Product('../../assets/images/MUGERIKA~BLACK0001_FRONT.png','MUGERIKA BLACK0001')
    ]
  }

  productSelectedHnd(code:string){
    this.productSelected.emit(code);
  }

}
