FROM amazon/aws-lambda-nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json ./
RUN npm install
COPY index.js ./
COPY script.sql ./

CMD [ "index.handler" ]