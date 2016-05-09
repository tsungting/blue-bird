import {
  async,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder }
from '@angular/compiler/testing';
import { RioLogo } from './index';

describe('Component: Logo', () => {

  it('should set the image location',
    async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.createAsync(RioLogo)
        .then((fixture: ComponentFixture<any>) => {
          fixture.componentInstance.LogoImage = 'test_location';
          fixture.detectChanges();
          let compiled = fixture.debugElement.nativeElement;
          expect(compiled.querySelector('img').getAttribute('src'))
            .toBe('test_location');
        });
    })));
});
