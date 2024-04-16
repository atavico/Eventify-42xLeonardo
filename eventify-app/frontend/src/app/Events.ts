import { User } from "./user";

export class Event {
    id: Number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
    category: string;
    owner: String;
    event_images: string[] = [];
    subscribers: string[] = [];
    //msgs: any;

    constructor(
        id: Number,
        title: string,
        description: string,
        location: string,
        start: Date,
        end: Date,
        category: string,
        owner: String,
        event_images: string[],
        subscribers: string[],
        //msgs: Array<any>
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.start = new Date (start);
        this.end = new Date (end);
        this.location = location;
        this.category = category;
        this.owner = owner;
        this.event_images = event_images;
        this.subscribers.push(...subscribers);
        //this.msgs = [];
    }

    setTitle(title: string) { this.title = title; }
    setDescription(description: string) { this.description = description; }
    setStart(start: Date) { this.start = start; }
    setEnd(end: Date) { this.end = end; }
    setLocation(location: string) { this.location = location; }
    setCategory(category: string) { this.category = category; }
    setOwner(owner: String) { this.owner = owner; }
    setImages(event_images: string[]) { this.event_images = event_images; }
    setsubscribe(subscribe: string[]) { this.subscribers = subscribe; }

    getTitle() { return this.title; }
    getDescription() { return this.description; }
    getStart() { return this.start; }
    getEnd() { return this.end; }
    getLocation() { return this.location; }
    getCategory() { return this.category; }
    getOwner() { return this.owner; }
    getImages() { return this.event_images; }
    getsubscribe() { return this.subscribers; }
    //getMsgs() { return this.msgs; }

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