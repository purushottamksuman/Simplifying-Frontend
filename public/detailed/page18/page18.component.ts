import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page18',
  templateUrl: './page18.component.html',
  styleUrl: './page18.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page18Component  {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
