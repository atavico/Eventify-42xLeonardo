import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class User {
    private firstname: string;
    private lastname: string;
    private email: string;
    private password: string;
    private profile_picture: boolean;
    private date_of_birth: Date;
    private token: string;
    private notifications: string[];
    private http: HttpClient

    constructor() {
        this.firstname = '';
        this.lastname = '';
        this.email = '';
        this.profile_picture = false;
        this.date_of_birth = new Date(Date.now());
        this.token = '';
    }

    // Getters and setters
    setFirstname(firstname: string) { this.firstname = firstname; }
    setLastname(lastname: string) { this.lastname = lastname; }
    setEmail(email: string) { this.email = email; }
    setPassword(password: string) { this.password = password; }
    setProfilePicture(profile_picture: boolean) { this.profile_picture = profile_picture; }
    setDateOfBirth(date_of_birth: Date) { this.date_of_birth = date_of_birth; }
    setToken(token: string) { this.token = token; }
    setNotifications(notifications: string[]) { this.notifications = notifications; }

    getName() { return this.firstname; }
    getLastname() { return this.lastname; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getProfilePicture() { return this.profile_picture; }
    getDateOfBirth() { return this.date_of_birth; }
    getToken() { return this.token; }
    getNotifications() { return this.notifications; }

    // toString
    toString() {
        return 'user: ' + this.firstname + ' ' + this.lastname + ' ' + this.email + ' ' + this.password + ' ' + this.profile_picture + ' ' + this.date_of_birth + ' ' + this.token;
    }

    toJson() {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            profile_picture: this.profile_picture,
            date_of_birth: this.date_of_birth,
            token: this.token
        }
    }

    isEmpty() {
        return this.firstname === '' && this.lastname === '' && this.email === '' && this.password === '' && this.profile_picture === false &&  this.token === '';
    }

    clear() {
        this.firstname = '';
        this.lastname = '';
        this.email = '';
        this.password = '';
        this.profile_picture = false;
        this.date_of_birth = new Date(0);
        ;
        this.token = '';
    }

    getInfo(token: String) {
        this.http.get<any>(`https://" + environment.apiUrl + ":8080/user/getInfo/` + token)
        .subscribe((res: any )=> {
        });
    }

    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    getMonthName(monthIndex: number): string {
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthIndex];
    }

    formatDate(date: Date) {
        return [
            this.padTo2Digits(date.getDate()),
            date.getMonth() + 1,
            date.getFullYear()
        ].join('-');
    }
}
