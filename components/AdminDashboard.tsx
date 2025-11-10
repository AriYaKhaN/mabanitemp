'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  studentCode: string;
  section: string;
  ta: string;
  createdAt: string;
  quizGrade?: number;
}

interface Admin {
  id: string;
  fullName: string;
  email: string;
  taId: number;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [quizGrade, setQuizGrade] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/login');
      return;
    }

    const adminInfo: Admin = JSON.parse(adminData);
    setAdmin(adminInfo);
    fetchStudents(adminInfo.taId);
  }, [router]);

  const fetchStudents = async (taId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/students?taId=${taId}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('خطا در دریافت اطلاعات دانشجویان');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/login');
  };

  const handleAddQuizGrade = (student: Student) => {
    setSelectedStudent(student);
    setQuizGrade(student.quizGrade?.toString() || '');
    setShowQuizModal(true);
  };

  const submitQuizGrade = async () => {
    if (!selectedStudent || !quizGrade) return;

    try {
      const response = await fetch('/api/admin/quiz-grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          quizGrade: parseInt(quizGrade),
          taId: admin?.taId
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedStudents = students.map(student =>
          student.id === selectedStudent.id
            ? { ...student, quizGrade: parseInt(quizGrade) }
            : student
        );
        setStudents(updatedStudents);
        setShowQuizModal(false);
        setSelectedStudent(null);
        setQuizGrade('');
        alert('✅ نمره با موفقیت ثبت شد');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('خطا در ثبت نمره');
    }
  };
//
  if (!admin) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* هدر */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">👑</div>
              <div className="logo-text">
                <h1>پنل مدیریت {admin.role === 'super_admin' ? 'ادمین کل' : `TA ${admin.taId}`}</h1>
                <p>{admin.fullName} • {admin.email}</p>
              </div>
            </div>
            
            <div className="header-actions">
              <div className="student-count">
                📊 {students.length} دانشجو
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* کارت‌های آمار */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">👥</div>
            <h3>کل دانشجویان</h3>
            <div className="stat-number total">{students.length}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon graded">📝</div>
            <h3>دارای نمره</h3>
            <div className="stat-number graded">
              {students.filter(s => s.quizGrade).length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon ungraded">⏰</div>
            <h3>بدون نمره</h3>
            <div className="stat-number ungraded">
              {students.filter(s => !s.quizGrade).length}
            </div>
          </div>
        </div>

        {/* جدول دانشجویان */}
        <div className="table-container">
          <div className="table-header">
            <h2>📋 لیست دانشجویان {admin.role === 'ta' && `(TA ${admin.taId})`}</h2>
            <div className="table-time">
              آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>در حال دریافت اطلاعات دانشجویان...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>هیچ دانشجویی یافت نشد</p>
              <p>
                {admin.role === 'ta' 
                  ? 'هیچ دانشجویی برای TA شما ثبت نشده است' 
                  : 'هنوز دانشجویی در سیستم ثبت نشده است'
                }
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>نام دانشجو</th>
                    <th>شماره دانشجویی</th>
                    <th>سکشن</th>
                    <th>TA</th>
                    <th>نمره هوم ورک</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name">{student.name}</div>
                      </td>
                      <td>
                        <div className="student-code">{student.studentCode}</div>
                      </td>
                      <td>{student.section}</td>
                      <td>
                        <span className="ta-badge">TA {student.ta}</span>
                      </td>
                      <td>
                        {student.quizGrade ? (
                          <span className="grade-badge has-grade">
                            {student.quizGrade}
                          </span>
                        ) : (
                          <span className="grade-badge no-grade">
                            ثبت نشده
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleAddQuizGrade(student)}
                          className={`action-btn ${student.quizGrade ? 'edit' : ''}`}
                        >
                          {student.quizGrade ? '✏️ ویرایش' : '➕ ثبت نمره'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* مودال ثبت نمره */}
      {showQuizModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>📝 ثبت نمره هوم ورک</h3>
              <button 
                className="close-btn"
                onClick={() => setShowQuizModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="student-info">
              <div className="student-name">{selectedStudent.name}</div>
              <div className="student-details">
                <span>شماره: {selectedStudent.studentCode}</span>
                <span>سکشن: {selectedStudent.section}</span>
                <span>TA: {selectedStudent.ta}</span>
              </div>
            </div>

            <div className="form-group">
              <label>نمره هوم ورک (0-20)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={quizGrade}
                onChange={(e) => setQuizGrade(e.target.value)}
                className="form-input"
                placeholder="مثال: 17"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={submitQuizGrade}
                disabled={!quizGrade}
                className="submit-btn"
              >
                ✅ ثبت نمره
              </button>
              <button
                onClick={() => setShowQuizModal(false)}
                className="cancel-btn"
              >
                ❌ انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}