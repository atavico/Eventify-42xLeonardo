package app.backend.backend.model;
import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "\"user\"")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "firstname", nullable = false, length = 200)
    private String firstname;
    @Column(name = "password", nullable = true, length = 200)
    private String password;
    @Column(name = "lastname", nullable = true, length = 200)
    private String lastname;
    @Column(name = "email", nullable = false, length = 200, unique = true)
    private String email;
    @Column(name = "profile_picture", nullable = true)
    private Boolean profile_picture;
    @Column(name = "date_of_birth", nullable = true, length = 200)
    @JsonFormat(pattern = "dd-MMM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDate date_of_birth;
    @Column(name = "events", nullable = true, length = 1000)
    private List<String> events;
    @Column(name = "is_online", nullable = false)
    private Boolean is_online = false;
    @Column(name = "notifications", nullable = true)
    private List<String> notifications;
    @Column(name = "events_to_notify", nullable = true)
    private List<Long> events_to_notify;
    @Column(name = "friends", nullable = true)
    private List<String> friends;
    @Column(name = "is_oauth", nullable = false)
    private Boolean is_oauth = false;

    public User() {}

    public User(
        String firstname,
        String password,
        String lastname,
        String email,
        Boolean profile_picture,
        LocalDate date_of_birth
        ) {
        this.firstname = firstname;
        this.password = password;
        this.lastname = lastname;
        this.email = email;
        this.profile_picture = profile_picture;
        this.date_of_birth = date_of_birth;
        this.friends = new ArrayList<String>();
        this.events = new ArrayList<String>();
        this.notifications = new ArrayList<String>();
    }

    // Getters
    public Long getId() { return this.id;  }
    public String getFirstname() { return this.firstname; }
    public String getPassword() { return this.password; }
    public String getLastname() { return this.lastname; }
    public String getEmail() { return this.email; }
    public Boolean getProfilePicture() { return this.profile_picture; }
    public LocalDate getDateOfBirth() { return this.date_of_birth; }
    public Boolean isOnline() { return this.is_online; }
    public List<String> getNotifications() { return this.notifications; }
    public List<String> getFriends() { return this.friends; }
    public List<String> getEvents() { return this.events; }
    public Boolean isOauth() { return this.is_oauth; }
    public List<Long> getEventsToNotify() { return this.events_to_notify; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setPassword(String password) { this.password = password; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setEmail(String email) { this.email = email; }
    public void setProfilePicture(Boolean profile_picture) { this.profile_picture = profile_picture; }
    public void setDateOfBirth(LocalDate date_of_birth) { this.date_of_birth = date_of_birth; }
    public void setOnline(Boolean is_online) { this.is_online = is_online; }
    public void setFriends(List<String> friends) { this.friends = friends; }
    public void setEvents(List<String> events) { this.events = events; }
    public void setOauth(Boolean is_oauth) { this.is_oauth = is_oauth; }
    public void setEventsToNotify(List<Long> events_to_notify) { this.events_to_notify = events_to_notify; }

    public String toString() {
        return "Firstname: " + this.firstname + ", Lastname: " + this.lastname + ", Email: " + this.email;
    }

    public void addNotification(String message) {
        if (this.notifications == null)
            this.notifications = new ArrayList<String>();
        this.notifications.add(message);
    }
    
    public void checkNotification(String message) {
        if (this.notifications == null)
            this.notifications = new ArrayList<String>();
        this.notifications.add(message);
    }

    public void deleteNotification(String message) {
        if (this.notifications == null)
            this.notifications = new ArrayList<String>();
        this.notifications.remove(message);
    }

    public void addEventToNotify(Long event_id) {
        if (this.events_to_notify == null)
            this.events_to_notify = new ArrayList<Long>();
        this.events_to_notify.add(event_id);
    }

    public void eventNotified(Long event_id) {
        if (this.events_to_notify == null)
            this.events_to_notify = new ArrayList<Long>();
        this.events_to_notify.remove(event_id);
    }
}
