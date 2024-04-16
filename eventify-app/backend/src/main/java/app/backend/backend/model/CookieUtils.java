package app.backend.backend.model;

import java.net.HttpCookie;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.Cookie;


public class CookieUtils {
    


    public static Cookie createCookie(String name, String value, int maxAge) {
        // return name + "=" + value + "; Max-Age=" + maxAge + "; Path=/; HttpOnly; Domain=https://localhost:4200 ; Secure=true";
        
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "none");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setDomain("localhost");
        cookie.setSecure(true);
        return cookie;
    }

    public void deleteCookie(HttpCookie cookie) {
        cookie.setMaxAge(0);
    }

    public Map<String, String> parseCookies(String cookie) {
        Map<String, String> cookies = new HashMap<>();
        String[] cookieArray = cookie.split(";");
        for (String c : cookieArray) {
            String[] pair = c.split("=");
            cookies.put(pair[0], pair[1]);
        }
        return cookies;
    }

    public String getCookie(Map<String, String> cookies, String name) {
        return cookies.get(name);
    }

    public String extractToken(String token) {
        if (token == null) {
            return null;
        }
        Map<String, String> cookies = this.parseCookies(token);
        if (cookies == null) {
            return null;
        }
        return cookies.get("token");
    }
}
