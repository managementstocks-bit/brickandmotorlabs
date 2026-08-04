FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html about.html events.html contact.html privacy.html shipping.html faq.html style.css script.js /usr/share/nginx/html/
COPY robots.txt sitemap.xml /usr/share/nginx/html/
COPY builds /usr/share/nginx/html/builds/
COPY images /usr/share/nginx/html/images/

EXPOSE 80
