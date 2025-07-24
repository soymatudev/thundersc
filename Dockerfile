FROM php:8.3-apache

RUN apt-get update

RUN apt-get install -y libpq-dev libzip-dev unzip git iputils-ping mlocate

RUN updatedb

RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./ /var/www/html/thundersc/

RUN chown -R www-data:www-data /var/www/html/thundersc/

#RUN chcon -R -t httpd_sys_rw_content_t /var/www/html/thundersc/thundercloud/vendor/mpdf/mpdf/tmp
#RUN find /var/www/html/thundersc/ -type f -name "thunderlog.log" -exec chcon -t httpd_log_t {};
RUN composer require mpdf/mpdf
