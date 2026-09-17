import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function TeacherForm({ onTeacherAdded }) {
  const [formData, setFormData] = useState({
    фио: '',
    должность: '',
    ставка: 1.0,
    email: '',
    телефон: '',
    корпус: '',
    этаж: '',
    аудитория: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ставка' || name === 'этаж' ? (value === '' ? '' : Number(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/преподаватели/`, formData);
      alert('Преподаватель успешно добавлен!');
      setFormData({
        фио: '',
        должность: '',
        ставка: 1.0,
        email: '',
        телефон: '',
        корпус: '',
        этаж: '',
        аудитория: ''
      });
      if (onTeacherAdded) {
        onTeacherAdded();
      }
    } catch (err) {
      alert('Ошибка при добавлении преподавателя: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
      <h3>Добавить преподавателя</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>ФИО: *</label>
          <input
            type="text"
            name="фио"
            value={formData.фио}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Должность: *</label>
          <input
            type="text"
            name="должность"
            value={formData.должность}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Ставка:</label>
          <input
            type="number"
            name="ставка"
            value={formData.ставка}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="2"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Телефон:</label>
          <input
            type="text"
            name="телефон"
            value={formData.телефон}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Рабочее место</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Корпус:</label>
            <input
              type="text"
              name="корпус"
              value={formData.корпус}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Этаж:</label>
            <input
              type="number"
              name="этаж"
              value={formData.этаж}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Аудитория:</label>
            <input
              type="text"
              name="аудитория"
              value={formData.аудитория}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          Добавить преподавателя
        </button>
      </form>
    </div>
  );
}

export default TeacherForm;