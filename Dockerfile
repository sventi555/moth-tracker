FROM node:10

WORKDIR /usr/src/app

# copy over package.json for dependencies
COPY package.json .

# install dependencies
RUN yarn --no-progress --frozen-lockfile --production

# copy over rest of project
COPY . .

# start the service
CMD yarn start
