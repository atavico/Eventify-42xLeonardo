import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import { User } from "./user";
import { Event } from "./Events";
import { catchError, throwError } from "rxjs";
import { Global } from "./global";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    constructor(
        private http: HttpClient,
        private global: Global,
        private router: Router
        ) {}

    signup(name: string, lastname: string, email:string, psw: string, date: String) {
        const obj: Object = {
            firstname: name,
            lastname: lastname,
            email: email,
            password: psw,
            profile_picture: false,
            date_of_birth: date,
        }
        return this.http.post<string>(
            "https://" + environment.apiUrl + ":8080/user/add",
            obj,
            { withCredentials: true, responseType: 'text' as 'json' })
            .pipe(catchError(this.handleError));
    }

    oauth2callback(code: string) {
        return this.http.post<any>(
            'https://oauth2.googleapis.com/token',
            {
                "code": code,"client_id": process.env.GOOGLE_CLIENT_ID,
                "client_secret": process.env.GOOGLE_CLIENT_SECRET,
                "redirect_uri": `https://localhost:4200/signup`,
                "grant_type": "authorization_code",
            }
        ).pipe(catchError(this.handleError));
    }
    
    verifyToken(token: string) {
        const headers = { 'Authorization': 'Bearer ' + token};
        return this.http.get<any>(
            "https://openidconnect.googleapis.com/v1/userinfo",
            { headers }
        ).pipe(catchError(this.handleError));
    }

    oauthSignup(obj: Object) {
        return this.http.post<string>(
            "https://" + environment.apiUrl + ":8080/user/oauth/add",
            obj,
            { withCredentials: true, responseType: 'text' as 'json' }
        ).pipe(catchError(this.handleError));
    }

    login(email: string | null | undefined, password: string | null | undefined) {
        return this.http.post<JSON>(
                "https://" + environment.apiUrl + ":8080/user/login",
                {
                    email: email,
                    password: password
                },
                { withCredentials: true, responseType: 'text' as 'json' }
            )
            .pipe(catchError(this.handleError));
    }

    createEvent(event: Object) {
        const token = this.global.user.getToken();
        return this.http.post<any> (
            "https://" + environment.apiUrl + ":8080/event/create",
            event,
            { withCredentials: true, responseType: 'text' as 'json' }
        ).pipe(catchError(this.handleError));
    }

    editEvent(event: Object, id: Number) {
        return this.http.post<any> (
            "https://" + environment.apiUrl + ":8080/event/update/" + id,
            event,
            { withCredentials: true }
        ).pipe(catchError(this.handleError));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknow error occured!';
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage: 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage: 'Password is not correct';
                break;
            }
        return throwError(errorMessage);
    }

    retrieveInfo(yes: string) {
        this.http.get<any>("https://" + environment.apiUrl + ":8080/user/getInfo", { withCredentials: true } )
        .subscribe((data: any) => {
            if (data) {
              this.global.user.setFirstname(data.firstname);
              this.global.user.setLastname(data.lastname);
              this.global.user.setEmail(data.email);
              this.global.user.setPassword(data.password);
              this.global.user.setProfilePicture(data.profile_picture);
              this.global.user.setDateOfBirth(data.date_of_birth);
              this.global.user.setNotifications(data.notifications);
              this.global.isLogged = true;
              if (yes != "") {
                  this.router.navigate([yes]);
              }
            } else {
                this.router.navigate(["/"]);
            }
        });
    }

}