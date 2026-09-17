// Конфигурация API URL
// В Docker (порт 3000) используется относительный путь — Nginx сам проксирует на backend
// В разработке (порт 5173) используется прямой путь к Django серверу

const API_URL = window.location.port === '3000' 
  ? ''  // Docker: Nginx проксирует /api/ на backend
  : 'http://127.0.0.1:8000';  // Разработка: прямой запрос к Django

export default API_URL;