
FROM node:20-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY ./ ./

RUN npm run compile


CMD [ "npm","run","start" ]
