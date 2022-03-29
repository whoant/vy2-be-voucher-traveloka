FROM node:16.14.2-alpine3.15

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./

ARG NODE_ENV=production

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]
