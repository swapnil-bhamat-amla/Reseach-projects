(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-2\">\n      <app-product (productSelected)=\"selectedProductCode = $event\"></app-product>\n    </div>\n    <div class=\"col-md-6\">\n      <app-preview [selectedProduct]=\"selectedProductCode\" [selectedClipart]=\"selectedClipartCode\" [aspectRatioStatus]=\"keepAspectRatioStatus\" [selectedColor]=\"colorValue\" [coOrdinateObject]=\"coOrdinateValue\" ></app-preview>\n    </div>\n    <div class=\"col-md-4\">\n      <app-clipart (clipartSelected)=\"selectedClipartCode = $event\"  (keepAspectRatioToggled)=\"keepAspectRatioStatus = $event\" (colorChanged)=\"colorValue = $event\" (coOrdinateChanged)=\"coOrdinateValue = $event\"></app-clipart>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _clipart_clipart_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./clipart/clipart.component */ "./src/app/clipart/clipart.component.ts");
/* harmony import */ var _preview_preview_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./preview/preview.component */ "./src/app/preview/preview.component.ts");
/* harmony import */ var _product_product_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./product/product.component */ "./src/app/product/product.component.ts");
/* harmony import */ var _preview_image_loader_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./preview/image-loader.directive */ "./src/app/preview/image-loader.directive.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _clipart_clipart_component__WEBPACK_IMPORTED_MODULE_4__["ClipartComponent"],
                _preview_preview_component__WEBPACK_IMPORTED_MODULE_5__["PreviewComponent"],
                _product_product_component__WEBPACK_IMPORTED_MODULE_6__["ProductComponent"],
                _preview_image_loader_directive__WEBPACK_IMPORTED_MODULE_7__["ImageLoader"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/clipart/clipart.component.css":
/*!***********************************************!*\
  !*** ./src/app/clipart/clipart.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ul.swatches{\r\n    list-style: none;\r\n    padding: 0;\r\n    overflow: hidden;\r\n    clear: both;\r\n } \r\n .swatches li{\r\n     float: left;\r\n } \r\n .swatch {\r\n     width: 30px;\r\n     height: 30px;\r\n     border-radius: 5px;\r\n     border: 2px solid #666;\r\n     margin: 3px;\r\n } \r\n .swatch-clickable:hover {\r\n border: 2px solid #ff0000;\r\n cursor: pointer;\r\n } \r\n .swatch-clickable.selected { border:solid 2px #ff0000; } \r\n ul.gallery li {\r\n    display: block;\r\n    height: 100px;\r\n    line-height: 100px;\r\n} \r\n .gallery li {\r\n    display: inline;\r\n    list-style: none;\r\n    width: 100px;\r\n    min-height: 100px;\r\n    float: left;\r\n    margin: 0 10px 10px 0;\r\n    padding: 10px;\r\n    border: 2px solid #ccc;\r\n    text-align: center;\r\n} \r\n .gallery li.selected {\r\n    border:solid 2px #ff0000;\r\n} \r\n ul.gallery li img {\r\n    vertical-align: middle;\r\n}\r\n\r\n  \r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpcGFydC9jbGlwYXJ0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxpQkFBaUI7SUFDakIsV0FBVztJQUNYLGlCQUFpQjtJQUNqQixZQUFZO0VBQ2Q7Q0FDRDtLQUNJLFlBQVk7RUFDZjtDQUNEO0tBQ0ksWUFBWTtLQUNaLGFBQWE7S0FDYixtQkFBbUI7S0FDbkIsdUJBQXVCO0tBQ3ZCLFlBQVk7RUFDZjtDQUVEO0NBQ0EsMEJBQTBCO0NBQzFCLGdCQUFnQjtFQUNmO0NBQ0QsNkJBQTZCLHlCQUF5QixFQUFFO0NBSXpEO0lBQ0ksZUFBZTtJQUNmLGNBQWM7SUFDZCxtQkFBbUI7Q0FDdEI7Q0FFRDtJQUNJLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIsYUFBYTtJQUNiLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osc0JBQXNCO0lBQ3RCLGNBQWM7SUFDZCx1QkFBdUI7SUFDdkIsbUJBQW1CO0NBQ3RCO0NBRUQ7SUFDSSx5QkFBeUI7Q0FDNUI7Q0FFRDtJQUNJLHVCQUF1QjtDQUMxQiIsImZpbGUiOiJzcmMvYXBwL2NsaXBhcnQvY2xpcGFydC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsidWwuc3dhdGNoZXN7XHJcbiAgICBsaXN0LXN0eWxlOiBub25lO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBjbGVhcjogYm90aDtcclxuIH0gXHJcbiAuc3dhdGNoZXMgbGl7XHJcbiAgICAgZmxvYXQ6IGxlZnQ7XHJcbiB9XHJcbiAuc3dhdGNoIHtcclxuICAgICB3aWR0aDogMzBweDtcclxuICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgIGJvcmRlcjogMnB4IHNvbGlkICM2NjY7XHJcbiAgICAgbWFyZ2luOiAzcHg7XHJcbiB9XHJcbiBcclxuIC5zd2F0Y2gtY2xpY2thYmxlOmhvdmVyIHtcclxuIGJvcmRlcjogMnB4IHNvbGlkICNmZjAwMDA7XHJcbiBjdXJzb3I6IHBvaW50ZXI7XHJcbiB9XHJcbiAuc3dhdGNoLWNsaWNrYWJsZS5zZWxlY3RlZCB7IGJvcmRlcjpzb2xpZCAycHggI2ZmMDAwMDsgfVxyXG5cclxuXHJcblxyXG51bC5nYWxsZXJ5IGxpIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgaGVpZ2h0OiAxMDBweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxMDBweDtcclxufVxyXG5cclxuLmdhbGxlcnkgbGkge1xyXG4gICAgZGlzcGxheTogaW5saW5lO1xyXG4gICAgbGlzdC1zdHlsZTogbm9uZTtcclxuICAgIHdpZHRoOiAxMDBweDtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMHB4O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBtYXJnaW46IDAgMTBweCAxMHB4IDA7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgI2NjYztcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLmdhbGxlcnkgbGkuc2VsZWN0ZWQge1xyXG4gICAgYm9yZGVyOnNvbGlkIDJweCAjZmYwMDAwO1xyXG59XHJcblxyXG51bC5nYWxsZXJ5IGxpIGltZyB7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG59XHJcblxyXG4gICJdfQ== */"

/***/ }),

/***/ "./src/app/clipart/clipart.component.html":
/*!************************************************!*\
  !*** ./src/app/clipart/clipart.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n\n  <div class=\"col-lg-12\">\n    <h3 class=\"page-header\">Properties</h3>\n  </div>\n\n  <div class=\"row\">\n        <ul class=\"gallery\">\n                <li *ngFor=\"let clipart of cliparts\" (click)=\"clipartSelectedHnd(clipart.code)\" [ngClass]=\"{'selected': selctedClipart == clipart.code}\">\n                    <a href=\"#\"><img class=\"img-responsive\" src=\"{{clipart.path}}\"  alt=\"image\" /></a>\n                </li>\n        </ul>\n  </div>\n  <div class=\"row hidden\" >\n    <div class=\"col-lg-12\">\n        <div class=\"form-group checkbox\">\n            <label><input type=\"checkbox\" [(ngModel)]=\"keepAspectRatio\" (change)=\"aspectRatioHnd()\">Keep Aspect Ratio?</label>\n        </div>\n    </div>\n  </div>\n  <hr/>\n  <div class=\"row\">\n    <div class=\"col-lg-12\">\n        <h4>Imprint Colors</h4>\n            <ul class=\"swatches\">\n                    <li>\n                        <div title=\"White\" class=\"swatch swatch-clickable\" [ngClass]=\"{'selected': selctedHex == '#000'}\"  style=\"background-color:#000\" (click)=\"colorChangedHnd('#000')\" ></div>\n                    </li>\n                    <li>\n                        <div title=\"White\" class=\"swatch swatch-clickable\" [ngClass]=\"{'selected': selctedHex == '#fff'}\"  style=\"background-color:#fff\" (click)=\"colorChangedHnd('#fff')\"></div>\n                    </li>\n                    <li>\n                        <div title=\"Red\" class=\"swatch swatch-clickable\" [ngClass]=\"{'selected': selctedHex == '#f00'}\" style=\"background-color:#f00\" (click)=\"colorChangedHnd('#f00')\"></div>\n                    </li>\n                    <li>\n                        <div title=\"Green\" class=\"swatch swatch-clickable\" [ngClass]=\"{'selected': selctedHex == '#0f0'}\" style=\"background-color:#0f0\" (click)=\"colorChangedHnd('#0f0')\"></div>\n                    </li>\n                    <li>\n                        <div title=\"Blue\" class=\"swatch swatch-clickable\" [ngClass]=\"{'selected': selctedHex == '#00f'}\" style=\"background-color:#00f\" (click)=\"colorChangedHnd('#00f')\"></div>\n                    </li>\n            </ul>\n    </div>\n  </div>\n  <hr/>\n  <div class=\"row\">\n        <div class=\"col-md-3 col-xs-6\">\n            <div class=\"form-group\">\n                <label for=\"x\">Top:</label>\n                <input type=\"text\" class=\"form-control\" id=\"x\" [(ngModel)]=\"coOrdinate.x\">\n            </div>\n        </div>\n        <div class=\"col-md-3 col-xs-6\">\n            <div class=\"form-group\">\n                <label for=\"y\">left:</label>\n                <input type=\"text\" class=\"form-control\" id=\"y\" [(ngModel)]=\"coOrdinate.y\">\n            </div>\n        </div>\n        <div class=\"col-md-3 col-xs-6\">\n            <div class=\"form-group\">\n                <label for=\"width\">Width:</label>\n                <input type=\"text\" class=\"form-control\" id=\"width\" [(ngModel)]=\"coOrdinate.width\">\n            </div>\n        </div>\n        <div class=\"col-md-3 col-xs-6\">\n            <div class=\"form-group\">\n                <label for=\"height\">Height:</label>\n                <input type=\"text\" class=\"form-control\" id=\"height\" [(ngModel)]=\"coOrdinate.height\">\n            </div>\n        </div>\n        <div class=\"col-md-12 col-xs-12\">\n            <div class=\"form-group\">\n                  <button class=\"form-control btn btn-primary\" (click)=\"coOrdinateChangedHnd()\">Update</button>  \n            </div>\n        </div>\n  </div>\n  \n\n  \n</div>"

/***/ }),

/***/ "./src/app/clipart/clipart.component.ts":
/*!**********************************************!*\
  !*** ./src/app/clipart/clipart.component.ts ***!
  \**********************************************/
/*! exports provided: ClipartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipartComponent", function() { return ClipartComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _clipart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clipart */ "./src/app/clipart/clipart.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ClipartComponent = /** @class */ (function () {
    function ClipartComponent() {
        this.clipartSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.keepAspectRatioToggled = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.colorChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.coOrdinateChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.keepAspectRatio = true;
        this.selctedHex = '#fff';
        this.selctedClipart = 'C1';
        this.coOrdinate = { x: 0, y: 0, width: 50, height: 50 };
        this.cliparts = [];
    }
    ClipartComponent.prototype.ngOnInit = function () {
        this.cliparts = [
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/one.png', 'C1'),
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/two.png', 'C2'),
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/three.png', 'C3'),
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/four.png', 'C4'),
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/five.png', 'C5'),
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/six.png', 'C6'),
            new _clipart__WEBPACK_IMPORTED_MODULE_1__["Clipart"]('../../assets/images/seven.png', 'C7')
        ];
    };
    ClipartComponent.prototype.clipartSelectedHnd = function (code) {
        this.selctedClipart = code;
        this.clipartSelected.emit(code);
    };
    ClipartComponent.prototype.aspectRatioHnd = function () {
        this.keepAspectRatioToggled.emit(this.keepAspectRatio);
    };
    ClipartComponent.prototype.colorChangedHnd = function (hex) {
        this.selctedHex = hex;
        this.colorChanged.emit(hex);
    };
    ClipartComponent.prototype.coOrdinateChangedHnd = function () {
        this.coOrdinateChanged.emit({ "x": this.coOrdinate['x'], y: this.coOrdinate['y'], width: this.coOrdinate['width'], height: this.coOrdinate['height'] });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ClipartComponent.prototype, "clipartSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ClipartComponent.prototype, "keepAspectRatioToggled", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ClipartComponent.prototype, "colorChanged", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ClipartComponent.prototype, "coOrdinateChanged", void 0);
    ClipartComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-clipart',
            template: __webpack_require__(/*! ./clipart.component.html */ "./src/app/clipart/clipart.component.html"),
            styles: [__webpack_require__(/*! ./clipart.component.css */ "./src/app/clipart/clipart.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ClipartComponent);
    return ClipartComponent;
}());



/***/ }),

/***/ "./src/app/clipart/clipart.ts":
/*!************************************!*\
  !*** ./src/app/clipart/clipart.ts ***!
  \************************************/
/*! exports provided: Clipart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Clipart", function() { return Clipart; });
var Clipart = /** @class */ (function () {
    function Clipart(path, code) {
        this.path = path;
        this.code = code;
    }
    return Clipart;
}());



/***/ }),

/***/ "./src/app/preview/image-loader.directive.ts":
/*!***************************************************!*\
  !*** ./src/app/preview/image-loader.directive.ts ***!
  \***************************************************/
/*! exports provided: ImageLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageLoader", function() { return ImageLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ImageLoader = /** @class */ (function () {
    function ImageLoader(el) {
        this.el = el;
        this.el.nativeElement.style.backgroundImage = "url('../../assets/images/spinner.gif')";
    }
    ImageLoader.prototype.ngOnInit = function () {
        var _this = this;
        var image = new Image();
        image.addEventListener('load', function () {
            _this.el.nativeElement.style.backgroundImage = "url(" + _this.imageLoader + ")";
        });
        image.src = this.imageLoader;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ImageLoader.prototype, "imageLoader", void 0);
    ImageLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[imageLoader]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], ImageLoader);
    return ImageLoader;
}());



/***/ }),

/***/ "./src/app/preview/preview.component.css":
/*!***********************************************!*\
  !*** ./src/app/preview/preview.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\r\n    position: relative;\r\n  }\r\n  \r\n  .jumbo {\r\n    position: absolute;\r\n    top: 50%;\r\n    left:50%;\r\n    -webkit-transform: translate(-50%,-50%);\r\n            transform: translate(-50%,-50%);\r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcHJldmlldy9wcmV2aWV3LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxtQkFBbUI7R0FDcEI7O0VBRUQ7SUFDRSxtQkFBbUI7SUFDbkIsU0FBUztJQUNULFNBQVM7SUFDVCx3Q0FBZ0M7WUFBaEMsZ0NBQWdDO0dBQ2pDIiwiZmlsZSI6InNyYy9hcHAvcHJldmlldy9wcmV2aWV3LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB9XHJcbiAgXHJcbiAgLmp1bWJvIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogNTAlO1xyXG4gICAgbGVmdDo1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpO1xyXG4gIH0iXX0= */"

/***/ }),

/***/ "./src/app/preview/preview.component.html":
/*!************************************************!*\
  !*** ./src/app/preview/preview.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n\n  <div class=\"col-lg-12\">\n    <h3 class=\"page-header\">Preview</h3>\n  </div>\n\n  <div class=\"col-lg-12 container\">\n      <a class=\"thumbnail\" href=\"#\">\n          <img class=\"img-responsive\" src=\"{{productUrl}}\" alt=\"\">  \n          <img *ngIf=\"imageLoading\" class=\"img-responsive jumbo\" src=\"../../assets/images/spinner.gif\" alt=\"\">\n      </a>\n      \n  </div>\n</div>"

/***/ }),

/***/ "./src/app/preview/preview.component.ts":
/*!**********************************************!*\
  !*** ./src/app/preview/preview.component.ts ***!
  \**********************************************/
/*! exports provided: PreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreviewComponent", function() { return PreviewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PreviewComponent = /** @class */ (function () {
    function PreviewComponent() {
        this.imageLoading = false;
    }
    PreviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.selectedProduct = 'GRWINDSOR BLACK0001';
        this.selectedClipart = 'C1';
        this.selectedColor = '#fff';
        var url = this.getUpdateProductUrl();
        this.imageLoading = true;
        this.loadImage(url, function (image) {
            _this.productUrl = image;
            _this.imageLoading = false;
        });
    };
    PreviewComponent.prototype.getUpdateProductUrl = function () {
        var url = 'https://integrationimagelab.artifi.net/Designer/Image/GetImage?' +
            'format=png&' +
            'webApiClientKey=96c1270e-046b-4d0e-a015-e11f8325df35&' +
            'websiteId=49&' +
            'sku=' + encodeURIComponent(this.selectedProduct) + '&' +
            'viewCode=A2&';
        if (!this.coOrdinateObject) {
            url += 'parameters=' + encodeURIComponent('[{"type":"image", "src":"' + this.selectedClipart + '","widget_key":"W1", "customFilters": [{"Color":"' + this.selectedColor + '","Opacity":1,"type":"Tint"}] }]');
        }
        else {
            url += 'parameters=' + encodeURIComponent('[{"type":"image", "width":"' + this.coOrdinateObject.width + '", "height":"' + this.coOrdinateObject.height + '", "top": "' + this.coOrdinateObject.x + '", "left": "' + this.coOrdinateObject.y + '", "src":"' + this.selectedClipart + '","widget_key":"W1", "customFilters": [{"Color":"' + this.selectedColor + '","Opacity":1,"type":"Tint"}] }]');
        }
        return url;
    };
    PreviewComponent.prototype.loadImage = function (url, callback) {
        var image = new Image();
        image.addEventListener('load', function () {
            callback(url);
        });
        image.src = url;
    };
    PreviewComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var url = this.getUpdateProductUrl();
        this.imageLoading = true;
        this.loadImage(url, function (image) {
            _this.productUrl = image;
            _this.imageLoading = false;
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], PreviewComponent.prototype, "selectedClipart", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], PreviewComponent.prototype, "selectedProduct", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], PreviewComponent.prototype, "aspectRatioStatus", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], PreviewComponent.prototype, "selectedColor", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], PreviewComponent.prototype, "coOrdinateObject", void 0);
    PreviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-preview',
            template: __webpack_require__(/*! ./preview.component.html */ "./src/app/preview/preview.component.html"),
            styles: [__webpack_require__(/*! ./preview.component.css */ "./src/app/preview/preview.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PreviewComponent);
    return PreviewComponent;
}());



/***/ }),

/***/ "./src/app/product/product.component.css":
/*!***********************************************!*\
  !*** ./src/app/product/product.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3Byb2R1Y3QvcHJvZHVjdC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/product/product.component.html":
/*!************************************************!*\
  !*** ./src/app/product/product.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n\n  <div class=\"col-lg-12\">\n      <h3 class=\"page-header\">Select Product</h3>\n  </div>\n\n  <div *ngFor=\"let product of products\" class=\"col-lg-12 col-md-12 col-xs-3 thumb\">\n      <a class=\"thumbnail\" href=\"#\">\n          <img class=\"img-responsive\" src=\"{{product.path}}\" (click)=\"productSelectedHnd(product.code)\" alt=\"\">\n      </a>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/product/product.component.ts":
/*!**********************************************!*\
  !*** ./src/app/product/product.component.ts ***!
  \**********************************************/
/*! exports provided: ProductComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProductComponent", function() { return ProductComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _product__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./product */ "./src/app/product/product.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProductComponent = /** @class */ (function () {
    function ProductComponent() {
        this.productSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.products = [];
    }
    ProductComponent.prototype.ngOnInit = function () {
        this.products = [
            new _product__WEBPACK_IMPORTED_MODULE_1__["Product"]('../../assets/images/GRWINDSOR~BLACK0001_FRONT.png', 'GRWINDSOR BLACK0001'),
            new _product__WEBPACK_IMPORTED_MODULE_1__["Product"]('../../assets/images/BELARTE~CLARET0001_FRONT.png', 'BELARTE CLARET0001'),
            new _product__WEBPACK_IMPORTED_MODULE_1__["Product"]('../../assets/images/MUGEDGE~WHITE0001_FRONT.png', 'MUGEDGE WHITE0001'),
            new _product__WEBPACK_IMPORTED_MODULE_1__["Product"]('../../assets/images/MUGERIKA~BLACK0001_FRONT.png', 'MUGERIKA BLACK0001')
        ];
    };
    ProductComponent.prototype.productSelectedHnd = function (code) {
        this.productSelected.emit(code);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProductComponent.prototype, "productSelected", void 0);
    ProductComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-product',
            template: __webpack_require__(/*! ./product.component.html */ "./src/app/product/product.component.html"),
            styles: [__webpack_require__(/*! ./product.component.css */ "./src/app/product/product.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ProductComponent);
    return ProductComponent;
}());



/***/ }),

/***/ "./src/app/product/product.ts":
/*!************************************!*\
  !*** ./src/app/product/product.ts ***!
  \************************************/
/*! exports provided: Product */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Product", function() { return Product; });
var Product = /** @class */ (function () {
    function Product(path, code) {
        this.path = path;
        this.code = code;
    }
    return Product;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Angular Projects\Myron-Demo\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map