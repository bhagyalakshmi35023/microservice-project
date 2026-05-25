# Use a single shared Dockerfile for all services.
ARG SERVICE_DIR
FROM node:20-alpine
WORKDIR /app
COPY /app .
RUN npm install --production
EXPOSE 3000
CMD ["node", "index.js"]
