FROM node:12.10.0

# copy package.json and package-lock.json into /usr/app
WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy
RUN npm install axios
RUN npm install classnames
RUN npm install --save prop-types

COPY . .

EXPOSE 3000

# start the development server
CMD ["npm", "start"]