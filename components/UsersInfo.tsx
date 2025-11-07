'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WindowFloat from './WindowFloat';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  role: string;
  avatar: string;
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // دریافت کاربران از API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات کاربران');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.users);
        } else {
          throw new Error(data.error || 'خطا در دریافت اطلاعات');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.');
        
        // داده‌های نمونه برای حالت آفلاین
        const sampleUsers: User[] = [
          {
            _id: '1',
            name: 'علی محمدی',
            email: 'ali.mohammadi@example.com',
            phone: '09123456789',
            joinDate: '1402/05/15',
            status: 'active',
            role: 'مدیر',
            avatar: '👨‍💼',
            createdAt: '2023-08-01'
          },
          {
            _id: '2',
            name: 'فاطمه احمدی',
            email: 'fateme.ahmadi@example.com',
            phone: '09129876543',
            joinDate: '1402/06/20',
            status: 'active',
            role: 'کاربر عادی',
            avatar: '👩‍💻',
            createdAt: '2023-09-01'
          }
        ];
        setUsers(sampleUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10b981' : '#ef4444';
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'مدیر': '#8b5cf6',
      'کاربر عادی': '#3b82f6',
      'نویسنده': '#f59e0b',
      'مشتری': '#06b6d4',
      'کاربر ویژه': '#ec4899',
      'مهمان': '#6b7280',
      'admin': '#8b5cf6',
      'user': '#3b82f6',
      'author': '#f59e0b',
      'customer': '#06b6d4',
      'vip': '#ec4899',
      'guest': '#6b7280'
    };
    return colors[role] || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR').format(date);
    } catch {
      return dateString;
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات کاربران');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.error || 'خطا در دریافت اطلاعات');
      }
    } catch (err) {
      console.error('Error refreshing users:', err);
      setError('خطا در بروزرسانی اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-container">
      {/* اشکال شناور در پس‌زمینه */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* دکمه بازگشت */}
      <button 
        onClick={() => router.push('/')}
        className="home-button"
        title="بازگشت به خانه"
      >
        🏠
      </button>

      {/* هدر صفحه */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">👥 مدیریت کاربران</h1>
            <p className="page-subtitle">مدیریت و مشاهده اطلاعات تمامی کاربران سیستم</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="refresh-button"
            >
              {loading ? '🔄' : '🔄'} بروزرسانی
            </button>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">کاربر کل</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{users.filter(u => u.status === 'active').length}</div>
              <div className="stat-label">فعال</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏸️</div>
            <div className="stat-info">
              <div className="stat-number">{users.filter(u => u.status === 'inactive').length}</div>
              <div className="stat-label">غیرفعال</div>
            </div>
          </div>
        </div>
      </div>

      {/* نوار جستجو و فیلتر */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل یا نقش..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* نمایش خطا */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError('')} className="error-close">✕</button>
        </div>
      )}

      {/* محتوای اصلی */}
      <div className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>در حال بارگذاری کاربران از پایگاه داده...</p>
          </div>
        ) : (
          <>
            <div className="users-info">
              <span className="users-count">
                نمایش {filteredUsers.length} از {users.length} کاربر
              </span>
            </div>

            <div className="users-grid">
              {filteredUsers.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="card-header">
                    <div className="user-avatar">
                      {user.avatar || '👤'}
                    </div>
                    <div className="user-status" style={{ backgroundColor: getStatusColor(user.status) }}>
                      {user.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </div>
                  </div>
                  
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-role" style={{ color: getRoleColor(user.role) }}>
                      {user.role}
                    </p>
                    
                    <div className="user-details">
                      <div className="detail-item">
                        <span className="detail-icon">📧</span>
                        <span className="detail-text">{user.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📱</span>
                        <span className="detail-text">{user.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">عضویت: {formatDate(user.createdAt)}</span>
                      </div>
                      {user.lastLogin && (
                        <div className="detail-item">
                          <span className="detail-icon">🕒</span>
                          <span className="detail-text">آخرین ورود: {formatDate(user.lastLogin)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="action-btn edit-btn"
                    onClick={()=>{
                        <WindowFloat><div></div></WindowFloat>
                    }}
                    >
                      ✏️ ویرایش
                    </button>
                    <button className="action-btn view-btn">
                      👁️ مشاهده
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>کاربری یافت نشد</h3>
                <p>هیچ کاربری با مشخصات جستجو شده مطابقت ندارد</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="clear-filter-btn"
                >
                  پاک کردن فیلتر
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .users-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .floating-shapes {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 5%;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 70%;
          right: 5%;
          animation: float 8s ease-in-out infinite 1s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 10%;
          left: 15%;
          animation: float 5s ease-in-out infinite 0.5s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          top: 20%;
          right: 15%;
          animation: float 7s ease-in-out infinite 1.5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .home-button {
          position: fixed;
          top: 25px;
          right: 25px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
          font-weight: 500;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .home-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .page-header {
          position: relative;
          z-index: 2;
          margin-bottom: 30px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 25px;
        }

        .title-section {
          flex: 1;
          min-width: 300px;
        }

        .page-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.5;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .refresh-button {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .stats-cards {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(20px);
          min-width: 140px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          color: white;
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .search-section {
          position: relative;
          z-index: 2;
          margin-bottom: 25px;
        }

        .search-container {
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .search-input {
          width: 100%;
          padding: 16px 50px 16px 16px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .clear-search {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fecaca;
          padding: 14px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .error-close {
          background: none;
          border: none;
          color: #fecaca;
          cursor: pointer;
          font-size: 1rem;
          padding: 5px;
        }

        .main-content {
          position: relative;
          z-index: 2;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: white;
        }

        .loading-spinner.large {
          width: 50px;
          height: 50px;
          border: 3px solid transparent;
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .users-info {
          margin-bottom: 20px;
        }

        .users-count {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 25px;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          animation: slideUp 0.5s ease-out;
        }

        .user-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          backdrop-filter: blur(10px);
        }

        .user-status {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .user-info {
          margin-bottom: 20px;
        }

        .user-name {
          color: white;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .user-role {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-icon {
          font-size: 1rem;
          opacity: 0.8;
        }

        .detail-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .card-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .edit-btn {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
        }

        .edit-btn:hover {
          background: rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .view-btn {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .view-btn:hover {
          background: rgba(16, 185, 129, 0.3);
          transform: translateY(-2px);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: white;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
        }

        .clear-filter-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .clear-filter-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* رسپانسیو */
        @media (max-width: 768px) {
          .users-container {
            padding: 15px;
          }

          .header-content {
            flex-direction: column;
          }

          .stats-cards {
            width: 100%;
            justify-content: space-between;
          }

          .stat-card {
            flex: 1;
            min-width: 120px;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 2rem;
          }

          .home-button {
            top: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .stat-card {
            min-width: 100px;
            padding: 15px;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .card-actions {
            flex-direction: column;
          }

          .user-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}