import { User } from "./user";
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable()
export class Global {

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router
    ) {}
    user: User = new User();
    isLogged: boolean = false;
    categories: string[] = ["Music", "Sport", "Art", "Science", "Technology", "Hobby", "Outdoor activity", "Other"];

    logout() {
        this.user.clear();
        this.http.get<any>("https://" + environment.apiUrl + ":8080/user/logout", { withCredentials: true } )
        .subscribe((data: any) => {
            this.isLogged = false;
        });
    }

    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }
    
    formatDate(date: Date) {
        return [
            this.padTo2Digits(date.getDate()),
            this.getMonthName(date.getMonth()),
            date.getFullYear()
        ].join('-');
    }

    formatTime(time: Date) {
        return [
            this.padTo2Digits(time.getHours()),
            this.padTo2Digits(time.getMinutes())
        ].join(':');
    }

    formatDateTime(date: Date) {
        return this.formatDate(date) + ' ' + this.formatTime(date);
    }

    getMonthName(monthIndex: number): string {
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthIndex];
    }
}

