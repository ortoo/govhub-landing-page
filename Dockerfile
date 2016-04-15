FROM nginx:1.9-alpine

COPY build/site /www
COPY nginx.conf /etc/nginx/nginx.conf
