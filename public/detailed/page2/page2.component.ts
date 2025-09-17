import { Component, Input } from '@angular/core';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrl: './page2.component.scss',
})
export class Page2Component {

  @Input()
  detailedReport!: DetailAssessmentResult;
}
