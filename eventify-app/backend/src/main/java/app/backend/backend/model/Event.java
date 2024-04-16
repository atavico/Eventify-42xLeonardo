package app.backend.backend.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "event")
public class Event implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "title", nullable = false, length = 100)
    private String title;
    @Column(name = "description", nullable = false, length = 500)
    private String description;
    @Column(name = "location", nullable = false, length = 100)
    private String location;
    @Column(name = "start_start", nullable = false, length = 50)
    @JsonFormat(pattern = "dd-MMM-yyyy HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalDateTime start;
    @Column(name = "end_date", nullable = false, length = 50)
    @JsonFormat(pattern = "dd-MMM-yyyy HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalDateTime end;
    @Column(name = "event_images", nullable = true)
    private List<String> event_images;
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    @Column(name = "owner", nullable = false)
    private String owner;
    @Column(name = "subscribers", nullable = true)
    private List<String> subscribers;
    @Column(name = "event_chat", nullable = true)
    private List<String> event_chat;

    public Event() {}

    public Event (
        String title,
        String description,
        String location,
        LocalDateTime start,
        LocalDateTime end,
        List<String> event_images,
        String category,
        String owner,
        List<String> subscribers
    ) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.start = start;
        this.end = end;
        if (event_images == null) {
            this.event_images = new ArrayList<String>();
        } else {
            this.event_images = event_images;
        }
        this.category = category;
        this.owner = owner;
        if (subscribers == null) {
            this.subscribers = new ArrayList<String>();
        } else {
            this.subscribers = subscribers;
        }
    }

    // Getters
    public Long getId() { return this.id;  }
    public String getTitle() { return this.title; }
    public String getDescription() { return this.description; }
    public String getLocation() { return this.location; }
    public LocalDateTime getStart() { return this.start; }
    public LocalDateTime getEnd() { return this.end; }
    public List<String> getEventImages() { return this.event_images; }
    public String getCategory() { return this.category; }
    public String getOwner() { return this.owner; }
    public List<String> getSubscribers() { return this.subscribers; }
    public List<String> getEventChat() { return this.event_chat; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setStart(LocalDateTime start) { this.start = start; }
    public void setEnd(LocalDateTime end) { this.end = end; }
    public void setEventImages(String event_images) { this.event_images.add(event_images); }
    public void setCategory(String category) { this.category = category; }
    public void setOwner(String owner) { this.owner = owner; }
    public void addSubscribe(String subscriber) {
        if (this.subscribers == null) {
            this.subscribers = new ArrayList<String>();
        } else if (this.subscribers.contains(subscriber)) {
            return;
        }
        this.subscribers.add(subscriber);
    }
    
    public void addImage(String image) { this.event_images.add(image); }
    public void removeImage(String image) { this.event_images.remove(image); }
    public void removeSubscribe(String subscriber) { this.subscribers.remove(subscriber); }
    public void setEventChat(List<String> event_chat) { this.event_chat = event_chat; }

    public void addMessage(String message) {
        if (this.event_chat == null) {
            this.event_chat = new ArrayList<String>();
        }
        this.event_chat.add(message);
    }

    public void deleteMessage(String message) {
        if (this.event_chat == null) {
            this.event_chat = new ArrayList<String>();
        }
        this.event_chat.remove(message);
    }
}
