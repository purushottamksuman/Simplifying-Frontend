import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page11',
  templateUrl: './page11.component.html',
  styleUrl: './page11.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page11Component  {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
