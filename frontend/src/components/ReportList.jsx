import { useState, useEffect } from 'react';
import axios from 'axios';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/отчеты/');
      setReports(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setLoading(false);
    }
  };

  const generateReport = async (type) => {
    setGenerating(true);
    try {
      // Получаем все необходимые данные
      const [teachersRes, workloadsRes, publicationsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/преподаватели/'),
        axios.get('http://127.0.0.1:8000/api/нагрузка/'),
        axios.get('http://127.0.0.1:8000/api/публикации/')
      ]);

      const teachers = teachersRes.data.results || teachersRes.data;
      const workloads = workloadsRes.data.results || workloadsRes.data;
      const publications = publicationsRes.data.results || publicationsRes.data;

      let reportData = '';
      let reportType = '';

      if (type === 'staff') {
        reportType = 'Отчет по сотрудникам';
        reportData = `ОТЧЕТ ПО СОТРУДНИКАМ КАФЕДРЫ\n`;
        reportData += `Дата формирования: ${new Date().toLocaleString('ru-RU')}\n`;
        reportData += `${'='.repeat(60)}\n\n`;
        reportData += `Всего преподавателей: ${teachers.length}\n\n`;
        
        teachers.forEach((teacher, index) => {
          reportData += `${index + 1}. ${teacher.фио}\n`;
          reportData += `   Должность: ${teacher.должность}\n`;
          reportData += `   Ставка: ${teacher.ставка}\n`;
          if (teacher.корпус && teacher.аудитория) {
            reportData += `   Рабочее место: Корпус ${teacher.корпус}, ауд. ${teacher.аудитория}\n`;
          }
          if (teacher.email) {
            reportData += `   Email: ${teacher.email}\n`;
          }
          reportData += `\n`;
        });

      } else if (type === 'load') {
        reportType = 'Отчет по нагрузке';
        reportData = `ОТЧЕТ ПО ДОПОЛНИТЕЛЬНОЙ НАГРУЗКЕ\n`;
        reportData += `Дата формирования: ${new Date().toLocaleString('ru-RU')}\n`;
        reportData += `${'='.repeat(60)}\n\n`;
        
        const totalHours = workloads.reduce((sum, w) => sum + w.часы, 0);
        reportData += `Всего записей о нагрузке: ${workloads.length}\n`;
        reportData += `Общее количество часов: ${totalHours}\n\n`;

        const typeLabels = {
          'curator': 'Кураторство',
          'practice': 'Руководство практикой',
          'diploma': 'Руководство ВКР',
          'research': 'Научная работа',
          'methodical': 'Методическая работа'
        };

        workloads.forEach((workload, index) => {
          reportData += `${index + 1}. Преподаватель ID: ${workload.преподаватель}\n`;
          reportData += `   Тип: ${typeLabels[workload.тип] || workload.тип}\n`;
          reportData += `   Описание: ${workload.описание}\n`;
          reportData += `   Часы: ${workload.часы}\n\n`;
        });

      } else if (type === 'publications') {
        reportType = 'Отчет по публикациям';
        reportData = `ОТЧЕТ ПО НАУЧНЫМ ПУБЛИКАЦИЯМ\n`;
        reportData += `Дата формирования: ${new Date().toLocaleString('ru-RU')}\n`;
        reportData += `${'='.repeat(60)}\n\n`;
        
        reportData += `Всего публикаций: ${publications.length}\n\n`;

        const typeLabels = {
          'article': 'Статья',
          'conference': 'Конференция',
          'book': 'Книга',
          'patent': 'Патент'
        };

        publications.forEach((pub, index) => {
          reportData += `${index + 1}. ${pub.название}\n`;
          reportData += `   Год: ${pub.год}\n`;
          reportData += `   Тип: ${typeLabels[pub.тип] || pub.тип}\n`;
          if (pub.журнал) {
            reportData += `   Журнал: ${pub.журнал}\n`;
          }
          if (pub.страницы) {
            reportData += `   Страницы: ${pub.страницы}\n`;
          }
          reportData += `\n`;
        });
      }

      // Создаём отчёт в базе данных
      await axios.post('http://127.0.0.1:8000/api/отчеты/', {
        тип: type,
        данные: reportData
      });

      alert(`${reportType} успешно сформирован!`);
      fetchReports();
    } catch (err) {
      alert('Ошибка при формировании отчёта: ' + err.message);
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить отчёт?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/отчеты/${id}/`);
        fetchReports();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'staff': 'Отчет по сотрудникам',
      'load': 'Отчет по нагрузке',
      'publications': 'Отчет по публикациям'
    };
    return types[type] || type;
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Отчёты</h2>
      
      {/* Кнопки генерации отчётов */}
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h3>Сформировать новый отчёт</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Выберите тип отчёта для автоматической генерации:
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => generateReport('staff')}
            disabled={generating}
            style={{
              backgroundColor: generating ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              cursor: generating ? 'not-allowed' : 'pointer',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            {generating ? 'Формирование...' : '📋 Отчет по сотрудникам'}
          </button>
          
          <button
            onClick={() => generateReport('load')}
            disabled={generating}
            style={{
              backgroundColor: generating ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              cursor: generating ? 'not-allowed' : 'pointer',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            {generating ? 'Формирование...' : '⏱️ Отчет по нагрузке'}
          </button>
          
          <button
            onClick={() => generateReport('publications')}
            disabled={generating}
            style={{
              backgroundColor: generating ? '#6c757d' : '#ffc107',
              color: 'black',
              border: 'none',
              padding: '12px 24px',
              cursor: generating ? 'not-allowed' : 'pointer',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            {generating ? 'Формирование...' : ' Отчет по публикациям'}
          </button>
        </div>
      </div>

      {/* Список отчётов */}
      <h3>История отчётов</h3>
      {reports.length === 0 ? (
        <p>Отчёты ещё не формировались. Нажмите на одну из кнопок выше.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reports.map((report) => (
            <div 
              key={report.id} 
              style={{ 
                backgroundColor: 'white', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#0f3460' }}>
                  {getTypeLabel(report.тип)}
                </h4>
                <button
                  onClick={() => handleDelete(report.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  Удалить
                </button>
              </div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                Создан: {new Date(report.дата_создания).toLocaleString('ru-RU')}
              </p>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '5px', 
                overflowX: 'auto',
                fontSize: '13px',
                lineHeight: '1.6',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {report.данные}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportList;