FROM node:24-alpine

WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --workspace backend --include-workspace-root=false

COPY backend backend
WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "start"]

