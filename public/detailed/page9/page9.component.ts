import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page9',
  templateUrl: './page9.component.html',
  styleUrl: './page9.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page9Component {
  @Input()
  detailedReport!: DetailAssessmentResult;
}
