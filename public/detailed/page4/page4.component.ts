import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page4',
  templateUrl: './page4.component.html',
  styleUrl: './page4.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page4Component  {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
