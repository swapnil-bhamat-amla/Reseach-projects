// tslint:disable:max-line-length

import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadImageService } from '../../upload-image.service';

@Component({
  selector: 'artifi-computer-upload',
  templateUrl: './computer-upload.component.html',
  styleUrls: ['./computer-upload.component.scss']
})
export class ComputerUploadComponent implements OnInit {

  @Input() settings;
  @Input() localization;
  @Output() outputEvent = new EventEmitter();

  errors = [];
  validFiles = [];
  totalFileUploaded = [];
  totalFileSize = 0;
  currentFileProcessing = '';
  currentFilePercent = 0;

  uploadBtnState = true; // state of upload button :: it will add disabled class to button

  constructor(private cuService: UploadImageService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cuService.settings = this.settings;
  }

  getDefaultErrorMessages(type) {
    switch (type) {
      case 'fileSize' : return 'File size should not exceed {FILE_SIZE}mb. '; break;
      case 'fileExtension' : return 'Only {FILE_EXTENSIONS} files are allowed'; break;
      default : return 'Something went wrong please try again';
    }
  }

  getDefaultErrorParams(type) {
    switch (type) {
      case 'fileSize' : return [{ FILE_SIZE : this.settings.upload.computer.maxFileSize }]; break;
      case 'fileExtension' : return [{ FILE_EXTENSIONS : getFileExtensions(this.settings.upload.computer.fileType)}]; break;
      default : return [];
    }

    function getFileExtensions(fileType) {
      return fileType.replace(/,([^,]*)$/, ' and $1');
    }
  }

  generateError(type, file, message = '', params = []) {
    if (message === '') {
      message = this.getDefaultErrorMessages(type);
      params = this.getDefaultErrorParams(type);
    }
    params.forEach( (p) => {
      const keys = Object.keys(p);
      for ( const key of keys ) {
        message = message.replace('{' + key + '}', p[key]);
      }
    });
    const htmlStr = '<b>Error: </b>' + message + '<br/>' + '<b>File Name:</b> ' + file.name;
    this.errors.push(htmlStr);
  }

  validateFileSize(size) {
    // bytes to MB convert and compare to redux param size
    return (this.settings.upload.computer.maxFileSize * 1000000) <= size;
  }

  validateFileExtension(extension) {
    // split and check extension is in given fileType array
    if ( this.getAcceptParams().split(',').indexOf(extension) === -1 ) {
      return true;
    }
    return false;
  }

  validateFile(file) {
    // filesize validations
    if (this.validateFileSize(file.size)) {
      // generate error
      /* fileSize.message & fileSize.param is getting from redux */
      this.generateError('fileSize', file);
    }

    // file extension validations
    if ( this.validateFileExtension(file.type) ) {
      // generate error
      /* fileSize.message & fileSize.param is getting from redux */
      this.generateError('fileExtension', file);
    }

    if (this.errors.length <= 0) { // global error var
      return true;
    } else {
      return false;
    }
  }

  fileChange(files: File[]) {

    // empty existing errors
    this.errors = [];

    // validate each file
    Array.from(files).forEach( (file) => {
      if (this.validateFile(file)) {
        this.totalFileSize += file.size;
        this.validFiles.push({ file, key: this.UUID() });
        this.cdRef.detectChanges();
      }
    });
    console.log(this.validFiles);

    if (this.errors.length > 0) {
      // errors
      console.log(this.errors);
    } else {
      if (this.settings.upload.computer.directUploadFlag) {
        this.uploadPhotos();
      }
    }
    this.checkUploadBtnStatus();
  }

  uploadPhotos() {
    this.validFiles.forEach( (formData) => {
      const fData = new FormData();
      fData.append('file', formData.file);
      fData.append('name', formData.file.name);
      this.currentFileProcessing = formData.key;
      this.cuService.uploadSingle(fData).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.currentFilePercent = Math.round(100 * event.loaded / event.total);
            this.cdRef.detectChanges();
          } else if (event instanceof HttpResponse) {
            this.currentFilePercent = 0;
            this.currentFileProcessing = '';
            this.totalFileUploaded.push(formData.key);
            this.outputEvent.emit({type: 'NAVIGATE', data: 'my-art'});
            this.checkUploadBtnStatus();
            this.cdRef.detectChanges();
          }
      });
    });
  }

  /* generate unique charstr id */
  UUID() {
    return Math.random().toString(36).split('').filter( (value, index, self) => {
        return self.indexOf(value) === index;
    }).join('').substr(2, 8);
  }


  /* function to generate accept attribute dynamically */
  getAcceptParams() {
    const acceptParamArray = [];
    this.settings.upload.computer.fileType.split(',').forEach( (ext) => {
      acceptParamArray.push('image/' + ext);
    });
    return acceptParamArray.join(',');
  }

  getFileProgress(key) {
    if (this.currentFileProcessing === key) {
      return ( this.currentFilePercent / 100 );
    } else if (this.totalFileUploaded.indexOf(key) === -1) {
      return 0;
    } else {
      return 1;
    }
  }

  /* prevent double click event */
  stopPropogation(event) {
    event.stopPropagation();
  }


  checkUploadBtnStatus() {
    const totalFileUploaded = this.totalFileUploaded;
    const tempArr = [];
    this.validFiles.filter( (file) => {
      if (totalFileUploaded.indexOf(file.key) === -1) {
        tempArr.push(file.key);
      }
    });
    this.uploadBtnState = tempArr.length <= 0;
    this.cdRef.detectChanges();
  }


  deletePhoto(key) {
    this.validFiles = this.validFiles.filter( (file) => {
      return file.key !== key;
    });
    this.cdRef.detectChanges();
  }
}
