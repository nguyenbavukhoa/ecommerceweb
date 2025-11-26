# 1. Build code React
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
# Lưu ý: Lúc này .env của bạn phải đang trỏ IP LAN (192.168...) nhé
RUN npm run build

# 2. Chạy Nginx để phục vụ web
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]