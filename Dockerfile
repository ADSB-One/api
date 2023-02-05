FROM node:18-alpine

WORKDIR /server

COPY package.json tsconfig.json ./

RUN npm i && npm i typescript -g

COPY src/ ./

RUN tsc

EXPOSE 3000

CMD ["npm", "start"]