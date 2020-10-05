import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-date-of-birth',
  templateUrl: './date-of-birth.component.html',
  styleUrls: ['./date-of-birth.component.scss']
})
export class DateOfBirthComponent implements OnInit, OnChanges {


  @Input() datetype: string;
  @Input() requiredvalid: string; // For checking validation
  @Input() controlTouched: boolean;
  @Input() dobInput: Date; // For dispaly date in parent component
  @Input() style: any;
  @Input() ageInput: any;
  @Input() ageLimit: number;

  @Output() childEvent = new EventEmitter();
  @Output() validation = new EventEmitter();
  @Output() ageEvent = new EventEmitter();

  isDateValid = true;
  newDate: any;
  selectedYear: any;
  selectedMonth: any;
  selectedDay: any;
  isLeapYear: boolean;
  validdate: any;
  isAgeValid = true;
  Years: any = [];
  Months: any = [];
  Days: any = [];

  constructor() {
    this.Months = [
      { id: 1, monthname: 'January', day: 31 },
      { id: 2, monthname: 'February', day: 29 },
      { id: 3, monthname: 'March', day: 31 },
      { id: 4, monthname: 'April', day: 30 },
      { id: 5, monthname: 'May', day: 31 },
      { id: 6, monthname: 'June', day: 30 },
      { id: 7, monthname: 'July', day: 31 },
      { id: 8, monthname: 'August', day: 31 },
      { id: 9, monthname: 'September', day: 30 },
      { id: 10, monthname: 'October', day: 31 },
      { id: 11, monthname: 'November', day: 30 },
      { id: 12, monthname: 'December', day: 31 }
    ];
  }

  ngOnInit() {
    this.getYear();
    if (this.datetype === 'dateOfBirth' && this.dobInput != null) {
      const oldDob = new Date(this.dobInput);
      const month = oldDob.getMonth() + 1;

      this.Months.forEach(element => {
        if (element.id === month) {
          this.selectedMonth = element;
          this.onMonthChange(event);
        }

      });

      this.selectedYear = (oldDob.getFullYear()).toString();

      this.selectedDay = (oldDob.getDate()).toString();
      this.checkValidation();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const inputkey in changes) {
      if (inputkey === 'controlTouched') {
        const change = changes[inputkey];
        if (!change.currentValue) {
          this.checkValidation();
        }

      }
    }
  }

  /**
   * @description get Year
   */
  getYear() {
    const currentyear = new Date();
    const year = currentyear.getFullYear();
    for (let i = 1901; i <= year; i++) {
      this.Years.push(i.toString());
    }

    this.Years.reverse();
  }

  /**
   * @description on year changed.
   */
  changeYear(event) {
    // check if month and day is not selected then set manually.
    if (this.selectedYear && !this.selectedMonth && !this.selectedDay) {
      this.selectedMonth = this.Months[0]; // [AC] Set it to the first month in our collection.
      this.selectedDay = '1'; // [AC] Since everything is empty, set the selected day to first day of the month
    }
    // check selected year is leap year.
    if (((this.selectedYear % 4 === 0) && (this.selectedYear % 100 !== 0)) || this.selectedYear % 400 === 0) {
      this.isLeapYear = true;
      if (this.selectedMonth != null) {
        if (this.isLeapYear === true && this.selectedMonth.monthname === 'February') {
          this.getDay(this.selectedMonth.day = 29);
        }
        if (this.selectedMonth.monthname !== 'February') {
          this.getDay(this.selectedMonth.day);
        }
      }
    } else {
      this.isLeapYear = false;
      if (this.selectedMonth !== null) {
        if (this.isLeapYear === false && this.selectedMonth.monthname === 'February') {
          this.getDay(this.selectedMonth.day = 28);
        }
        if (this.selectedMonth.monthname !== 'February') {
          this.getDay(this.selectedMonth.day);
        }
      }
    }
    this.checkValidation();
  }

  /**
   * @description on Month Change.
   */
  onMonthChange(event) {
    // check selected year is leap year or not.
    if (this.isLeapYear === true && this.selectedMonth.monthname === 'February') {
      this.getDay(this.selectedMonth.day = 29);
    } else if (this.isLeapYear === false && this.selectedMonth.monthname === 'February') {
      this.getDay(this.selectedMonth.day = 28);
    }

    if (this.selectedMonth.monthname !== 'February') {
      this.getDay(this.selectedMonth.day);
    }
    this.checkValidation();
  }

  /**
   * @description get Days.
   * @param day calculate Days.
   */
  getDay(day) {
    this.Days = [];
    for (let i = 1; i <= day; i++) {
      this.Days.push(i.toString());
    }
  }

  /**
   * @description on Day change.
   */
  onDayChange() {
    this.checkValidation();
  }

  checkValidation() {
    this.newDate = new Date();
    const newdate = this.newDate;
    const currentyear = this.newDate.getFullYear();
    const currentmonth = this.newDate.getMonth() + 1;
    const currentday = this.newDate.getDate();
    let validage = currentyear;
    if (this.ageLimit > 0) {
      validage = currentyear - this.ageLimit;
    }
    this.validdate = new Date(validage + '/' + currentmonth + '/' + currentday);

    if (this.selectedYear && this.selectedMonth && this.selectedDay) {
      const selectdate = new Date(this.selectedYear + '/' + this.selectedMonth.id + '/' + this.selectedDay);
      if (this.datetype === 'dateOfBirth') {
        if (newdate >= selectdate) {
          if (this.validdate >= selectdate) {
            this.childEvent.emit(selectdate);
            if (this.requiredvalid === 'true') {
              this.validation.emit(this.isDateValid = true);
              this.validation.emit(this.isAgeValid = true);
            } else if (this.requiredvalid === '') {
              this.validation.emit(this.isDateValid = true);
              this.calculateAge(event);
            }
          } else {
            this.childEvent.emit(selectdate);
            if (this.requiredvalid === 'true') {
              this.validation.emit(this.isDateValid = true);
              this.validation.emit(this.isAgeValid = false);
            } else if (this.requiredvalid === '') {
              this.validation.emit(this.isDateValid = true);
              this.calculateAge(event);
            }
          }
        } else {
          if (this.requiredvalid === 'true') {
            this.validation.emit(this.isDateValid = false);
          } else if (this.requiredvalid === '') {
            this.validation.emit(this.isDateValid = false);
          }
        }
      }
    } else {
      if (this.requiredvalid === 'true') {
        this.validation.emit(this.isDateValid = false);
        // this.validation.emit(this.isAgeValid = false);
      }
    }
  }

  /**
   * @description set style to select Box.
   */
  selectBox() {
    if (this.style) {
      return this.style;
    }
  }

  /**
   * @description calculate Age on the basis of selected date.
   */
  calculateAge(event) {
    if (this.selectedYear && this.selectedMonth && this.selectedDay) {
      this.newDate = new Date();
      const currentyear = this.newDate.getFullYear();
      if (currentyear >= this.selectedYear) {
        const age = currentyear - this.selectedYear;
        this.ageEvent.emit(age);
      }
    }
  }
}
