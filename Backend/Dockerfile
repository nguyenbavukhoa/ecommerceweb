# =========================
# Stage 1: Build JAR
# =========================
FROM maven:3.9.9-eclipse-temurin-21 AS builder
LABEL authors="kien"

WORKDIR /app

# Copy pom.xml để cache dependency
COPY pom.xml ./

# Tải dependency
RUN mvn dependency:go-offline -B

# Copy source
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests -Pprod -Dspring-boot.build-image=false -Dpackaging=jar

# =========================
# Stage 2: Run JAR
# =========================
FROM eclipse-temurin:21-jre-alpine

# Tạo user không phải root để chạy app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app

# ARG để tránh hardcode version JAR
ARG JAR_FILE=target/*.jar
COPY --from=builder /app/${JAR_FILE} app.jar

# Chạy ứng dụng
ENTRYPOINT ["java","-jar","app.jar"]
