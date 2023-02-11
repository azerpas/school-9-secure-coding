FROM node:19-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Bundle app source
COPY . .

EXPOSE 8080

RUN npm install
RUN npm rebuild bcrypt 

CMD [ "npm", "run", "dev" ]
