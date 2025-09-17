import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page5',
  templateUrl: './page5.component.html',
  styleUrl: './page5.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page5Component  {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
