package app.backend.backend.model;

import java.io.FileWriter;
import java.io.IOException;
import java.io.BufferedWriter;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

public class Utils {
    
    public static void writeToFile(String text, String path) throws IOException {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");  
            LocalDateTime now = LocalDateTime.now();
            BufferedWriter writer = new BufferedWriter(new FileWriter(path, true));
            writer.append("[" + dtf.format(now) + "] " + text + "\n");
            writer.close();
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

}
