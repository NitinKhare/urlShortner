FROM node:16

WORKDIR /app

COPY package.json ./

RUN npm install

RUN apt-get update 
RUN apt-get -y install redis-server

COPY . .

EXPOSE 3010

CMD ["npm", "run", "start"]