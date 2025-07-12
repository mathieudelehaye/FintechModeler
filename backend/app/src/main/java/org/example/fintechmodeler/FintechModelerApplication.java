package org.example.fintechmodeler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.example.util.LibraryLoader;

@SpringBootApplication
public class FintechModelerApplication {
    static {
        // This will trigger the library loading
        new LibraryLoader();
    }

    public static void main(String[] args) {
        SpringApplication.run(FintechModelerApplication.class, args);
    }
}
