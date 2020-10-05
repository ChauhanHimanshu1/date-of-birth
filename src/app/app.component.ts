import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() { }

  public date = new Date();

  public isDateValid = false;
  public isDateTouched = false;
  public selectedDate: any;

  submit() {
    console.log(this.selectedDate);
  }
}
