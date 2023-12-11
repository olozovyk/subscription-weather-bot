FROM node:20-bookworm
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm uninstall dev-dependencies
CMD ["npm", "start"]
EXPOSE $PORT
