import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'artifi-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.scss']
})
export class ConfirmAlertComponent implements OnInit {

  @Output() outputEv = new EventEmitter();

  @Input() modalData = {
    title: '',
    body: '',
    buttons: {
      yes: '',
      no: '',
      close: ''
    },
    iconClass: ''
  };


  constructor() { }

  ngOnInit() {
  }

  actionButton(type) {
    this.outputEv.emit({type: 'alert_output', data: type});
  }

}
