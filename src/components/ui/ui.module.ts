import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RioAlert} from '../alert/alert.component';
import {RioButton} from '../button/button.component';
import {RioLogo} from '../logo/logo.component';
import {RioContainer} from '../container/container.component';
import {BbLabel} from '../labels/label.component';
import {BbEvolutionLog} from '../evolution-log/index';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RioAlert,
    RioButton,
    RioLogo,
    RioContainer,
    BbLabel,
    BbEvolutionLog
  ],
  exports: [
    RioAlert,
    RioButton,
    RioLogo,
    RioContainer,
    BbLabel,
    BbEvolutionLog
  ]
})
export class RioUiModule { }
