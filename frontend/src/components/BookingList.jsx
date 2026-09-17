import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    аудитория: '',
    преподаватель: '',
    день_недели: 'monday',
    время_начала: '09:00',
    время_окончания: '10:30',
    тип_занятия: 'lecture',
    описание: '',
    активно: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, roomsRes, teachersRes] = await Promise.all([
        axios.get(`${API_URL}/api/бронирования/`),
        axios.get(`${API_URL}/api/аудитории/`),
        axios.get(`${API_URL}/api/преподаватели/`)
      ]);
      setBookings(bookingsRes.data.results || bookingsRes.data);
      setRooms(roomsRes.data.results || roomsRes.data);
      setTeachers(teachersRes.data.results || teachersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setLoading(false);
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/бронирования/`, {
        ...newBooking,
        аудитория: Number(newBooking.аудитория),
        преподаватель: newBooking.преподаватель ? Number(newBooking.преподаватель) : null
      });
      alert('Бронирование добавлено!');
      setShowForm(false);
      setNewBooking({
        аудитория: '',
        преподаватель: '',
        день_недели: 'monday',
        время_начала: '09:00',
        время_окончания: '10:30',
        тип_занятия: 'lecture',
        описание: '',
        активно: true
      });
      fetchData();
    } catch (err) {
      alert('Ошибка при добавлении: ' + err.message);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/api/бронирования/${id}/`, {
        активно: !currentStatus
      });
      fetchData();
    } catch (err) {
      alert('Ошибка при изменении статуса');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить бронирование?')) {
      try {
        await axios.delete(`${API_URL}/api/бронирования/${id}/`);
        fetchData();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  const getDayLabel = (day) => {
    const days = {
      'monday': 'Понедельник',
      'tuesday': 'Вторник',
      'wednesday': 'Среда',
      'thursday': 'Четверг',
      'friday': 'Пятница',
      'saturday': 'Суббота'
    };
    return days[day] || day;
  };

  const getTypeLabel = (type) => {
    const types = {
      'lecture': 'Лекция',
      'practice': 'Практика',
      'lab': 'Лабораторная',
      'exam': 'Экзамен',
      'consultation': 'Консультация',
      'other': 'Другое'
    };
    return types[type] || type;
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Бронирование аудиторий</h2>
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
          {showForm ? 'Скрыть форму' : 'Забронировать аудиторию'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddBooking} style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>Новое бронирование</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Аудитория: *</label>
            <select
              value={newBooking.аудитория}
              onChange={(e) => setNewBooking({...newBooking, аудитория: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Выберите аудиторию</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Аудитория {room.номер} ({room.тип === 'lecture' ? 'Лекционная' : room.тип === 'practice' ? 'Практическая' : room.тип === 'lab' ? 'Лаборатория' : 'Кабинет'})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Преподаватель:</label>
            <select
              value={newBooking.преподаватель}
              onChange={(e) => setNewBooking({...newBooking, преподаватель: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Не указан</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.фио}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>День недели: *</label>
              <select
                value={newBooking.день_недели}
                onChange={(e) => setNewBooking({...newBooking, день_недели: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="monday">Понедельник</option>
                <option value="tuesday">Вторник</option>
                <option value="wednesday">Среда</option>
                <option value="thursday">Четверг</option>
                <option value="friday">Пятница</option>
                <option value="saturday">Суббота</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>Тип занятия: *</label>
              <select
                value={newBooking.тип_занятия}
                onChange={(e) => setNewBooking({...newBooking, тип_занятия: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="lecture">Лекция</option>
                <option value="practice">Практика</option>
                <option value="lab">Лабораторная</option>
                <option value="exam">Экзамен</option>
                <option value="consultation">Консультация</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Время начала: *</label>
              <input
                type="time"
                value={newBooking.время_начала}
                onChange={(e) => setNewBooking({...newBooking, время_начала: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Время окончания: *</label>
              <input
                type="time"
                value={newBooking.время_окончания}
                onChange={(e) => setNewBooking({...newBooking, время_окончания: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Описание:</label>
            <textarea
              value={newBooking.описание}
              onChange={(e) => setNewBooking({...newBooking, описание: e.target.value})}
              rows="2"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Например: Лекция по математике для группы ИВТ-101"
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
            Забронировать
          </button>
        </form>
      )}

      {bookings.length === 0 ? (
        <p>Бронирования не найдены. Нажмите кнопку выше, чтобы создать первое бронирование.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              style={{ 
                backgroundColor: booking.активно ? 'white' : '#f5f5f5',
                border: `2px solid ${booking.активно ? '#28a745' : '#dc3545'}`,
                borderRadius: '8px', 
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: booking.активно ? 1 : 0.6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#0f3460' }}>
                  Аудитория {booking.аудитория_номер || booking.аудитория}
                  <span style={{ 
                    marginLeft: '10px', 
                    padding: '4px 8px', 
                    backgroundColor: booking.статус === 'Занято' ? '#dc3545' : '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {booking.статус}
                  </span>
                </h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleToggleActive(booking.id, booking.активно)}
                    style={{
                      backgroundColor: booking.активно ? '#ffc107' : '#28a745',
                      color: 'black',
                      border: 'none',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {booking.активно ? 'Разбронировать' : 'Активировать'}
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
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
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
                <div><strong>День:</strong> {getDayLabel(booking.день_недели)}</div>
                <div><strong>Время:</strong> {booking.время_начала} - {booking.время_окончания}</div>
                <div><strong>Тип:</strong> {getTypeLabel(booking.тип_занятия)}</div>
                {booking.преподаватель_фио && <div><strong>Преподаватель:</strong> {booking.преподаватель_фио}</div>}
              </div>
              
              {booking.описание && (
                <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                  {booking.описание}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;