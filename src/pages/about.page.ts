import { Component } from '@angular/core';
import { RioContainer } from '../components';

@Component({
  selector: 'rio-about-page',
  template: `
    <rio-container [size]=4 [center]=true>
      <h2 class="caps">About Us</h2>
      <p>
        Stock strategy analysis research
      </p>
    </rio-container>
  `
})
export class RioAboutPage {}
