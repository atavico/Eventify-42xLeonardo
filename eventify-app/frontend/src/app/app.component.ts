import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CookieService } from 'ngx-cookie-service';
import { Global } from './global';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  constructor(
    public breakpointObserver: BreakpointObserver,
    ) {}
  
  title = 'front_end';

  ngOnInit(){
    this.breakpointObserver
      .observe(['']); 
  }

}
