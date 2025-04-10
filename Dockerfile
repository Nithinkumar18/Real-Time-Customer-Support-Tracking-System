FROM node:21

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node","server.js"]