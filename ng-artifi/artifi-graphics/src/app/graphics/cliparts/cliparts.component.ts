import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ClipartsService } from './cliparts.service';

@Component({
  selector: 'artifi-cliparts',
  templateUrl: './cliparts.component.html',
  styleUrls: ['./cliparts.component.scss']
})
export class ClipartsComponent implements OnInit {

  @ViewChild('clipParentDiv') clipParentDiv: ElementRef;
  @Input() settings;
  @Output() outputEvents = new EventEmitter();

  isCompletlyLoaded = false;
  clipartImgs = [];
  currentPage = 1;

  activeClipart;

  showLoader = false;
  loader = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif';

  array = [];
  sum = 10;
  throttle = 10;
  scrollDistance = 200;
  scrollUpDistance = 2;



  constructor( private clipartService: ClipartsService) { }

  ngOnInit() {
    this.clipartService.settings = this.settings;
    console.log('cliparts component :: ', this.settings);
    this.clipartService.getCliparts(1).subscribe( (res) => {
      console.log(res);
    });

    console.log('ngOnInit function');

    this.clipartService.settings = this.settings;
    this.showLoader = true;
    this.clipartService.getCliparts(this.currentPage).subscribe( (r) => {
      console.log('**********');
      console.log(r);
      console.log('**********');
      this.clipartImgs = r['Data'].CategoryAssetsList[0]['AssetsList'];
      this.showLoader = false;
      // this.ref.detectChanges(); // for detecting changes
      console.log(this.clipParentDiv.nativeElement.offsetHeight);

      this.scrollDistance = ( window.innerHeight - this.clipParentDiv.nativeElement.offsetHeight ) + 100 ;
    });
  }

  onScrollDown() {
    console.log('on scroll down')
    if (!this.isCompletlyLoaded) {
      this.currentPage++;
      this.showLoader = true;
      this.clipartService.getCliparts(this.currentPage).subscribe( (r) => {
        this.clipartImgs = [...this.clipartImgs, ...r['Data'].CategoryAssetsList[0]['AssetsList']];
        this.showLoader = false;
        this.isCompletlyLoaded = this.clipartImgs.length >= r['Data'].AssetsCount ? true : false ;
      });
    }
  }

  imgClickEventHandle(imgData) {
    this.activeClipart = imgData.Id;
    imgData.ThumbUrl = this.settings.clipartThumbPath + imgData.UniqueName + imgData.Extension;
    imgData = {...imgData, ...{ srcOriginal: this.settings.clipartImagePath + imgData.UniqueName + imgData.Extension }};
    this.outputEvents.emit({ type: 'SELECT_CLIPART', data : imgData });
  }

  onUp() {
    console.log('scrolled up!');
  }

  imageNotFound() {
    console.log('image not found');
  }
}
