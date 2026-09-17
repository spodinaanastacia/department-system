import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/преподаватели/`);
      setTeachers(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message);
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
      try {
        await axios.delete(`${API_URL}/api/преподаватели/${id}/`);
        fetchTeachers();
      } catch (err) {
        alert('Ошибка при удалении');
        console.error(err);
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Список преподавателей</h2>
      {teachers.length === 0 ? (
        <p>Преподаватели не найдены. Добавьте первого преподавателя через форму выше.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f3460', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>ФИО</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Должность</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Ставка</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Рабочее место</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{teacher.фио}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{teacher.должность}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{teacher.ставка}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {teacher.корпус && teacher.аудитория
                    ? `Корпус ${teacher.корпус}, ауд. ${teacher.аудитория}`
                    : 'Не указано'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{teacher.email || '—'}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TeacherList;