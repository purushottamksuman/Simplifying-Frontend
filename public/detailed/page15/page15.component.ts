import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DetailAssessmentResult, MappedResult } from '@ss/assessment';

@Component({
  selector: 'app-page15',
  templateUrl: './page15.component.html',
  styleUrl: './page15.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page15Component {
  @Input()
  detailedReport!: DetailAssessmentResult;

  @Input()
  careerMapping!: MappedResult;

  @Input()
  topAptiCategoryWiseScoresDisplay = '';
}
