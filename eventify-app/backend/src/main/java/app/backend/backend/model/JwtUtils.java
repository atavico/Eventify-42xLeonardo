package app.backend.backend.model;

import com.auth0.jwt.algorithms.*;
import com.auth0.jwt.*;
import com.auth0.jwt.exceptions.*;
import com.auth0.jwt.interfaces.*;
import com.auth0.jwt.impl.*;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.io.*;
import java.security.interfaces.*;


public class JwtUtils {
    
    Algorithm algorithm = Algorithm.HMAC256("abcdefghilmnopqrstuvz1234567890");

    public String createJWT(String email) {
        try {
            String token = JWT.create()
                    .withIssuer("auth0")
                    .withClaim("email", email)
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception) {
            System.err.println(exception.getMessage());
            return null;
        }
    }

    public String verifyJWT(String token) {
        try {
            DecodedJWT jwt = JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
                    .verify(token);
            return jwt.getClaim("email").asString();
        } catch (JWTVerificationException exception) {
            System.err.println(exception.getMessage());
            return null;
        }
    }
}
