FROM 082670687034.dkr.ecr.ap-southeast-2.amazonaws.com/node:22.4.0-alpine AS base

WORKDIR /webapp
COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]
