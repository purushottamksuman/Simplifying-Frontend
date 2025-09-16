import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page6',
  templateUrl: './page6.component.html',
  styleUrl: './page6.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page6Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;

  aptiCategoryWiseScores: { category: string; scoreObject: CategoryScore }[] =
    [];

  ngOnInit() {
    this.aptiCategoryWiseScores = Object.entries(
      this.detailedReport.aptitudeScore.categoryWiseScore
    ).map(([category, scoreObject]) => ({ category, scoreObject }));
  }
}
