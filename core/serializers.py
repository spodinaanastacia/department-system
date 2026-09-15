from rest_framework import serializers
from .models import (
    Преподаватель,
    Аудитория,
    Дисциплина,
    Публикация,
    ДополнительнаяНагрузка,
    Отчет
)


class ПреподавательSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Преподаватель"""
    class Meta:
        model = Преподаватель
        fields = '__all__'


class АудиторияSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Аудитория"""
    class Meta:
        model = Аудитория
        fields = '__all__'


class ДисциплинаSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Дисциплина"""
    class Meta:
        model = Дисциплина
        fields = '__all__'


class ПубликацияSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Публикация"""
    class Meta:
        model = Публикация
        fields = '__all__'


class ДополнительнаяНагрузкаSerializer(serializers.ModelSerializer):
    """Сериализатор для модели ДополнительнаяНагрузка"""
    class Meta:
        model = ДополнительнаяНагрузка
        fields = '__all__'


class ОтчетSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Отчет"""
    class Meta:
        model = Отчет
        fields = '__all__'
        read_only_fields = ['дата_создания']