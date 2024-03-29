FROM node:14.15.4-alpine3.12

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