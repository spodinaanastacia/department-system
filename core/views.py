from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Преподаватель,
    Аудитория,
    Дисциплина,
    Публикация,
    ДополнительнаяНагрузка,
    Отчет
)
from .serializers import (
    ПреподавательSerializer,
    АудиторияSerializer,
    ДисциплинаSerializer,
    ПубликацияSerializer,
    ДополнительнаяНагрузкаSerializer,
    ОтчетSerializer
)


class ПреподавательViewSet(viewsets.ModelViewSet):
    """API для работы с преподавателями"""
    queryset = Преподаватель.objects.all()
    serializer_class = ПреподавательSerializer
    search_fields = ['фио', 'должность']  # Поиск по ФИО и должности
    filter_fields = ['должность']  # Фильтрация по должности


class АудиторияViewSet(viewsets.ModelViewSet):
    """API для работы с аудиториями"""
    queryset = Аудитория.objects.all()
    serializer_class = АудиторияSerializer
    filter_fields = ['тип']


class ДисциплинаViewSet(viewsets.ModelViewSet):
    """API для работы с дисциплинами"""
    queryset = Дисциплина.objects.all()
    serializer_class = ДисциплинаSerializer
    search_fields = ['название', 'код']


class ПубликацияViewSet(viewsets.ModelViewSet):
    """API для работы с публикациями"""
    queryset = Публикация.objects.all()
    serializer_class = ПубликацияSerializer
    filter_fields = ['год', 'тип']


class ДополнительнаяНагрузкаViewSet(viewsets.ModelViewSet):
    """API для работы с дополнительной нагрузкой"""
    queryset = ДополнительнаяНагрузка.objects.all()
    serializer_class = ДополнительнаяНагрузкаSerializer
    filter_fields = ['тип', 'преподаватель']


class ОтчетViewSet(viewsets.ModelViewSet):
    """API для работы с отчетами"""
    queryset = Отчет.objects.all()
    serializer_class = ОтчетSerializer
    filter_fields = ['тип']