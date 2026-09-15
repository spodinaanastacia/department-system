from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ПреподавательViewSet,
    АудиторияViewSet,
    ДисциплинаViewSet,
    ПубликацияViewSet,
    ДополнительнаяНагрузкаViewSet,
    ОтчетViewSet
)

# Создаем роутер
router = DefaultRouter()

# Регистрируем ViewSets с URL-адресами
router.register(r'преподаватели', ПреподавательViewSet)
router.register(r'аудитории', АудиторияViewSet)
router.register(r'дисциплины', ДисциплинаViewSet)
router.register(r'публикации', ПубликацияViewSet)
router.register(r'нагрузка', ДополнительнаяНагрузкаViewSet)
router.register(r'отчеты', ОтчетViewSet)

# URL-паттерны приложения core
urlpatterns = [
    path('', include(router.urls)),
]