FROM node:16-alpine

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install --only=production --verbose && npm cache clean --force --loglevel=error
COPY --chown=node:node . /home/node/app
RUN cd /home/node/app/cloud-functions && npm i && cd /home/node/app/

RUN npm run build

CMD [ "npm", "run", "start" ]
