import { useState, useEffect } from 'react';
import axios from 'axios';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    номер: '',
    вместимость: 1,
    тип: 'office',
    оборудование: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/аудитории/');
      setRooms(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/аудитории/', newRoom);
      alert('Аудитория добавлена!');
      setShowForm(false);
      setNewRoom({ номер: '', вместимость: 1, тип: 'office', оборудование: '' });
      fetchRooms();
    } catch (err) {
      alert('Ошибка при добавлении: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить аудиторию?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/аудитории/${id}/`);
        fetchRooms();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Аудитории</h2>
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
          {showForm ? 'Скрыть форму' : 'Добавить аудиторию'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddRoom} style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>Добавить аудиторию</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Номер аудитории:</label>
            <input
              type="text"
              value={newRoom.номер}
              onChange={(e) => setNewRoom({...newRoom, номер: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Вместимость:</label>
            <input
              type="number"
              value={newRoom.вместимость}
              onChange={(e) => setNewRoom({...newRoom, вместимость: Number(e.target.value)})}
              min="1"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Тип:</label>
            <select
              value={newRoom.тип}
              onChange={(e) => setNewRoom({...newRoom, тип: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="lecture">Лекционная</option>
              <option value="practice">Практическая</option>
              <option value="lab">Лаборатория</option>
              <option value="office">Кабинет преподавателя</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Оборудование:</label>
            <textarea
              value={newRoom.оборудование}
              onChange={(e) => setNewRoom({...newRoom, оборудование: e.target.value})}
              rows="3"
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

      {rooms.length === 0 ? (
        <p>Аудитории не найдены</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f3460', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Номер</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Тип</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Вместимость</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Оборудование</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{room.номер}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {room.тип === 'lecture' && 'Лекционная'}
                  {room.тип === 'practice' && 'Практическая'}
                  {room.тип === 'lab' && 'Лаборатория'}
                  {room.тип === 'office' && 'Кабинет преподавателя'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{room.вместимость}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{room.оборудование || '—'}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(room.id)}
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

export default RoomList;