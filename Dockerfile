FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=8080
CMD ["npm", "start"]
