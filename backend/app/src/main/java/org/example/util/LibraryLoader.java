package org.example.util;

public class LibraryLoader {
    static {
        try {
            String os = System.getProperty("os.name").toLowerCase();
            String libraryPath;
            
            if (os.contains("win")) {
                libraryPath = "/win32-x86-64/fintech_model.dll";
            } else {
                libraryPath = "/linux-x86-64/libfintech_model.so";  // Changed to match the lib name
            }
            
            System.out.println("OS: " + os);
            System.out.println("Looking for library at: " + libraryPath);
            
            // First try loading from the Java library path
            try {
                System.out.println("Attempting to load from Java library path...");
                System.loadLibrary("fintech_model");  // This stays the same - Java adds lib prefix automatically
            } catch (UnsatisfiedLinkError e) {
                System.out.println("Failed to load from library path: " + e.getMessage());
                try {
                    String tempDir = System.getProperty("java.io.tmpdir");
                    java.nio.file.Path libraryFile = java.nio.file.Paths.get(tempDir, 
                        os.contains("win") ? "fintech_model.dll" : "libfintech_model.so");  // Changed here too
                    
                    System.out.println("Attempting to copy library to: " + libraryFile);
                    
                    // Copy library from resources to temp directory
                    try (java.io.InputStream in = LibraryLoader.class.getResourceAsStream(libraryPath)) {
                        if (in == null) {
                            throw new RuntimeException("Library not found in resources: " + libraryPath);
                        }
                        System.out.println("Found library in resources, copying to temp directory...");
                        java.nio.file.Files.copy(in, libraryFile, 
                            java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                        System.out.println("Successfully copied library to: " + libraryFile);
                    }
                    
                    // Load the library from the temp file
                    System.out.println("Attempting to load library from: " + libraryFile);
                    System.load(libraryFile.toString());
                    System.out.println("Successfully loaded library");
                } catch (Exception ex) {
                    throw new RuntimeException("Failed to load library from resources: " + ex.getMessage(), ex);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load native library: " + e.getMessage(), e);
        }
    }
}