import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page12',
  templateUrl: './page12.component.html',
  styleUrl: './page12.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page12Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;
  aqScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];

  ngOnInit() {
    this.aqScore = Object.entries(
      this.detailedReport.adversityScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }));
  }
}
