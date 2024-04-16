FROM node:latest AS BUILD

WORKDIR /usr/src/frontend

COPY package*.json ./

COPY package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM node:latest

WORKDIR /usr/src/frontend

COPY --from=BUILD /usr/src/frontend/node_modules ./node_modules
COPY --from=BUILD /usr/src/frontend/dist ./dist
COPY --from=BUILD /usr/src/frontend/package*.json ./

COPY	./configure.sh /tmp/configure_frontend.sh
RUN		chmod +x /tmp/configure_frontend.sh

EXPOSE 4200

ENTRYPOINT [ "sh", "/tmp/configure_frontend.sh" ]