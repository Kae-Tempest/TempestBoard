FROM node:20-alpine

WORKDIR /app

# Install dependencies if package.json exists
# otherwise it will be done when the volume is mounted
COPY package*.json ./
RUN npm install

# Don't copy source code - we'll use the mounted volume

# Install Angular CLI globally
RUN npm install -g @angular/cli@19

EXPOSE 4200
EXPOSE 49153

# Start Angular server in development mode
# --host 0.0.0.0 allows connections from outside the container
# --poll=2000 enables file polling for hot reload in Docker environments
# --disable-host-check allows testing from external devices
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000", "--disable-host-check"]
