import { Component } from '@angular/core';
import { Global } from '../global';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../user';
import { Event } from '../Events';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { NgxMatDatetimePickerModule, 
         NgxMatTimepickerModule, 
         NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMatDatetimePickerModule,
    NgFor,
    EventFormComponent
  ]
})

export class AccountComponent implements OnInit{
  slides = [ {} ]

  user: User;
  events_array: Event[] = [];
  isHovered: boolean = false;
  isFunctionEnable: boolean = true;
  pic_url: string = "";
  event: Event;

  eventForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required)
  });

  constructor(
    private global: Global,
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ) {
      this.user = new User();
    }
  
  
  ngOnInit(): void {
    this.authService.retrieveInfo("");
    this.getOwnEvents();
    this.user = this.global.user;
  }

  getFirstLetterOfName() {
    const name = this.global.user.getName();
    if (name) {
      return name.charAt(0); // Restituisce la prima lettera della stringa
    } else {
      return ''; // Restituisce una stringa vuota se name è vuoto o undefined
    }
  }

  getProfilePicture() {
    this.pic_url = "https://localhost:8080/uploads/profile_pictures/" + this.user.getEmail() + ".png";
    if (this.global.user.getProfilePicture() === true) {
      return true;
    } else {
      return false;
    }
  }

  getOwnEvents() {
    return this.http.get<Event[]>("https://" + environment.apiUrl + ":8080/event/owner", { withCredentials: true })
    .subscribe((res: any) => {
      if (!res) {
        return;
      }
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
          element.subscribe == null ? [] : element.subscribe
        );
        this.events_array.push(event);
      });
    });
  }

  toEventPage(event: Event) {
    if (this.isFunctionEnable === false) {
      return;
    } else {
      this.router.navigate(['/Event-page'], { queryParams: { id: event.id }});
    }
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  }

  showEdit: boolean = false;

  editEvent(event: Event) {
    this.event = event;
    if (this.showEdit === false) {
      this.showEdit = true;
    } else {
      this.showEdit = false;
    }
  }

  onMouseEnterShadow() { this.isHovered = true; }
  onMouseLeaveShadow() { this.isHovered = false; }
  onMouseEnter() { this.isFunctionEnable = false; }
  onMouseLeave() { this.isFunctionEnable = true; }

  upload_img: string[] = [];
  fileName: string = '';
  uploadProgress: number = 0;
  uploadSub: Subscription | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("file", file);

        const upload$ = this.http.post<any>("https://" + environment.apiUrl + ":8080/user/profile_picture", formData, {
            reportProgress: true,
            observe: 'events',
            withCredentials: true
        })
        .pipe(
            finalize(() => this.reset())
        );
      
        this.uploadSub = upload$.subscribe((event: HttpEvent<FormData>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            this.upload_img.push(this.fileName);
            window.location.reload();
          }
        })
    }
  }

  reset() {
    this.uploadProgress = 0;
    this.uploadSub = null;
  }

}
