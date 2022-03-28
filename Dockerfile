FROM node:14-alpine

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install --only=production --verbose && npm cache clean --force --loglevel=error
COPY --chown=node:node . /home/node/app

RUN npm run build

CMD [ "npm", "run", "start" ]
