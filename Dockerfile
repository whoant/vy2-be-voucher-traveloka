FROM node:16.14.2-alpine3.15

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./

ARG NODE_ENV=development

ENV PM2_PUBLIC_KEY i79kqkosblsuedd
ENV PM2_SECRET_KEY o2h658r0l2nr50r

RUN yarn install
RUN npm install pm2 -g
COPY . .
CMD ["pm2-runtime", "process.yml"]

