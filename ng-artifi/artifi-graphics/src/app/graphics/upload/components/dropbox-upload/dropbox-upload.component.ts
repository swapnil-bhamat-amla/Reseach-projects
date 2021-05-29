import { Component, Renderer2, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { UploadImageService } from '../../upload-image.service';
declare var Dropbox;

@Component({
  selector: 'artifi-dropbox-upload',
  templateUrl: './dropbox-upload.component.html',
  styleUrls: ['./dropbox-upload.component.scss']
})
export class DropboxUploadComponent implements OnInit {

  @Input() settings;
  @Output() outputEvent = new EventEmitter();

  constructor(
    private cuService: UploadImageService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document
    ) { }

   ngOnInit() {
    const dropboxScript = this.renderer.createElement('script');
    dropboxScript.src = this.settings.upload.dropbox.apiUrl;
    dropboxScript.id = 'dropboxjs';
    this.renderer.setAttribute(dropboxScript, 'data-app-key', this.settings.upload.dropbox.appKey);
    dropboxScript.onload = () => { this.afterScriptAdded(); };
    this.renderer.appendChild(this.document.body, dropboxScript);
  }

   processData(res) {
    const data = [];

    res.forEach( (single) => {
      let standardImage = single.link;

      if (standardImage.endsWith('0')) {
          const replacement = '1';
          standardImage = standardImage.replace(/0([^0]*)$/, replacement + '$1');
      }

      const dataArr = {
        FrontAppUserId: this.settings.frontAppUserId,
        WebsiteId: this.settings.websiteId,
        CompanyId: this.settings.companyId,
        CompanyPhysicalFolderName: this.settings.CompanyPhysicalFolderName,
        Scope: 'dropbox',
        Width: null,
        Height: null,
        ImageName: single.name,
        OriginalImageUrl: standardImage,
        ImageScopeId: single.id
      };
      data.push(dataArr);
    });
    console.log(data);
    this.cuService.uploadSocial(this.settings.upload.dropbox.uploadURL, data).subscribe( (rtn) => {
      if (rtn['Response'] === 'Success') {
        this.outputEvent.emit({type: 'NAVIGATE', data: 'my-art'});
      } else {

      }
    });

   }

   errorHandler(err) {
    console.log(err);
   }

   afterScriptAdded() {
    console.log('load dropbox');
    const options = {
      // Required. Called when a user selects an item in the Chooser.
      success: (response) => { this.processData(response); },
      cancel: (err) => { this.errorHandler(err); },
      linkType: 'preview', // or "direct"
      multiselect: this.settings.upload.dropbox.multiselect, // or true
    };

    Dropbox.choose(options);
   }


}
