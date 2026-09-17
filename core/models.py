from django.db import models


class Преподаватель(models.Model):
    """Модель преподавателя кафедры"""
    фио = models.CharField(max_length=200, verbose_name="ФИО")
    должность = models.CharField(max_length=100, verbose_name="Должность")
    ставка = models.FloatField(default=1.0, verbose_name="Размер ставки")
    email = models.EmailField(blank=True, verbose_name="Email")
    телефон = models.CharField(max_length=20, blank=True, verbose_name="Телефон")
    
    # Поля для рабочего места (разделены на корпус, этаж и аудиторию)
    корпус = models.CharField(max_length=10, blank=True, verbose_name="Корпус")
    этаж = models.IntegerField(blank=True, null=True, verbose_name="Этаж")
    аудитория = models.CharField(max_length=10, blank=True, verbose_name="Аудитория")

    class Meta:
        verbose_name = "Преподаватель"
        verbose_name_plural = "Преподаватели"
        ordering = ['фио']

    def __str__(self):
        return f"{self.фио} ({self.должность})"
    
    def полное_рабочее_место(self):
        """Возвращает полное рабочее место в формате 'Корпус X, этаж Y, аудитория Z'"""
        if self.корпус and self.этаж and self.аудитория:
            return f"Корпус {self.корпус}, этаж {self.этаж}, аудитория {self.аудитория}"
        elif self.корпус and self.аудитория:
            return f"Корпус {self.корпус}, аудитория {self.аудитория}"
        return ""


class Аудитория(models.Model):
    """Модель аудитории (рабочего места)"""
    номер = models.CharField(max_length=10, unique=True, verbose_name="Номер аудитории")
    вместимость = models.IntegerField(default=1, verbose_name="Вместимость")
    тип = models.CharField(max_length=50, choices=[
        ('lecture', 'Лекционная'),
        ('practice', 'Практическая'),
        ('lab', 'Лаборатория'),
        ('office', 'Кабинет преподавателя'),
    ], verbose_name="Тип аудитории")
    оборудование = models.TextField(blank=True, verbose_name="Оборудование")

    class Meta:
        verbose_name = "Аудитория"
        verbose_name_plural = "Аудитории"
        ordering = ['номер']

    def __str__(self):
        return f"Аудитория {self.номер} ({self.тип})"


class Дисциплина(models.Model):
    """Модель учебной дисциплины"""
    название = models.CharField(max_length=200, verbose_name="Название дисциплины")
    код = models.CharField(max_length=20, unique=True, verbose_name="Код дисциплины")
    часы_лекций = models.IntegerField(default=0, verbose_name="Часы лекций")
    часы_практик = models.IntegerField(default=0, verbose_name="Часы практик")
    преподаватели = models.ManyToManyField(
        Преподаватель, 
        blank=True, 
        verbose_name="Преподаватели"
    )

    class Meta:
        verbose_name = "Дисциплина"
        verbose_name_plural = "Дисциплины"
        ordering = ['название']

    def __str__(self):
        return f"{self.код} - {self.название}"


class Публикация(models.Model):
    """Модель научной публикации"""
    название = models.CharField(max_length=300, verbose_name="Название публикации")
    год = models.IntegerField(verbose_name="Год публикации")
    тип = models.CharField(max_length=50, choices=[
        ('article', 'Статья'),
        ('conference', 'Конференция'),
        ('book', 'Книга'),
        ('patent', 'Патент'),
    ], verbose_name="Тип публикации")
    авторы = models.ManyToManyField(
        Преподаватель, 
        related_name='публикации',
        verbose_name="Авторы"
    )
    журнал = models.CharField(max_length=200, blank=True, verbose_name="Журнал/Издание")
    страницы = models.CharField(max_length=50, blank=True, verbose_name="Страницы")

    class Meta:
        verbose_name = "Публикация"
        verbose_name_plural = "Публикации"
        ordering = ['-год', 'название']

    def __str__(self):
        return f"{self.название} ({self.год})"


class ДополнительнаяНагрузка(models.Model):
    """Модель дополнительной нагрузки преподавателя"""
    преподаватель = models.ForeignKey(
        Преподаватель, 
        on_delete=models.CASCADE,
        related_name='доп_нагрузка',
        verbose_name="Преподаватель"
    )
    тип = models.CharField(max_length=100, choices=[
        ('curator', 'Кураторство'),
        ('practice', 'Руководство практикой'),
        ('diploma', 'Руководство ВКР'),
        ('research', 'Научная работа'),
        ('methodical', 'Методическая работа'),
    ], verbose_name="Тип нагрузки")
    описание = models.TextField(verbose_name="Описание")
    часы = models.IntegerField(default=0, verbose_name="Количество часов")

    class Meta:
        verbose_name = "Дополнительная нагрузка"
        verbose_name_plural = "Дополнительные нагрузки"

    def __str__(self):
        return f"{self.преподаватель.фио} - {self.тип}"


class Отчет(models.Model):
    """Модель отчета"""
    тип = models.CharField(max_length=100, choices=[
        ('load', 'Отчет по нагрузке'),
        ('publications', 'Отчет по публикациям'),
        ('staff', 'Отчет по сотрудникам'),
    ], verbose_name="Тип отчета")
    дата_создания = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    данные = models.TextField(verbose_name="Данные отчета")

    class Meta:
        verbose_name = "Отчет"
        verbose_name_plural = "Отчеты"
        ordering = ['-дата_создания']

    def __str__(self):
        return f"{self.тип} от {self.дата_создания.strftime('%d.%m.%Y')}"

class Бронирование(models.Model):
    """Модель бронирования аудиторий"""
    аудитория = models.ForeignKey(
        Аудитория,
        on_delete=models.CASCADE,
        related_name='бронирования',
        verbose_name="Аудитория"
    )
    преподаватель = models.ForeignKey(
        Преподаватель,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='бронирования',
        verbose_name="Преподаватель"
    )
    день_недели = models.CharField(
        max_length=10,
        choices=[
            ('monday', 'Понедельник'),
            ('tuesday', 'Вторник'),
            ('wednesday', 'Среда'),
            ('thursday', 'Четверг'),
            ('friday', 'Пятница'),
            ('saturday', 'Суббота'),
        ],
        verbose_name="День недели"
    )
    время_начала = models.TimeField(verbose_name="Время начала")
    время_окончания = models.TimeField(verbose_name="Время окончания")
    тип_занятия = models.CharField(
        max_length=50,
        choices=[
            ('lecture', 'Лекция'),
            ('practice', 'Практика'),
            ('lab', 'Лабораторная'),
            ('exam', 'Экзамен'),
            ('consultation', 'Консультация'),
            ('other', 'Другое'),
        ],
        verbose_name="Тип занятия"
    )
    описание = models.TextField(blank=True, verbose_name="Описание")
    активно = models.BooleanField(default=True, verbose_name="Активно")
    дата_создания = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Бронирование"
        verbose_name_plural = "Бронирования"
        ordering = ['день_недели', 'время_начала']

    def __str__(self):
        return f"{self.аудитория.номер} ({self.get_день_недели_display()}) {self.время_начала}-{self.время_окончания}"

    def статус_сейчас(self):
        """Проверяет, занята ли аудитория сейчас"""
        from django.utils import timezone
        now = timezone.now()
        
        # Проверяем день недели
        day_map = {
            0: 'monday', 1: 'tuesday', 2: 'wednesday',
            3: 'thursday', 4: 'friday', 5: 'saturday'
        }
        current_day = day_map.get(now.weekday())
        
        if current_day != self.день_недели:
            return False
        
        # Проверяем время
        current_time = now.time()
        return self.время_начала <= current_time <= self.время_окончания