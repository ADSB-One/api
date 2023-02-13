FROM node:18-alpine

WORKDIR /server

COPY package.json tsconfig.json ./

RUN npm i && npm i typescript -g

COPY src/ ./src

EXPOSE 3000

ENV NODE_ENV = production

CMD ["npm", "start"]