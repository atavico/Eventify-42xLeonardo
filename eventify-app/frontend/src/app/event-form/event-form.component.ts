import {  Component,
          OnInit,
          Input
        } from '@angular/core';
import {  FormGroup,
          FormsModule,
          FormControl,
          Validators
        } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';
import { Global } from '../global';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { Event } from '../Events';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true, 
  imports: [
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressBarModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    CommonModule
  ]
})

export class EventFormComponent implements OnInit{

  @Input()
  requiredFileType: string;

  @Input()
  event: Event | null = null;

  fileName = '';
  uploadProgress:number;
  uploadSub: Subscription | null = null;
  public color: ThemePalette = 'primary';
  categories: string[] = this.global.categories;
  isEdit = false;
  defaultStart = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]
  defaultEnd = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1];

  eventForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required)
  });

  minDate = new Date();

  constructor(
    private FB: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private global: Global,
    private http: HttpClient
    ) {}
  

  ngOnInit() {
    this.authService.retrieveInfo("");
    if (this.event) {
      this.eventForm.get('title')?.setValue(this.event.title);
      this.eventForm.get('description')?.setValue(this.event.description);
      this.eventForm.get('start')?.setValue(this.event.start.toString());
      this.eventForm.get('end')?.setValue(this.event.end.toString());
      this.eventForm.get('location')?.setValue(this.event.location);
      this.eventForm.get('category')?.setValue(this.event.category);
      this.isEdit = true;
      this.defaultStart = [new Date(this.event.start).getFullYear(), new Date(this.event.start).getMonth(), new Date(this.event.start).getDate()];
      this.defaultEnd = [new Date(this.event.end).getFullYear(), new Date(this.event.end).getMonth(), new Date(this.event.end).getDate()];
    }
  }

  newEvent() {
    if (this.eventForm.get('start') && this.eventForm.get('end')) {
      if (this.eventForm.get('start')?.value! > this.eventForm.get('end')?.value!) {
        alert('Start date must be before end date');
        return ;
      }
    }
    if (this.eventForm.get('start')) {
      const formDate = new Date(this.eventForm.get('start')?.value!);
      const today = new Date();
      if (formDate.getTime() < today.getTime()) {
        alert('Start date must be after current date');
        return ;
      }
    }
    const title = this.eventForm.get('title')?.value;
    const description = this.eventForm.get('description')?.value;
    const start = this.eventForm.get('start')?.value;
    const end = this.eventForm.get('end')?.value;
    const images = this.upload_img;
    const location = this.eventForm.get('location')?.value;
    const category = this.eventForm.get('category')?.value;
    const event: Object = {
      title: title,
      description: description!,
      location: location!,
      start: this.global.formatDateTime(new Date(start!)),
      end: this.global.formatDateTime(new Date(end!)),
      category: category!,
      owner: this.global.user.getEmail(),
      event_images: images,
      subscribe: []
    }
    if (this.isEdit) {
      this.authService.editEvent(event, this.event!.id)
      .subscribe(
        (resData: Event) => {
          if (resData) {
            window.location.reload();
          }
        })
      return ;
    } else {
      this.authService.createEvent(event)
      .subscribe(
        (resData: Event) => {
          if (resData) {
            this.router.navigate(['/admin']);
          }
        })
      }
    }

  upload_img: string[] = [];

  onFileSelected(event: any) {
    // const fileInput = (event?.target as HTMLInputElement) || null;
    const file: File = event.target.files[0];
    
    if (file) {
        this.fileName = file.name;

        if(!this.upload_img.includes(this.fileName)) {
          this.upload_img.push(this.fileName);

        const formData = new FormData();
        formData.append("files", file);

        const upload$ = this.http.post<any>("https://" + environment.apiUrl + ":8080/event/upload/images", formData, {
            reportProgress: true,
            observe: 'events',
            withCredentials: true
        })
        .pipe(
            finalize(() => {
              this.reset();
            })
        );
      
        this.uploadSub = upload$.subscribe((event: HttpEvent<FormData>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          }
        });
    
      }
    }
  }

  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.uploadSub = null;
  }

  removeUpload(img : string) {
    this.http.delete<any>("https://" + environment.apiUrl + ":8080/event/delete/images/tmp/" + img, { withCredentials: true })
    .subscribe((res: any) => {
      if (!res) {
        alert('Error while deleting image');
      }
    });
    this.upload_img.splice(this.upload_img.indexOf(img), 1);
  }

}
