package app.backend.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.*;
import app.backend.backend.model.Event;
import app.backend.backend.model.User;
import app.backend.backend.repository.EventRepository;
import app.backend.backend.repository.UserRepository;
import app.backend.backend.model.JwtUtils;
import org.springframework.data.domain.Sort;

import app.backend.backend.model.CookieUtils;

import java.util.List;
import java.io.*;
import java.nio.file.Files;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@CrossOrigin(origins = "https://localhost:4200", allowedHeaders = "*", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/event")
public class EventController {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;

    JwtUtils jwt = new JwtUtils();
    CookieUtils cookie = new CookieUtils();
    
    @PostMapping("/create")
    public Event createEvent(@RequestBody Event event, @RequestHeader Map<String, String> headers) {
        try {
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            if (jwtToken == null) {
                return null;
            }
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return null;
            }
            Event newEvent = eventRepository.save(event);
            if (newEvent != null) {
                File path = new File("/usr/src/backend/uploads/event_images/" + newEvent.getId());
                path.mkdirs();
                if (!newEvent.getEventImages().isEmpty()) {
                    newEvent.getEventImages().forEach(image -> {
                        try {
                            File file = new File("/usr/src/backend/uploads/tmp/" + image);
                            if (file.exists()) {
                                Files.move(file.toPath(), new File("/usr/src/backend/uploads/event_images/" + newEvent.getId() + "/" + image).toPath());
                            } else {
                                newEvent.getEventImages().remove(image);
                            }
                        } catch (Exception e) {
                            System.err.println(e);
                        }
                    });
                }
                return newEvent;
            }
            return null;
        } catch (Exception e) {
            System.err.println(e);
            return null;
        }
    }

    @GetMapping("/join/{id}")
    public Boolean joinEvent(@PathVariable Long id, @RequestHeader Map<String, String> headers) {
        try {
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            if (jwtToken == null) {
                return null;
            }
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return false;
            }
            Event event = eventRepository.findById(id);
            if (event == null) {
                return false;
            }
            if (event.getSubscribers() != null && event.getSubscribers().contains(user.getEmail())) {
                return false;
            }
            event.addSubscribe(user.getEmail());
            user.addEventToNotify(id);
            Event newEvent = eventRepository.save(event);
            if (newEvent != null) {
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @GetMapping("/leave/{Id}")
    public Boolean leaveEvent(@PathVariable Long Id, @RequestHeader Map<String, String> headers) {
        try {
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            if (jwtToken == null) {
                return null;
            }
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return false;
            }
            Event event = eventRepository.findById(Id);
            if (event == null) {
                return false;
            }
            user.eventNotified(Id);
            event.removeSubscribe(user.getEmail());
            Event newEvent = eventRepository.save(event);
            if (newEvent != null) {
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @GetMapping("/all/ordered")
    public List<Event> getAllEventsOrdered() {
        return eventRepository.findAllByOrderByStartAsc();
    }

    @GetMapping("/owner")
    public List<Event> getEventsByOwner(@RequestHeader Map<String, String> headers, Sort sort) {
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken == null) {
            return null;
        }
        String email = jwt.verifyJWT(jwtToken);
        if (email == null) {
            return null;
        }
        return eventRepository.findByOwner(email, Sort.by(Sort.Direction.ASC, "start"));
    }

    @GetMapping("/get/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
    }

    @PostMapping("/upload/images")
    public Boolean uploadImages(@RequestParam("files") MultipartFile file[], @RequestHeader Map<String, String> headers) {
        try {
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return false;
            }
            List<String> images = new ArrayList<>();
            Arrays.asList(file).forEach(f -> {
                String fileName = f.getOriginalFilename();
                images.add("/usr/src/backend/uploads/tmp/" + fileName);
                try {
                    f.transferTo( new File("/usr/src/backend/uploads/tmp/" + fileName));
                } catch (Exception e) {
                    System.err.println(e);
                }
            });
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @DeleteMapping("/delete/images/tmp/{img}")
    public Boolean deleteFromTmp(@PathVariable String img, @RequestHeader Map<String, String> headers) {
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken == null) {
            return false;
        }
        String email = jwt.verifyJWT(jwtToken);
        if (email == null) {
            return false;
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }
        File file = new File("/usr/src/backend/uploads/tmp/" + img);
        if (file.delete()) {
            return true;
        }
        return false;
    }

    @PostMapping("/push_msg/{id}")
    public Boolean pushMessage(@PathVariable Long id, @RequestBody String message, @RequestHeader Map<String, String> headers) {
        try {
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return false;
            }
            Event event = eventRepository.findById(id);
            if (event == null) {
                return false;
            }
            event.addMessage(message);
            eventRepository.save(event);
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @GetMapping("/get_msg/{id}")
    public List<String> getMessages(@PathVariable Long id) {
        Event event = eventRepository.findById(id);
        if (event == null) {
            return null;
        }
        return event.getEventChat();
    }
    
    @PostMapping("/update/{id}")
    public Boolean editEvent(@RequestHeader Map<String, String> headers, @RequestBody Event Body, @PathVariable Long id) {
        try {
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return false;
            }
            Event event = eventRepository.findById(id);
            if (event == null) {
                return false;
            }
            if (!event.getOwner().equals(email)) {
                return false;
            }
            LocalDateTime start = null;
            if (Body.getStart() != null) {
                start = Body.getStart();
                if (start.isBefore(LocalDateTime.now())) {
                    return false;
                }
            }
            LocalDateTime end = null;
            if (Body.getEnd() != null) {
                end = Body.getEnd();
                if (end.isBefore(LocalDateTime.now())) {
                    return false;
                }
            }
            if ((Body.getStart() != null && Body.getEnd() != null) && end.isBefore(start)) {
                return false;
            }
            event.setTitle(Body.getTitle());
            event.setDescription(Body.getDescription());
            event.setLocation(Body.getLocation());
            if (Body.getStart() != null)
                event.setStart(start);
            if (Body.getEnd() != null)
                event.setEnd(end);
            event.setCategory(Body.getCategory());
            event.getSubscribers().forEach(Subscriber -> {
                User subscriber = userRepository.findByEmail(Subscriber);
                if (subscriber != null) {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd HH:mm");
                    subscriber.addNotification(LocalDateTime.now().format(formatter) + " " + Body.getTitle() + " has been updated!");
                    userRepository.save(subscriber);
                }
            });
            Event newEvent = eventRepository.save(event);
            if (newEvent != null) {
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }
}
