import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[imageLoader]'
})
export class ImageLoader {
  @Input() imageLoader;

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundImage = "url('../../assets/images/spinner.gif')";
  }

  ngOnInit() {
    let image = new Image();
    image.addEventListener('load', () => {
      this.el.nativeElement.style.backgroundImage = `url(${this.imageLoader})`;
    });
    image.src = this.imageLoader;
  }
}
