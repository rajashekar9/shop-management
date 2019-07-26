FROM node:8.4.0
  
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

CMD ["node","/usr/src/app/functions/index"]