# STAGE 1: Build the Angular app (The Kitchen)
FROM node:22.19 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build it for production
COPY . .
RUN npm run build --configuration=production

# STAGE 2: Serve the app with Nginx (The Display Case)
FROM nginx:alpine

# WE ADDED /browser TO THE END OF THIS LINE BECAUSE THE ANGULAR BUILD OUTPUTS TO A "BROWSER" FOLDER INSIDE THE "DIST" FOLDER
COPY --from=build /app/dist/UserMgmt.UI/browser/* /usr/share/nginx/html/

# Expose port 80 so the outside world can see it
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]