# Информационная система кафедры

Веб-приложение для автоматизации работы секретаря кафедры университета.

## Описание задачи

На кафедре работает 25 человек, часть из которых работает не на полную ставку. За каждым преподавателем закреплено рабочее место в одной из нескольких преподавательских аудиторий. Каждый из преподавателей обеспечивает определённый перечень дисциплин, преподаваемых на кафедре. Некоторые из преподавателей выполняют дополнительную работу, такую как кураторство, проведение практик, контроль научных публикаций сотрудников и др.

Информационная система предназначена для секретаря кафедры.

## Технологии

**Backend:**
- Python 3.14
- Django 6.1
- Django REST Framework
- django-filter
- django-cors-headers
- SQLite

**Frontend:**
- React 18
- Vite
- Axios
- React Router

**Инфраструктура:**
- Docker
- Nginx
- Git / GitHub

## Структура проекта

```
department_system/
├── core/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── department_project/
│   ├── settings.py
│   └── urls.py
├── frontend/
│   ├── src/components/
│   │   ├── TeacherList.jsx
│   │   ├── TeacherForm.jsx
│   │   ├── RoomList.jsx
│   │   ├── BookingList.jsx
│   │   ├── SubjectList.jsx
│   │   ├── PublicationList.jsx
│   │   ├── WorkloadList.jsx
│   │   └── ReportList.jsx
│   ├── App.jsx
│   └── config.js
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Запуск проекта

### Локальный запуск

**Backend:**
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Backend: http://127.0.0.1:8000/
Админ-панель: http://127.0.0.1:8000/admin/

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173/

### Запуск через Docker

```bash
docker compose up --build
```
Приложение: http://localhost:3000/

Остановка: `docker compose down`

## Функциональность системы

- **Управление преподавателями** — добавление, редактирование, удаление, учёт должности, ставки, контактов, привязка рабочего места
- **Управление аудиториями** — учёт с указанием типа и вместимости, оборудования
- **Бронирование аудиторий** — создание бронирований по дням и времени, тип занятия, автоматический статус (свободно/занято), разбронирование
- **Управление дисциплинами** — учёт дисциплин, привязка преподавателей, часы лекций и практик
- **Научные публикации** — учёт публикаций с типом (статья, конференция, книга, патент) и авторами
- **Дополнительная нагрузка** — кураторство, практика, ВКР, научная и методическая работа, учёт часов
- **Отчёты** — автоматическая генерация отчётов по сотрудникам, нагрузке, публикациям

## API Endpoints

- `/api/преподаватели/` — GET, POST
- `/api/аудитории/` — GET, POST
- `/api/бронирования/` — GET, POST
- `/api/дисциплины/` — GET, POST
- `/api/публикации/` — GET, POST
- `/api/нагрузка/` — GET, POST
- `/api/отчеты/` — GET, POST

## Автор

Анастасия, ТПУ, летняя практика 2026