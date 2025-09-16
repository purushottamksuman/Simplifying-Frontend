import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page10',
  templateUrl: './page10.component.html',
  styleUrl: './page10.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page10Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;
  seiScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];

  ngOnInit() {
    this.seiScore = Object.entries(
      this.detailedReport.seiScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort(
        (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
      );
  }
}
