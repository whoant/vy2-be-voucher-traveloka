FROM node:16.14.2-alpine3.15

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./

ARG NODE_ENV=development

RUN yarn install

COPY . .

CMD ["yarn", "start"]
