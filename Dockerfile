FROM node
RUN mkdir app

# This command makes `/app/` the current working directory. You can assume you are 'inside' that directory for all following commands
WORKDIR app

# TODO: ADD all the application code into /app
ADD . /app

WORKDIR src/mobile
# TODO: RUN `npm install`
RUN npm install

EXPOSE 3000
CMD ["node", "server/server.js"] 
