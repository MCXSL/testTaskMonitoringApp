FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Отключаем сбор статистики Angular
ENV NG_CLI_ANALYTICS="false"
ENV NG_CLI_ANALYTICS_SHARE="false"
ENV CHOKIDAR_USEPOLLING="true"
ENV NODE_ENV="development"

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь проект
COPY . .

# Открываем порт
EXPOSE 4200

# Генерируем API схему и запускаем Angular
CMD sh -c "npm run generate-api-schema && npm start -- --host 0.0.0.0 --poll 2000 --allowed-hosts=all"