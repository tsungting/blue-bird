import { Component, Input} from '@angular/core';

@Component({
  selector: 'bb-label',
  template: `
    <div className="flex">
      <label class="block h5 caps bold">{{title}}</label>
      <span>{{content}}</span>
    </div>
  `
})
export class BbLabel {
  @Input() title = '';
  @Input() content = '';
};

