import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page14',
  templateUrl: './page14.component.html',
  styleUrl: './page14.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page14Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;
  psychometricScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];
  highScores: string[] = [];
  lowScores: string[] = [];
  ngOnInit() {
    this.psychometricScore = Object.entries(
      this.detailedReport.detailedPsychometricScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort(
        (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
      );

      this.highScores= this.psychometricScore.filter((score) => score.scoreObject.categoryScoreLevel === 'High').map(x=>x.scoreObject.categoryDisplayText);
      this.highScores= this.psychometricScore.filter((score) => score.scoreObject.categoryScoreLevel === 'Low').map(x=>x.scoreObject.categoryDisplayText);
  }
}
