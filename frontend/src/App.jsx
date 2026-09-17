import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import TeacherList from './components/TeacherList';
import TeacherForm from './components/TeacherForm';
import RoomList from './components/RoomList';
import SubjectList from './components/SubjectList';
import PublicationList from './components/PublicationList';
import WorkloadList from './components/WorkloadList';
import ReportList from './components/ReportList';
import BookingList from './components/BookingList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTeacherAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Router>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif' 
      }}>
        {/* Заголовок и навигация */}
        <header style={{ 
          backgroundColor: '#0f3460', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h1 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>
             Информационная система кафедры
          </h1>
          
          <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link 
              to="/" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Главная
            </Link>
            <Link 
              to="/teachers" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Преподаватели
            </Link>
            <Link 
              to="/rooms" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Аудитории
            </Link>
            <Link 
              to="/bookings" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Бронирования
            </Link>
            <Link 
              to="/subjects" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Дисциплины
            </Link>
            <Link 
              to="/publications" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Публикации
            </Link>
            <Link 
              to="/workload" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Нагрузка
            </Link>
            <Link 
              to="/reports" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#16537e',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1a6496'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16537e'}
            >
               Отчёты
            </Link>
          </nav>
        </header>

        {/* Основной контент */}
        <main>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Добро пожаловать в информационную систему кафедры!</h2>
                <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
                  Система предназначена для секретаря кафедры и позволяет:
                </p>
                <ul style={{ 
                  textAlign: 'left', 
                  maxWidth: '600px', 
                  margin: '30px auto',
                  fontSize: '16px',
                  lineHeight: '2'
                }}>
                  <li>Управлять списком преподавателей</li>
                  <li>Вести учёт аудиторий и рабочих мест</li>
                  <li>Бронировать аудитории для занятий</li>
                  <li>Отслеживать преподаваемые дисциплины</li>
                  <li>Учитывать научные публикации</li>
                  <li>Фиксировать дополнительную нагрузку</li>
                  <li>Формировать отчёты</li>
                </ul>
                <p style={{ marginTop: '30px' }}>
                  Выберите раздел в меню выше для начала работы.
                </p>
              </div>
            } />
            
            <Route path="/teachers" element={
              <>
                <TeacherForm onTeacherAdded={handleTeacherAdded} />
                <TeacherList key={refreshKey} />
              </>
            } />
            
            <Route path="/rooms" element={<RoomList />} />
            
            <Route path="/bookings" element={<BookingList />} />
            
            <Route path="/subjects" element={<SubjectList />} />
            
            <Route path="/publications" element={<PublicationList />} />
            
            <Route path="/workload" element={<WorkloadList />} />
            
            <Route path="/reports" element={<ReportList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;