import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../Events';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Global } from '../global';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { CarouselComponent } from '../carousel/carousel.component';


@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})

export class EventPageComponent {

  event: Event;
  name: string;
  email: string;
  pic_array: string[] = [];
  chat:boolean = false;
  msgs: string[] = [];
  chat_map: string[] = [];
  interval_id: Number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private global: Global,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    //private ms: MessagingService
    ) {}

  ngOnInit() {
    if (this.global.isLogged === false)  {
      this.authService.retrieveInfo("");
    }
    this.email = this.global.user.getEmail();
    this.activatedRoute.queryParams.subscribe((data: any) => {
    this.http.get<Event>("https://" + environment.apiUrl + ":8080/event/get/" + data['id'])
    .subscribe((data: Event) => {
      if (data == null) {
        this.router.navigate(['/admin']);
      }
      this.event = new Event (
        data.id,
        data.title,
        data.description,
        data.location,
        data.start,
        data.end,
        data.category,
        data.owner,
        data.event_images == null ? [] : data.event_images,
        data.subscribers == null ? [] : data.subscribers,
        );
        if (this.event.event_images.length > 0) {
          for (let i = 0; i < this.event.event_images.length; i++) {
            this.pic_array.push("https://" + environment.apiUrl + ":8080/uploads/event_images/" + this.event.id + "/" + this.event.event_images[i]);
          }
        }
      });
    });
    this.name = this.global.user.getName();
    this.interval_id = setInterval(() => {
    this.getMsgs();
    }, 3000);
  }
  ngOnDestroy() {
    clearInterval(this.interval_id as number);
  }

  eventLoaded() {
    if (this.event == null) {
      return false;
    }
    return true;
  }

  subscribe() {
    this.email = this.global.user.getEmail();
    const event: Event = this.event;
    this.http.put<boolean>("https://" + environment.apiUrl + ":8080/event/join/" + event.id, null, { withCredentials: true })
    .subscribe((res: any) => {
      if (res) {
        event.subscribers.push(this.email);
      }
    });
  }

  unsubscribe() {
    this.email = this.global.user.getEmail();
    const event: Event = this.event;
    this.http.put<Boolean>("https://" + environment.apiUrl + ":8080/event/leave/" + event.id, null, { withCredentials: true })
    .subscribe((res: any) => {
      if (res) {
        event.subscribers.splice(event.subscribers.indexOf(this.email), 1);
      }
    });
  }

  getMsgs() {
    this.http.get<string[]>("https://" + environment.apiUrl + ":8080/event/get_msg/" + this.event.id, { withCredentials: true })
    .subscribe((res: any) => {
      if (!res) {
        return;
      }
      this.chat_map = [];
      res.forEach((msg: string) => {
        let str = msg.split("\"");
        this.chat_map.push(str[3]);
      });
    });
  }

  ismyMessage(message: string) {
    if (message.split(":")[0] === this.event.owner) {
      return true;
    }
    return false;
  }

  openChat() {
    this.chat = true;
    this.getMsgs();
  }
  closeChat() {
    this.chat = false;
  }
  sendMsg() {
    const msg = this.global.user.getEmail() + ": " + (<HTMLInputElement>document.getElementById("message")).value;
    const body = { message: msg };
    this.http.post<string>("https://" + environment.apiUrl + ":8080/event/push_msg/" + this.event.id, body, { withCredentials: true })
    .subscribe((res: any) => {
    });
  }
  //ismyMessage(msg:) {
  //  if (msg.user == this.email)
  //      return(true);
  //  return(false);
  //}

  display: any;
    center: google.maps.LatLngLiteral = {
        lat: 22.2736308,
        lng: 70.7512555
    };
    zoom = 6;
  
    /*------------------------------------------
    --------------------------------------------
    moveMap()
    --------------------------------------------
    --------------------------------------------*/
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
  
    /*------------------------------------------
    --------------------------------------------
    move()
    --------------------------------------------
    --------------------------------------------*/
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }
}
