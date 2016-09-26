import { Component } from '@angular/core';

@Component({
  selector: 'rio-logo',
  styles: [require('./logo.css')],
  template: `
    <div class="flex items-center">
      <span class="h4 caps blue">(\\Blue Bird/) </span>
    </div>
  `
})
export class RioLogo {
  private LogoImage = require('../../assets/rangleio-logo.svg');
};
