package fr.tempest.tempestboard.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure().load();

        dotenv.entries().forEach(e ->
                System.setProperty(e.getKey(), e.getValue())
        );
    }
}