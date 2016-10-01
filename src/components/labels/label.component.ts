import { Component, Input} from '@angular/core';

@Component({
  selector: 'bb-label',
  template: `
    <div class="inline-block">
      <label class="block h5 caps bold">{{title}}</label>
      <span>{{content}}</span>
    </div>
  `
})
export class BbLabel {
  @Input() title = '';
  @Input() content = '';

  ngOnInit() {
    if (this.isFloat(this.content)) {
      this.content = Number(this.content).toFixed(2);
    }
  }

  private isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
}
;

