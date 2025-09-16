import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page8',
  templateUrl: './page8.component.html',
  styleUrl: './page8.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Page8Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;
 interestAndPreferenceScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];
  ngOnInit() {
    this.interestAndPreferenceScore = Object.entries(
      this.detailedReport.interestAndPreferenceScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort(
        (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
      );
    }
}
