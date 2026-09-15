import { useState, useEffect } from 'react';
import axios from 'axios';

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    название: '',
    код: '',
    часы_лекций: 0,
    часы_практик: 0,
    преподаватели: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, teachersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/дисциплины/'),
        axios.get('http://127.0.0.1:8000/api/преподаватели/')
      ]);
      setSubjects(subjectsRes.data.results || subjectsRes.data);
      setTeachers(teachersRes.data.results || teachersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/дисциплины/', newSubject);
      alert('Дисциплина добавлена!');
      setShowForm(false);
      setNewSubject({ название: '', код: '', часы_лекций: 0, часы_практик: 0, преподаватели: [] });
      fetchData();
    } catch (err) {
      alert('Ошибка при добавлении: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить дисциплину?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/дисциплины/${id}/`);
        fetchData();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  const toggleTeacher = (teacherId) => {
    const currentTeachers = newSubject.преподаватели;
    if (currentTeachers.includes(teacherId)) {
      setNewSubject({
        ...newSubject,
        преподаватели: currentTeachers.filter(id => id !== teacherId)
      });
    } else {
      setNewSubject({
        ...newSubject,
        преподаватели: [...currentTeachers, teacherId]
      });
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Дисциплины</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: showForm ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          {showForm ? 'Скрыть форму' : 'Добавить дисциплину'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSubject} style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>Добавить дисциплину</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Название дисциплины:</label>
            <input
              type="text"
              value={newSubject.название}
              onChange={(e) => setNewSubject({...newSubject, название: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Код дисциплины:</label>
            <input
              type="text"
              value={newSubject.код}
              onChange={(e) => setNewSubject({...newSubject, код: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Часы лекций:</label>
              <input
                type="number"
                value={newSubject.часы_лекций}
                onChange={(e) => setNewSubject({...newSubject, часы_лекций: Number(e.target.value)})}
                min="0"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Часы практик:</label>
              <input
                type="number"
                value={newSubject.часы_практик}
                onChange={(e) => setNewSubject({...newSubject, часы_практик: Number(e.target.value)})}
                min="0"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Преподаватели:</label>
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              border: '1px solid #ddd', 
              padding: '10px', 
              marginTop: '5px',
              backgroundColor: 'white'
            }}>
              {teachers.length === 0 ? (
                <p>Сначала добавьте преподавателей</p>
              ) : (
                teachers.map((teacher) => (
                  <label key={teacher.id} style={{ display: 'block', marginBottom: '5px' }}>
                    <input
                      type="checkbox"
                      checked={newSubject.преподаватели.includes(teacher.id)}
                      onChange={() => toggleTeacher(teacher.id)}
                      style={{ marginRight: '8px' }}
                    />
                    {teacher.фио} ({teacher.должность})
                  </label>
                ))
              )}
            </div>
          </div>

          <button type="submit" style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px'
          }}>
            Сохранить
          </button>
        </form>
      )}

      {subjects.length === 0 ? (
        <p>Дисциплины не найдены</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f3460', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Код</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Название</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Лекции</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Практики</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Преподаватели</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{subject.код}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{subject.название}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{subject.часы_лекций}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{subject.часы_практик}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {subject.преподаватели && subject.преподаватели.length > 0
                    ? subject.преподаватели.map(p => p.фио).join(', ')
                    : '—'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(subject.id)}
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

export default SubjectList;