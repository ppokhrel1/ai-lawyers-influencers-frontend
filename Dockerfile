FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
#RUN npm ci
COPY . .
WORKDIR /app/legal-qa-frontend
RUN npm run build

CMD ["npm", "run", "dev"]
#FROM nginx:alpine
#COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080  
#CMD ["nginx", "-g", "daemon off;"]

