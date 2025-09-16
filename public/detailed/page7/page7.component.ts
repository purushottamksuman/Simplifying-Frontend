import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page7',
  templateUrl: './page7.component.html',
  styleUrl: './page7.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page7Component {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
