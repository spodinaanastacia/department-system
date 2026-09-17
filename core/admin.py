from django.contrib import admin
from .models import (
    Преподаватель,
    Аудитория,
    Дисциплина,
    Публикация,
    ДополнительнаяНагрузка,
    Отчет,
    Бронирование
)


@admin.register(Преподаватель)
class ПреподавательAdmin(admin.ModelAdmin):
    """Админка для модели Преподаватель с группировкой полей"""
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('фио', 'должность', 'ставка', 'email', 'телефон'),
        }),
        ('Рабочее место', {
            'fields': ('корпус', 'этаж', 'аудитория'),
            'description': 'Укажите расположение рабочего места преподавателя',
        }),
    )
    
    list_display = ('фио', 'должность', 'ставка', 'полное_рабочее_место', 'email')
    search_fields = ('фио', 'должность', 'корпус', 'аудитория')
    list_filter = ('должность', 'корпус', 'этаж')


@admin.register(Аудитория)
class АудиторияAdmin(admin.ModelAdmin):
    list_display = ('номер', 'тип', 'вместимость')
    list_filter = ('тип',)


@admin.register(Дисциплина)
class ДисциплинаAdmin(admin.ModelAdmin):
    list_display = ('код', 'название', 'часы_лекций', 'часы_практик')
    search_fields = ('название', 'код')
    filter_horizontal = ('преподаватели',)


@admin.register(Публикация)
class ПубликацияAdmin(admin.ModelAdmin):
    list_display = ('название', 'год', 'тип', 'журнал')
    list_filter = ('год', 'тип')
    search_fields = ('название',)
    filter_horizontal = ('авторы',)


@admin.register(ДополнительнаяНагрузка)
class ДополнительнаяНагрузкаAdmin(admin.ModelAdmin):
    list_display = ('преподаватель', 'тип', 'часы')
    list_filter = ('тип',)


@admin.register(Отчет)
class ОтчетAdmin(admin.ModelAdmin):
    list_display = ('тип', 'дата_создания')
    list_filter = ('тип', 'дата_создания')


@admin.register(Бронирование)
class БронированиеAdmin(admin.ModelAdmin):
    list_display = ('аудитория', 'преподаватель', 'день_недели', 'время_начала', 'время_окончания', 'активно')
    list_filter = ('день_недели', 'активно', 'аудитория')
    search_fields = ('аудитория__номер', 'преподаватель__фио')