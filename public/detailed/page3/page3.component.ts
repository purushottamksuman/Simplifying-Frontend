import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.component.html',
  styleUrl: './page3.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page3Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;

  aptiCategoryWiseScores: { category: string; scoreObject: CategoryScore }[] =
    [];
  interestAndPreferenceScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];
  seiScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];

  psychometricScore: {
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

    this.aptiCategoryWiseScores = Object.entries(
      this.detailedReport.aptitudeScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({
        category,
        scoreObject,
      }))
      .sort(
        (a, b) =>
          b.scoreObject.categoryPercentage - a.scoreObject.categoryPercentage
      );

    this.seiScore = Object.entries(
      this.detailedReport.seiScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort(
        (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
      );

      this.psychometricScore = Object.entries(
        this.detailedReport.detailedPsychometricScore.categoryWiseScore
      )
        .map(([category, scoreObject]) => ({ category, scoreObject }))
        .sort(
          (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
        );
  }
}
