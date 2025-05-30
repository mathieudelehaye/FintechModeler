package org.example.fintechmodeler.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import com.sun.jna.NativeLibrary;

@Configuration
public class NativeLibConfig {

    @PostConstruct
    public void init() {
        // “fintech_model” is the base name you pass to Native.load(...)
        // This path must match where Gradle put the DLL under build/resources/main
        String userDir = System.getProperty("user.dir");
        String dllPath = userDir + "/app/build/resources/main/win32-x86-64";
        // In a packaged jar it’ll be under BOOT-INF/classes/win32-x86-64
        // but JNA will extract classpath resources automatically in most cases.
        NativeLibrary.addSearchPath("fintech_model", dllPath);
        // (Optional) pre-load the library to catch errors early:
        NativeLibrary.getInstance("fintech_model");
    }
}
