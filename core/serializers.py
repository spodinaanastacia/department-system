from rest_framework import serializers
from .models import (
    Преподаватель,
    Аудитория,
    Дисциплина,
    Публикация,
    ДополнительнаяНагрузка,
    Отчет,
    Бронирование
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


class БронированиеSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Бронирование"""
    статус = serializers.SerializerMethodField()
    аудитория_номер = serializers.CharField(source='аудитория.номер', read_only=True)
    преподаватель_фио = serializers.CharField(source='преподаватель.фио', read_only=True, default='')
    
    class Meta:
        model = Бронирование
        fields = '__all__'
    
    def get_статус(self, obj):
        return 'Занято' if obj.статус_сейчас() else 'Свободно'