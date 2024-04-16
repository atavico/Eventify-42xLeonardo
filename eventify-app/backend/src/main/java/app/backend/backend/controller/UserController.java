package app.backend.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import app.backend.backend.model.User;
import app.backend.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import app.backend.backend.model.JwtUtils;
import org.springframework.security.crypto.bcrypt.*;
import app.backend.backend.model.Utils;
import app.backend.backend.model.CookieUtils;

import java.io.*;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigInteger;
import java.security.SecureRandom;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "https://localhost:4200", allowedHeaders = "*", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE} )
@RequestMapping("/user")
public class UserController {

    JwtUtils jwt = new JwtUtils();
    Utils utils = new Utils();
    CookieUtils cookie = new CookieUtils();

    @Autowired
    UserRepository userRepository;

    String state = new BigInteger(130, new SecureRandom()).toString(32);

    @PostMapping("/add")
    public String addUser(@RequestBody User user, HttpServletResponse response) throws IOException {
        try {
            user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
            user.setIs_online(true);
            User newUser = userRepository.save(user);
            if (newUser != null) {
                String token = jwt.createJWT(newUser.getEmail());
                utils.writeToFile(newUser.toString(), "/usr/src/backend/logs/logged.txt");
                Cookie cookie = CookieUtils.createCookie("token", token, 360000000);
                response.addCookie(cookie);
                return token;
            }
            return null;
        } catch (Exception e) {
            System.err.println(e);
            return null;
        }
    }

    @PostMapping("/oauth/add")
    public User addOauthUser(@RequestBody User user, HttpServletResponse response) throws IOException {
        try {
            user.setIs_oauth(true);
            user.setIs_online(true);
            User checkUser = userRepository.findByEmail(user.getEmail());
            if (checkUser != null) {
                return user;
            }
            User newUser = userRepository.save(user);
            if (newUser != null) {
                String token = jwt.createJWT(newUser.getEmail());
                utils.writeToFile(newUser.toString(), "/usr/src/backend/logs/logged.txt");
                Cookie cookie = CookieUtils.createCookie("token", token, 360000000);
                response.addCookie(cookie);
                return newUser;
            }
            return null;
        } catch (Exception e) {
            System.err.println(e);
            return null;
        }
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @GetMapping("/get/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }

    @GetMapping("/getInfo")
    public User retrieveInfo(@RequestHeader Map<String, String> headers) {
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken == null) {
            return null;
        }
        String email = jwt.verifyJWT(jwtToken);
        if (email == null) {
            return null;
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return null;
        }
        return user;
    }

    @GetMapping("/logout")
    public void deleteCookie(HttpServletResponse response, @RequestHeader Map<String, String> headers) {
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken == null) {
            return ;
        }
        String email = jwt.verifyJWT(jwtToken);
        if (email == null) {
            return ;
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ;
        }
        user.setIs_online(false);
        Cookie cookie = CookieUtils.createCookie("token", "", 0);
        response.addCookie(cookie);
    }

    @DeleteMapping("/delete/{email}")
    public void deleteUser(@PathVariable String email) {
        userRepository.deleteByEmail(email);
    }

    @GetMapping("/verify")
    public Boolean verifyToken(@RequestHeader Map<String, String> headers) {
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwt.verifyJWT(jwtToken) == null) {
            return false;
        }
        return true;
    }

    @PutMapping("/update")
    public Boolean updateUser(@RequestBody User user, @RequestHeader Map<String, String> headers) {
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken == null) {
            return false;
        }
        String email = jwt.verifyJWT(jwtToken);
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            return false;
        }
        existingUser.setFirstname(user.getFirstname());
        existingUser.setLastname(user.getLastname());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setProfilePicture(user.getProfilePicture());
        userRepository.save(existingUser);
        return true;
    }

    @PutMapping("/update/password/{oldPassword}/{newPassword}")
    public Boolean updatePassword(@PathVariable String oldPassword, @PathVariable String newPassword, @RequestHeader Map<String, String> headers) {
         String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken == null) {
            return false;
        }
        String email = jwt.verifyJWT(jwtToken);
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            return false;
        }
        if (!BCrypt.checkpw(oldPassword, existingUser.getPassword())) {
            return false;
        }
        String pwd = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        existingUser.setPassword(pwd);
        userRepository.save(existingUser);
        return true;
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body, HttpServletResponse response, @RequestHeader Map<String, String> headers) throws IOException {
        String getEmail = body.get("email");
        String getPassword = body.get("password");
        String jwtToken = cookie.extractToken(headers.get("cookie"));
        if (jwtToken != null) {
            System.out.println("User already logged in");
            return null;
        }
        User existingUser = userRepository.findByEmail(getEmail);
        if (existingUser == null) {
            System.out.println("User not found");
            return null;
        }
        if (existingUser.isOauth()) {
            System.out.println("Please, consider to login with Google");
            return null;
        }
        if (!BCrypt.checkpw(getPassword, existingUser.getPassword())) {
            System.out.println("Wrong password");
            return null;
        }
        utils.writeToFile(existingUser.toString(), "/usr/src/backend/logs/logged.txt");
        String token = jwt.createJWT(getEmail);
        Cookie cookie = CookieUtils.createCookie("token", token, 360000000);
        response.addCookie(cookie);
        existingUser.setIs_online(true);
        userRepository.save(existingUser);
        return existingUser;
    }

    @PostMapping("/profile_picture")
    public Boolean uploadProfilePicture(@RequestParam("file") MultipartFile file, @RequestHeader Map<String, String> headers) {
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
            // String extension = file.getOriginalFilename().split("\\.")[1];
            String fileName = email + "." + "png";
            file.transferTo( new File("/usr/src/backend/uploads/profile_pictures/" + fileName));
            user.setProfilePicture(true);
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @PostMapping("/notification/{message}")
    public Boolean addNotification(@PathVariable String message, @RequestHeader Map<String, String> headers) {
        try {
            System.out.println(message);
            String jwtToken = cookie.extractToken(headers.get("cookie"));
            if (jwtToken == null) {
                return null;
            }
            String email = jwt.verifyJWT(jwtToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return false;
            }
            String notification = LocalDate.now().toString() + " " + message;
            System.out.println(notification);
            user.addNotification(notification);
            User savedUser = userRepository.saveAndFlush(user);
            System.out.println(savedUser);
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @DeleteMapping("/deleteNotification/{message}")
    public Boolean deleteNotification(@PathVariable String message, @RequestHeader Map<String, String> headers) {
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
            user.deleteNotification(message);
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    @GetMapping("/notifications")
    public List<String> getNotifications(@RequestHeader Map<String, String> headers) {
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
            return user.getNotifications();
        } catch (Exception e) {
            System.err.println(e);
            return null;
        }
    }

    @GetMapping("/checkNotification/{message}")
    public Boolean checkNotification(@PathVariable String message, @RequestHeader Map<String, String> headers) {
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
            user.checkNotification(message);
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }
}
