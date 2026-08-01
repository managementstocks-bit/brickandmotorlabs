FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html about.html events.html contact.html style.css script.js /usr/share/nginx/html/
COPY builds /usr/share/nginx/html/builds/

EXPOSE 80
