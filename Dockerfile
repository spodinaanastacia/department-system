# Используем официальный образ Python 3.14
FROM python:3.14-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем requirements (сначала только его для кэширования)
COPY requirements.txt .

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код проекта
COPY . .

# Открываем порт 8000
EXPOSE 8000

# Команда для запуска Django сервера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]