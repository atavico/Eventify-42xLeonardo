import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Global } from '../global';
import { OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../user';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  constructor(
    private global: Global,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    ) {}

  ngOnInit(): void {
    this.http.get<any>("https://" + environment.apiUrl + ":8080/user/getInfo", { withCredentials: true } )
        .subscribe((data: any) => {
            if (data) {
              this.global.user.setFirstname(data.firstname);
              this.global.user.setLastname(data.lastname);
              this.global.user.setEmail(data.email);
              this.global.user.setPassword(data.password);
              this.global.user.setProfilePicture(data.profile_picture);
              this.global.user.setDateOfBirth(data.date_of_birth);
              this.global.isLogged = true;
              this.router.navigate(["/admin"]);
            }
        });
  }

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
