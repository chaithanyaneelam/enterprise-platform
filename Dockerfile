# Step 1: Use lightweight Nginx Alpine base image
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy web application assets to Nginx html folder
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Expose port 80 for web access
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
