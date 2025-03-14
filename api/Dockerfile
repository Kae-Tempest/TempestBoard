FROM maven:3.9-eclipse-temurin-21

WORKDIR /app

# Install extra dependencies for development if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Don't download dependencies or build at build time
# We'll use the mounted volume and do that at runtime

EXPOSE 8080
EXPOSE 35729

# Add Maven wrapper to path
ENV PATH="/app/.mvn/wrapper:${PATH}"

# Run Spring Boot in dev mode with devtools enabled
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments='-XX:TieredStopAtLevel=1'","--debug"]