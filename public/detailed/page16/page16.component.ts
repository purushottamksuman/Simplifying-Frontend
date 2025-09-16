import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page16',
  templateUrl: './page16.component.html',
  styleUrl: './page16.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page16Component {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
