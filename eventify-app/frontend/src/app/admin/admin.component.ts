import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DateRange, DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY, MatCalendar,
} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { Global } from '../global';
import { HttpClient } from '@angular/common/http';
import { Event } from '../Events';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [  
              NgxMatDatetimePickerModule,
              NgxMatTimepickerModule,
              NgxMatNativeDateModule,
              MatButtonModule,
              MatMenuModule,
              MatFormFieldModule,
              MatSelectModule,
              NgFor,
              MatInputModule,
              FormsModule,
              CommonModule,
              MatFormFieldModule,
              MatDatepickerModule,
              MatNativeDateModule,
              MatIconModule,
              ReactiveFormsModule,
            ],
  providers:[{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: DefaultMatCalendarRangeStrategy
  }]
})

export class AdminComponent implements OnInit{

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  filterForm = new FormGroup({
    keywords: new FormControl(''),
    start: new FormControl(''),
    end: new FormControl(''),
    location: new FormControl(''),
    category: new FormControl([])
  });

  category = new FormControl('');
  categoryList: string[] = this.global.categories;

  name: string = this.global.user.getName();
  events_array: Event[] = [];
  toDisplay: Event[] = [];
  voidList: boolean = true;
  filterWin: boolean = false;
  filterMy: boolean = false;
  isHovered: boolean = false;
  isFunctionEnable: boolean = true;
  startDate: Date;
  endDate: Date;
  maxDate: Date;
  email: string;
  currentEvent: Event;

  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private global: Global,
    private http: HttpClient,
    private authService: AuthService,
    ) {
    }

  ngOnInit() {
    if (this.global.isLogged === false) {
      this.authService.retrieveInfo("");
    }
    this.getEvents().subscribe((res: any) => {
      res.forEach((element: any) => {
        let event = new Event (
          element.id,
          element.title,
          element.description,
          element.location,
          new Date(element.start),
          new Date(element.end),
          element.category,
          element.owner,
          element.images == null ? [] : element.images,
          element.subscribers == null ? [] : element.subscribers
        );
        this.events_array.push(event);
      });
      this.toDisplay = this.events_array;
      if (this.events_array.length > 0) {
        this.voidList = false;
      }
    });
  }

  init() {
    this.email = this.global.user.getEmail();
    this.name = this.global.user.getName();
    if (this.global.isLogged === false) {
      this.router.navigate(["/"]);
    }
  }
  
  NewEvents() {
    this.router.navigate(['/eventForm'], {relativeTo: this.route});
  }
  
  getEvents() {
    return this.http.get<Event[]>("https://" + environment.apiUrl + ":8080/event/all/ordered");
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  }

  openFilter() {
    if (this.filterWin) {
      this.filterWin = false;
    } else {
      this.filterWin = true;
    }

  }

  subscribe(event: Event) {
    this.email = this.global.user.getEmail();
    this.http.get<Boolean>("https://" + environment.apiUrl + ":8080/event/join/" + event.id, { withCredentials: true })
    .subscribe((res: any) => {
      if (res) {
        event.subscribers.push(this.email);
      }
    });
    this.authService.retrieveInfo("");
  }

  unsubscribe(event: Event) {
    this.email = this.global.user.getEmail();
    this.http.get<Boolean>("https://" + environment.apiUrl + ":8080/event/leave/" + event.id, {withCredentials: true})
    .subscribe((res: any) => {
      if (res) {
        event.subscribers.splice(event.subscribers.indexOf(this.email), 1);
      }
    });
    this.authService.retrieveInfo("");
  }

  includeCategory(filter: string[], categories: string[]) {
    for (let i = 0; i < filter.length; i++) {
      if (categories.includes(filter[i])) {
        return true;
      }
    }
    return false;
  }
  
  filterEvents() {
    let keyword: string = '';
    let location: string = '';
    let start: Date;
    let end: Date;
    let categories: string[] = [];
    if (this.filterForm.value.keywords != null && this.filterForm.value.keywords != '') {
      keyword = this.filterForm.value.keywords;
    }
    if (this.filterForm.value.location != null && this.filterForm.value.location != '') {
      location = this.filterForm.value.location;
    }
    if (this.filterForm.value.category != null && this.filterForm.value.category.length > 0) {
      categories = this.filterForm.value.category;
    }
    this.toDisplay = [];
    if (this.filterForm.value.start != null && this.filterForm.value.end != null) {
      start = new Date(this.filterForm.value.start!);
    }
    if (this.filterForm.value.end != null && this.filterForm.value.end != null) {
      end = new Date(this.filterForm.value.end!);
    }
    this.events_array.some(element => {
      if ((keyword.length == 0 || element.title.includes(keyword)) &&
      (location.length == 0 || element.location.includes(location)) &&
      (categories.length == 0 || categories.includes(element.category)) &&
      ((this.filterForm.value.start == '' || start >= element.start) &&
      (this.filterForm.value.end == '' || end <= element.end))) {
        this.toDisplay.push(element);
      }
    });
  }

  showAllEvents() {
    this.toDisplay = this.events_array;
    this.filterMy = false;
  }

  filterMyEvents() {
    this.toDisplay = [];
    this.events_array.some(element => {
      if (element.subscribers.includes(this.email))
        this.toDisplay.push(element);
    });
    this.filterMy = true;
  }

  toEventPage(event: Event) {
    if (this.isFunctionEnable === false) {
      return;
    } else {
      this.router.navigate(['/Event-page'], { queryParams: { id: event.id }});
    }
  }

  subscribers: String[] = [];

  getSubscribers(event: Event) {
    return event.subscribers;
  }
  
  openMenutrigger() {
    this.trigger.openMenu();
  }

  onMouseEnterShadow() { this.isHovered = true; }
  onMouseLeaveShadow() { this.isHovered = false; }
  onMouseEnter() { this.isFunctionEnable = false; }
  onMouseLeave() { this.isFunctionEnable = true; }
  releaseBool() { this.isFunctionEnable = true; }
}
