package app.backend.backend.model;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import app.backend.backend.repository.EventRepository;
import app.backend.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import app.backend.backend.model.Event;
import app.backend.backend.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.time.format.DateTimeFormatter;

@Component
public class ScheduleTask {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;

	@Scheduled(fixedRate = 10000)
    @Async
	public void reportCurrentTime() {
        List<Event> events = eventRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd HH:mm");
        events.forEach(event -> {
            LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
            if (event.getEnd().isBefore(LocalDateTime.now())) {
                this.deleteEvent(event);
            } else if (event.getStart().isBefore(tomorrow)) {
                event.getSubscribers().forEach(subscriber -> {
                    User user = userRepository.findByEmail(subscriber);
                    if (user != null && user.getEvents_to_notify() != null && user.getEvents_to_notify().contains(event.getId())) {
                        String notification = now.format(formatter) + " " + event.getTitle() + " will began at " + event.getStart().toString() + " @" + event.getLocation();
                        user.addNotification(notification);
                        user.eventNotified(event.getId());
                        userRepository.save(user);
                    }
                });
            }
        });
	}

    @Transactional
    @Async
    public void deleteEvent(Event event) {
        eventRepository.delete(event);
    }

    // @Transactional
    // @Async
    // public void pushNotification(User user, String notification) {
    //     if (user != null) {
    //         List<String> notifications = user.getNotifications();
    //         if (notifications == null || !notifications.contains(notification)) {
    //             user.addNotification(notification);
    //         }
    //     }
    // }
}
