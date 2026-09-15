import { useState, useEffect } from 'react';
import axios from 'axios';

function PublicationList() {
  const [publications, setPublications] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPublication, setNewPublication] = useState({
    название: '',
    год: new Date().getFullYear(),
    тип: 'article',
    журнал: '',
    страницы: '',
    авторы: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [publicationsRes, teachersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/публикации/'),
        axios.get('http://127.0.0.1:8000/api/преподаватели/')
      ]);
      setPublications(publicationsRes.data.results || publicationsRes.data);
      setTeachers(teachersRes.data.results || teachersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setLoading(false);
    }
  };

  const handleAddPublication = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/публикации/', newPublication);
      alert('Публикация добавлена!');
      setShowForm(false);
      setNewPublication({
        название: '',
        год: new Date().getFullYear(),
        тип: 'article',
        журнал: '',
        страницы: '',
        авторы: []
      });
      fetchData();
    } catch (err) {
      alert('Ошибка при добавлении: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить публикацию?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/публикации/${id}/`);
        fetchData();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  const toggleAuthor = (teacherId) => {
    const currentAuthors = newPublication.авторы;
    if (currentAuthors.includes(teacherId)) {
      setNewPublication({
        ...newPublication,
        авторы: currentAuthors.filter(id => id !== teacherId)
      });
    } else {
      setNewPublication({
        ...newPublication,
        авторы: [...currentAuthors, teacherId]
      });
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'article': 'Статья',
      'conference': 'Конференция',
      'book': 'Книга',
      'patent': 'Патент'
    };
    return types[type] || type;
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Научные публикации</h2>
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
          {showForm ? 'Скрыть форму' : 'Добавить публикацию'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPublication} style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>Добавить публикацию</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Название публикации:</label>
            <input
              type="text"
              value={newPublication.название}
              onChange={(e) => setNewPublication({...newPublication, название: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Год публикации:</label>
              <input
                type="number"
                value={newPublication.год}
                onChange={(e) => setNewPublication({...newPublication, год: Number(e.target.value)})}
                min="1900"
                max="2100"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Тип публикации:</label>
              <select
                value={newPublication.тип}
                onChange={(e) => setNewPublication({...newPublication, тип: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="article">Статья</option>
                <option value="conference">Конференция</option>
                <option value="book">Книга</option>
                <option value="patent">Патент</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Журнал/Издание:</label>
            <input
              type="text"
              value={newPublication.журнал}
              onChange={(e) => setNewPublication({...newPublication, журнал: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Страницы:</label>
            <input
              type="text"
              value={newPublication.страницы}
              onChange={(e) => setNewPublication({...newPublication, страницы: e.target.value})}
              placeholder="например: 123-130"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Авторы:</label>
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
                      checked={newPublication.авторы.includes(teacher.id)}
                      onChange={() => toggleAuthor(teacher.id)}
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

      {publications.length === 0 ? (
        <p>Публикации не найдены</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f3460', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Название</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Год</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Тип</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Журнал</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Авторы</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub) => (
              <tr key={pub.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{pub.название}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{pub.год}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{getTypeLabel(pub.тип)}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{pub.журнал || '—'}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {pub.авторы && pub.авторы.length > 0
                    ? pub.авторы.map(a => a.фио).join(', ')
                    : '—'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(pub.id)}
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

export default PublicationList;