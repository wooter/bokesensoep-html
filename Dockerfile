FROM nginx:alpine

# Copy static site files to nginx html directory
COPY . /usr/share/nginx/html/

# Remove the Dockerfile and other non-web files from the served directory
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/.gitignore \
    /usr/share/nginx/html/STIJLBOEK_Bokes\&Soep.pdf

# Custom nginx config for clean URLs and proper caching
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Gzip\n\
    gzip on;\n\
    gzip_types text/plain text/css application/javascript image/svg+xml;\n\
\n\
    # Cache static assets\n\
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$ {\n\
        expires 30d;\n\
        add_header Cache-Control "public, no-transform";\n\
    }\n\
\n\
    # HTML files - no cache\n\
    location ~* \\.html$ {\n\
        expires -1;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate";\n\
    }\n\
\n\
    # Try files, fallback to index\n\
    location / {\n\
        try_files $uri $uri/ $uri.html =404;\n\
    }\n\
\n\
    # Security headers\n\
    add_header X-Frame-Options "SAMEORIGIN" always;\n\
    add_header X-Content-Type-Options "nosniff" always;\n\
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
