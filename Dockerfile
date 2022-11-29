FROM node:16.14.2-alpine3.15

RUN mkdir -p /opt/app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

WORKDIR /opt
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force

WORKDIR /opt/app
COPY ./src/ /opt/app
CMD ["node", "app.js"]

