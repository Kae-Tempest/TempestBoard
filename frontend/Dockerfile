FROM node:22-alpine

WORKDIR /app

# Copy package files only
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# We'll mount the application code at runtime
# No need for COPY . . here

EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]