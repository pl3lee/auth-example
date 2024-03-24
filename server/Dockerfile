FROM node:20

WORKDIR /usr/src/app


COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]

# Copies everything in the src directory to WORKDIR/src
COPY ./src ./src

# Installs all packages
RUN npm install

# Runs the dev npm script to build & start the server
CMD npm run dev