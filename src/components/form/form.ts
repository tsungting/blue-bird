import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { NgFormModel } from 'angular2/common';

@Component({
  selector: 'rio-form',
  template: `
    <form [ngFormModel]="formModel"
      (ngSubmit)="onSubmit.emit($event)">
      <ng-content></ng-content>
    </form>
  `
})
export class RioForm {
  @Input() formModel: NgFormModel;
  @Output() onSubmit = new EventEmitter<Event>();
};
