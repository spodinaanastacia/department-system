from rest_framework import viewsets
from .models import (
    Преподаватель,
    Аудитория,
    Дисциплина,
    Публикация,
    ДополнительнаяНагрузка,
    Отчет,
    Бронирование
)
from .serializers import (
    ПреподавательSerializer,
    АудиторияSerializer,
    ДисциплинаSerializer,
    ПубликацияSerializer,
    ДополнительнаяНагрузкаSerializer,
    ОтчетSerializer,
    БронированиеSerializer
)


class ПреподавательViewSet(viewsets.ModelViewSet):
    queryset = Преподаватель.objects.all()
    serializer_class = ПреподавательSerializer


class АудиторияViewSet(viewsets.ModelViewSet):
    queryset = Аудитория.objects.all()
    serializer_class = АудиторияSerializer


class ДисциплинаViewSet(viewsets.ModelViewSet):
    queryset = Дисциплина.objects.all()
    serializer_class = ДисциплинаSerializer


class ПубликацияViewSet(viewsets.ModelViewSet):
    queryset = Публикация.objects.all()
    serializer_class = ПубликацияSerializer


class ДополнительнаяНагрузкаViewSet(viewsets.ModelViewSet):
    queryset = ДополнительнаяНагрузка.objects.all()
    serializer_class = ДополнительнаяНагрузкаSerializer


class ОтчетViewSet(viewsets.ModelViewSet):
    queryset = Отчет.objects.all()
    serializer_class = ОтчетSerializer


class БронированиеViewSet(viewsets.ModelViewSet):
    queryset = Бронирование.objects.all()
    serializer_class = БронированиеSerializer
    filterset_fields = ['аудитория', 'преподаватель', 'день_недели', 'активно']