
FROM node:16.13.2-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
EXPOSE 3000

# run app
CMD [ "yarn", "start:dev"]