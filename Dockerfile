FROM php:8.2.17-alpine3.19
RUN apk add --no-cache nodejs npm
RUN apk add --no-cache mysql-client
RUN docker-php-ext-install mysqli pdo pdo_mysql
RUN addgroup thunder && adduser -S -G thunder thunder
USER thunder
WORKDIR /thundersc/
COPY --chown=thunder ./thunder/template/ ./thunder/template/
RUN cd ./thunder/template/ && npm install
COPY --chown=thunder ./thunder/system/ ./thunder/system/
COPY --chown=thunder ./thundercloud/ ./thundercloud/
EXPOSE 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "/thundersc/"]