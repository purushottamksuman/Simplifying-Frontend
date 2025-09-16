import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page19',
  templateUrl: './page19.component.html',
  styleUrl: './page19.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page19Component  {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
