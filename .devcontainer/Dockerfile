# File: .devcontainer/Dockerfile
# 1. Base image with Node.js 18 and TypeScript support
FROM mcr.microsoft.com/devcontainers/typescript-node:18-bullseye

# 2. Global tool for running your .mjs/TS scripts
RUN npm install -g tsx

# 3. Set workdir and cache dependencies
WORKDIR /workspace

# Copy only package.json & lockfile first for layer caching
COPY package*.json ./
RUN npm install

# 4. Copy rest of your repo
COPY . .

# 5. Default command: start the dev server
CMD ["npm", "run", "dev"]
