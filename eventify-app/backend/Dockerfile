# Preparation steps
FROM gradle:latest AS BUILD_IMAGE
ENV APP_HOME=/usr/src/backend
RUN mkdir -p $APP_HOME/src/main/java

WORKDIR $APP_HOME
# Copy all the files
COPY ./build.gradle ./gradlew ./gradlew.bat $APP_HOME
COPY gradle $APP_HOME/gradle
COPY ./src $APP_HOME/src/

RUN chmod +x ./gradlew

RUN ./gradlew clean bootJar

FROM openjdk:17-oracle

WORKDIR /usr/src/backend
COPY --from=BUILD_IMAGE '/usr/src/backend/build/libs/*.jar' '/app/app.jar'

EXPOSE 8080
CMD ["java","-jar","/app/app.jar"]