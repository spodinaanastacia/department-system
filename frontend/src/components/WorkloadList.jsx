import { useState, useEffect } from 'react';
import axios from 'axios';

function WorkloadList() {
  const [workloads, setWorkloads] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newWorkload, setNewWorkload] = useState({
    преподаватель: '',
    тип: 'curator',
    описание: '',
    часы: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workloadsRes, teachersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/нагрузка/'),
        axios.get('http://127.0.0.1:8000/api/преподаватели/')
      ]);
      setWorkloads(workloadsRes.data.results || workloadsRes.data);
      setTeachers(teachersRes.data.results || teachersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setLoading(false);
    }
  };

  const handleAddWorkload = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/нагрузка/', newWorkload);
      alert('Нагрузка добавлена!');
      setShowForm(false);
      setNewWorkload({ преподаватель: '', тип: 'curator', описание: '', часы: 0 });
      fetchData();
    } catch (err) {
      alert('Ошибка при добавлении: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить запись о нагрузке?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/нагрузка/${id}/`);
        fetchData();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'curator': 'Кураторство',
      'practice': 'Руководство практикой',
      'diploma': 'Руководство ВКР',
      'research': 'Научная работа',
      'methodical': 'Методическая работа'
    };
    return types[type] || type;
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Дополнительная нагрузка</h2>
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
          {showForm ? 'Скрыть форму' : 'Добавить нагрузку'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddWorkload} style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>Добавить дополнительную нагрузку</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Преподаватель:</label>
            <select
              value={newWorkload.преподаватель}
              onChange={(e) => setNewWorkload({...newWorkload, преподаватель: Number(e.target.value)})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Выберите преподавателя</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.фио} ({teacher.должность})
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Тип нагрузки:</label>
            <select
              value={newWorkload.тип}
              onChange={(e) => setNewWorkload({...newWorkload, тип: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="curator">Кураторство</option>
              <option value="practice">Руководство практикой</option>
              <option value="diploma">Руководство ВКР</option>
              <option value="research">Научная работа</option>
              <option value="methodical">Методическая работа</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Описание:</label>
            <textarea
              value={newWorkload.описание}
              onChange={(e) => setNewWorkload({...newWorkload, описание: e.target.value})}
              required
              rows="3"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Например: Кураторство группы ИВТ-101"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Количество часов:</label>
            <input
              type="number"
              value={newWorkload.часы}
              onChange={(e) => setNewWorkload({...newWorkload, часы: Number(e.target.value)})}
              min="0"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
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

      {workloads.length === 0 ? (
        <p>Записи о дополнительной нагрузке не найдены</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f3460', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Преподаватель</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Тип нагрузки</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Описание</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Часы</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {workloads.map((workload) => (
              <tr key={workload.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {workload.преподаватель_фио || `ID: ${workload.преподаватель}`}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {getTypeLabel(workload.тип)}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{workload.описание}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{workload.часы}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(workload.id)}
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

export default WorkloadList;