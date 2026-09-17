# Этап 1: Сборка React приложения
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем весь код frontend
COPY . .

# Собираем production версию
RUN npm run build

# Этап 2: Раздача через Nginx
FROM nginx:alpine

# Копируем собранные файлы из первого этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]