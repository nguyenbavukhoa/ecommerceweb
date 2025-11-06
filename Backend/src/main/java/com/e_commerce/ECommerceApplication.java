package com.e_commerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableJpaAuditing
// @EnableScheduling
public class ECommerceApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.filename("local.env") // có thể đổi thành ".env" nếu bạn dùng tên đó
				.load();

		// 🔹 Set các biến môi trường để Spring đọc được
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		SpringApplication.run(ECommerceApplication.class, args);

	}

}
