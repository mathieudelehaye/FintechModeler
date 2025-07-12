# C++ build stage
# Explicitly using gcc 11 for a more stable version
FROM gcc:11 AS cpp-builder 
WORKDIR /cpp

# Copy all C++ source files and headers
COPY dll/common ./common
COPY dll/include ./include

# Find all cpp files and compile with proper flags
RUN find . -name "*.cpp" > sources.txt && \
    g++ -shared -o libfintech_model.so -fPIC \
    -I./include \
    -DMYLIBRARY_EXPORTS \
    -fvisibility=hidden \
    $(cat sources.txt)

# Java build stage
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

# Copy the Gradle wrapper first
COPY backend/gradlew .
COPY backend/gradle/ gradle/

# Copy the rest of your source
COPY backend/ .

# Give the wrapper execute permissions
RUN chmod +x ./gradlew

# Copy the SO to the resources directory so it gets packaged in the JAR
RUN mkdir -p app/src/main/resources/linux-x86-64
COPY --from=cpp-builder /cpp/libfintech_model.so app/src/main/resources/linux-x86-64/

# Build the application
RUN ./gradlew bootJar --no-daemon

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Install specific version of libstdc++6 that matches the build environment
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc-11 \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -r spring && \
    chown -R spring:spring /app

# Copy JAR and SO
COPY --from=builder /app/app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar

RUN chown -R spring:spring /app

USER spring:spring
EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=dev
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
# No need for LD_LIBRARY_PATH since the library will be extracted from the JAR

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]