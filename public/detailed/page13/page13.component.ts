import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page13',
  templateUrl: './page13.component.html',
  styleUrl: './page13.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page13Component  {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
