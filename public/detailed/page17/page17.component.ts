import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page17',
  templateUrl: './page17.component.html',
  styleUrl: './page17.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page17Component {
  @Input()
  detailedReport!: DetailAssessmentResult;
}