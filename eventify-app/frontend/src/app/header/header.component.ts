import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Global } from '../global';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  user: any;
  notifications: String[] = [];

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(
    private global: Global,
    private router: Router,
    private http: HttpClient,
    )
    {
      this.notifications = [];
    }

  ngOnInit(): void {}

  init() {
    this.http.get<any>("https://" + environment.apiUrl + ":8080/user/notifications", { withCredentials: true })
    .subscribe((data: any) => {
      this.notifications = data;
    });
  }

  logout() {
    this.global.logout();
  }

  someMethod() {
    this.trigger.openMenu();
  }

  isLogged() {
    return this.global.isLogged;
  }

  reload() { window.location.reload(); }
}
