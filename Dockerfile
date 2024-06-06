FROM node:21-alpine AS builder

WORKDIR /build-stage
COPY . ./

WORKDIR /build-stage/client
RUN npm install
RUN npm run build

WORKDIR /build-stage/server
RUN npm install

FROM node:21-alpine

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
USER node
COPY --from=builder /build-stage/server ./
EXPOSE 3000

CMD [ "node", "index.js" ]