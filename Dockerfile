# Use a specific base image from Docker Hub
FROM nginx:latest AS build

# Your build steps here

# Use a separate stage for final image
FROM nginx:latest

# Copy build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80
