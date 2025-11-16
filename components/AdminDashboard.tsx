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
  hw1File?: string;
  hw2File?: string;
  hw3File?: string;
  hw1record?: string;
  gradedBy?: number;
  updatedAt?: string;
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
  const [description, setDescription] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTa, setFilterTa] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }

    const adminInfo: Admin = JSON.parse(adminData);
    setAdmin(adminInfo);
    fetchStudents(adminInfo.taId);
  }, [router, refreshTrigger]);

  const fetchStudents = async (taId: number) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/admin/students?taId=${taId}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      } else {
        setError(data.error || 'خطا در دریافت اطلاعات دانشجویان');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (studentId: string, fileType: string, fileName: string) => {
    try {
      setDownloading(`${studentId}-${fileType}`);
      
      const response = await fetch(`/api/admin/download?studentId=${studentId}&fileType=${fileType}`);
      const data = await response.json();

      if (data.success) {
        // ایجاد لینک دانلود مستقیم
        const link = document.createElement('a');
        link.href = data.fileUrl;
        link.download = fileName || data.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // نمایش پیام موفقیت
        setTimeout(() => {
          alert(`فایل ${fileName} با موفقیت دانلود شد`);
        }, 500);
      } else {
        alert(`خطا در دانلود فایل: ${data.error}`);
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور');
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddQuizGrade = (student: Student) => {
    setSelectedStudent(student);
    setQuizGrade(student.quizGrade?.toString() || '');
    setDescription(student.hw1record || '');
    setShowQuizModal(true);
  };

  const submitQuizGrade = async () => {
    if (!selectedStudent || !quizGrade) return;

    const grade = parseInt(quizGrade);
    if (grade < 0 || grade > 20) {
      alert('نمره باید بین 0 تا 20 باشد');
      return;
    }

    try {
      const response = await fetch('/api/admin/quiz-grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          quizGrade: grade,
          taId: admin?.taId,
          description: description
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedStudents = students.map(student =>
          student.id === selectedStudent.id
            ? { 
                ...student, 
                quizGrade: grade,
                hw1record: description 
              }
            : student
        );
        setStudents(updatedStudents);
        setShowQuizModal(false);
        setSelectedStudent(null);
        setQuizGrade('');
        setDescription('');
        alert('✅ نمره و توضیحات با موفقیت ثبت شد');
      } else {
        alert(data.error || 'خطا در ثبت نمره');
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور');
      console.error('Submit grade error:', err);
    }
  };

  // فیلتر کردن دانشجویان بر اساس جستجو
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.studentCode.includes(searchTerm);
    const matchesTa = filterTa === 'all' || student.ta === filterTa;
    return matchesSearch && matchesTa;
  });

  // محاسبه آمار
  const totalStudents = students.length;
  const gradedStudents = students.filter(s => s.quizGrade !== undefined).length;
  const hw1Students = students.filter(s => s.hw1File).length;
  const averageGrade = students.filter(s => s.quizGrade !== undefined).length > 0 
    ? (students.reduce((sum, student) => sum + (student.quizGrade || 0), 0) / gradedStudents).toFixed(1)
    : '0';

  if (!admin) {
    return (
      <div className="adminLoadingContainer">
        <div className="adminSpinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="adminDashboard">
      {/* هدر */}
      <header className="adminHeader">
        <div className="adminHeaderContent">
          <div className="adminLogo">
            <div className="adminLogoIcon">👑</div>
            <div className="adminLogoText">
              <h1>پنل مدیریت {admin.role === 'super_admin' ? 'ادمین کل' : `TA ${admin.taId}`}</h1>
              <p>{admin.fullName} • {admin.email}</p>
            </div>
          </div>
          
          <div className="adminHeaderActions">
            <div className="adminStudentCount">
              📊 {totalStudents} دانشجو
            </div>
            <button 
              className="adminActionBtn" 
              onClick={handleRefresh}
              style={{ background: '#48bb78' }}
            >
              🔄 بروزرسانی
            </button>
            <button className="adminLogoutBtn" onClick={handleLogout}>
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* کارت‌های آمار */}
      <div className="adminStatsGrid">
        <div className="adminStatCard">
          <div className="adminStatIcon total">👥</div>
          <h3>کل دانشجویان</h3>
          <div className="adminStatNumber total">{totalStudents}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon graded">📝</div>
          <h3>دارای نمره</h3>
          <div className="adminStatNumber graded">{gradedStudents}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon files">📁</div>
          <h3>فایل HW1</h3>
          <div className="adminStatNumber files">{hw1Students}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon" style={{ background: 'linear-gradient(135deg, #ed8936, #dd6b20)', color: 'white' }}>📊</div>
          <h3>میانگین نمرات</h3>
          <div className="adminStatNumber" style={{ color: '#ed8936' }}>{averageGrade}</div>
        </div>
      </div>

      {/* فیلتر و جستجو */}
      <div className="adminFilterSection">
        <div className="adminFilterGrid">
          <div className="adminFilterGroup">
            <label>جستجوی دانشجو</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو بر اساس نام یا شماره دانشجویی..."
              className="adminSearchInput"
            />
          </div>
          <div className="adminFilterGroup">
            <label>فیلتر بر اساس TA</label>
            <select
              value={filterTa}
              onChange={(e) => setFilterTa(e.target.value)}
              className="adminFilterSelect"
            >
              <option value="all">همه TAها</option>
              <option value="5">TA 5</option>
              <option value="6">TA 6</option>
              <option value="7">TA 7</option>
              <option value="8">TA 8</option>
              <option value="9">TA 9</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول دانشجویان */}
      <div className="adminTableContainer">
        <div className="adminTableHeader">
          <h2>📋 لیست دانشجویان {admin.role === 'ta' && `(TA ${admin.taId})`}</h2>
          <div className="adminTableInfo">
            نمایش {filteredStudents.length} از {totalStudents} دانشجو
            {searchTerm && ` • جستجو: "${searchTerm}"`}
            {filterTa !== 'all' && ` • TA: ${filterTa}`}
          </div>
        </div>

        {loading ? (
          <div className="adminLoadingContainer">
            <div className="adminSpinner"></div>
            <p>در حال دریافت اطلاعات دانشجویان...</p>
          </div>
        ) : error ? (
          <div className="adminErrorContainer">
            <div className="adminErrorIcon">⚠️</div>
            <p>{error}</p>
            <button 
              className="adminActionBtn" 
              onClick={handleRefresh}
              style={{ marginTop: '16px' }}
            >
              🔄 تلاش مجدد
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="adminEmptyState">
            <div className="adminEmptyIcon">📭</div>
            <p>هیچ دانشجویی یافت نشد</p>
            <p>
              {searchTerm || filterTa !== 'all' 
                ? 'لطفاً شرایط جستجو را تغییر دهید' 
                : 'هنوز دانشجویی در سیستم ثبت نشده است'
              }
            </p>
            {(searchTerm || filterTa !== 'all') && (
              <button 
                className="adminActionBtn" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterTa('all');
                }}
                style={{ marginTop: '16px' }}
              >
                🗑️ پاک کردن فیلترها
              </button>
            )}
          </div>
        ) : (
          <>
            {/* نمایش جدول در دسکتاپ */}
            <div className="adminTableWrapper">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>نام دانشجو</th>
                    <th>شماره دانشجویی</th>
                    <th>سکشن</th>
                    <th>TA</th>
                    <th>نمره کوئیز</th>
                    <th>توضیحات</th>
                    <th>فایل HW1</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="adminStudentName">{student.name}</div>
                      </td>
                      <td>
                        <div className="adminStudentCode">{student.studentCode}</div>
                      </td>
                      <td>{student.section}</td>
                      <td>
                        <span className="adminTaBadge">TA {student.ta}</span>
                      </td>
                      <td>
                        {student.quizGrade !== undefined ? (
                          <span className="adminGradeBadge hasGrade">
                            {student.quizGrade == -1 ? 'NS' : student.quizGrade}
                          </span>
                        ) : (
                          <span className="adminGradeBadge noGrade">
                            ثبت نشده
                          </span>
                        )}
                      </td>
                      <td>
                        {student.hw1record ? (
                          <div className="adminDescription">
                            {student.hw1record.length > 30 
                              ? `${student.hw1record.substring(0, 30)}...`
                              : student.hw1record
                            }
                          </div>
                        ) : (
                          <span className="adminFileBadge">
                            ندارد
                          </span>
                        )}
                      </td>
                      <td>
                        {student.hw1File ? (
                          <button
                            onClick={() => handleDownloadFile(student.id, 'hw1File', `${student.name}_HW1`)}
                            disabled={downloading === `${student.id}-hw1File`}
                            className={`adminActionBtn download`}
                          >
                            {downloading === `${student.id}-hw1File` ? (
                              <>
                                <div className="adminSpinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                در حال دانلود...
                              </>
                            ) : (
                              '📥 دانلود HW1'
                            )}
                          </button>
                        ) : (
                          <span className="adminFileBadge">
                            ندارد
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleAddQuizGrade(student)}
                          className={`adminActionBtn ${student.quizGrade !== undefined ? 'edit' : ''}`}
                        >
                          {student.quizGrade !== undefined ? '✏️ ویرایش' : '➕ ثبت نمره'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* نمایش کارد در موبایل */}
            <div className="adminMobileCards">
              {filteredStudents.map((student) => (
                <div key={student.id} className="adminMobileCard">
                  <div className="adminMobileCardHeader">
                    <div>
                      <div className="adminMobileStudentName">{student.name}</div>
                      <div className="adminMobileStudentCode">{student.studentCode}</div>
                    </div>
                    <span className="adminTaBadge">TA {student.ta}</span>
                  </div>
                  
                  <div className="adminMobileCardDetails">
                    <div className="adminMobileDetailItem">
                      <span className="adminMobileDetailLabel">سکشن</span>
                      <span className="adminMobileDetailValue">{student.section}</span>
                    </div>
                    <div className="adminMobileDetailItem">
                      <span className="adminMobileDetailLabel">نمره کوئیز</span>
                      <span className="adminMobileDetailValue">
                        {student.quizGrade !== undefined ? (
                          <span className="adminGradeBadge hasGrade">
                            {student.quizGrade== -1? 'NS' : student.quizGrade}
                          </span>
                        ) : (
                          <span className="adminGradeBadge noGrade">
                            ثبت نشده
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {student.hw1record && (
                    <div className="adminMobileDescription">
                      <span className="adminMobileDetailLabel">توضیحات:</span>
                      <span className="adminMobileDetailValue">{student.hw1record}</span>
                    </div>
                  )}

                  <div className="adminMobileCardActions">
                    {student.hw1File && (
                      <button
                        onClick={() => handleDownloadFile(student.id, 'hw1File', `${student.name}_HW1`)}
                        disabled={downloading === `${student.id}-hw1File`}
                        className="adminMobileActionBtn secondary"
                      >
                        {downloading === `${student.id}-hw1File` ? (
                          <>
                            <div className="adminSpinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
                            دانلود...
                          </>
                        ) : (
                          '📥 HW1'
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleAddQuizGrade(student)}
                      className="adminMobileActionBtn primary"
                    >
                      {student.quizGrade !== undefined ? '✏️ ویرایش' : '➕ نمره'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* مودال ثبت نمره */}
      {showQuizModal && selectedStudent && (
        <div className="adminModalOverlay">
          <div className="adminModal" style={{ maxWidth: '600px' }}>
            <div className="adminModalHeader">
              <h3>📝 ثبت نمره و توضیحات</h3>
              <button 
                className="adminModalCloseBtn"
                onClick={() => setShowQuizModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="adminStudentInfo">
              <div className="adminStudentName">{selectedStudent.name}</div>
              <div className="adminStudentDetails">
                <span>شماره: {selectedStudent.studentCode}</span>
                <span>سکشن: {selectedStudent.section}</span>
                <span>TA: {selectedStudent.ta}</span>
              </div>
              {selectedStudent.hw1File && (
                <div className="adminFileInfo">
                  <button
                    onClick={() => handleDownloadFile(selectedStudent.id, 'hw1File', `${selectedStudent.name}_HW1`)}
                    className="adminActionBtn download"
                  >
                    📥 دانلود فایل HW1
                  </button>
                </div>
              )}
            </div>

            <div className="adminFormGroup">
              <label>نمره کوئیز (0-20)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={quizGrade}
                onChange={(e) => setQuizGrade(e.target.value)}
                className="adminFormInput"
                placeholder="مثال: 17"
              />
              <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '8px' }}>
                نمره باید بین 0 تا 20 باشد
              </div>
            </div>

            <div className="adminFormGroup">
              <label>توضیحات (اختیاری)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="adminFormInput"
                placeholder="توضیحات درباره نمره یا عملکرد دانشجو..."
                rows={4}
                style={{ resize: 'vertical', minHeight: '100px' }}
                maxLength={500}
              />
              <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '8px' }}>
                {description.length}/500 کاراکتر
              </div>
            </div>

            <div className="adminModalActions">
              <button
                onClick={submitQuizGrade}
                disabled={!quizGrade || parseInt(quizGrade) < 0 || parseInt(quizGrade) > 20}
                className="adminSubmitBtn"
              >
                ✅ ثبت نمره و توضیحات
              </button>
              <button
                onClick={() => setShowQuizModal(false)}
                className="adminCancelBtn"
              >
                ❌ انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* فوتر */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem'
      }}>
        <p>سیستم مدیریت دانشجویان • نسخه ۱.۰</p>
      </footer>
    </div>
  );
}