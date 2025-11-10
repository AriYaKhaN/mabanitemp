'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import WindowFloat from './WindowFloat';

interface User {
  _id: string;
  name: string;
  studentCode: string;
  ta: string;
  joinDate: string;
  status: 'active' | 'inactive';
  role: string;
  avatar: string;
  createdAt: string;
  lastLogin?: string;
}

// ثابت‌های جدا شده برای مدیریت بهتر
const TA_MAPPING: Record<string, string> = {
  '5': 'آریا تاجدار',
  '6': 'رقیه اسلامی',
  '7': 'مبینا همتی',
  '8': 'میترا محمدی',
  '9': 'علیرضا درخشان'
};

const ROLE_COLORS: Record<string, string> = {
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

const SAMPLE_USERS: User[] = [
  {
    _id: '1',
    name: 'علی محمدی',
    studentCode: 'ali.mohammadi@example.com',
    ta: '09123456789',
    joinDate: '1402/05/15',
    status: 'active',
    role: 'مدیر',
    avatar: '👨‍💼',
    createdAt: '2023-08-01'
  },
  {
    _id: '2',
    name: 'فاطمه احمدی',
    studentCode: 'fateme.ahmadi@example.com',
    ta: '09129876543',
    joinDate: '1402/06/20',
    status: 'active',
    role: 'کاربر عادی',
    avatar: '👩‍💻',
    createdAt: '2023-09-01'
  }
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // تابع دریافت کاربران
  const fetchUsers = useCallback(async () => {
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
      console.error('Error fetching users:', err);
      setError('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.');
      setUsers(SAMPLE_USERS);
    } finally {
      setLoading(false);
    }
  }, []);

  // دریافت کاربران هنگام mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // فیلتر کردن کاربران با useMemo برای بهینه‌سازی
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.ta.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // آمار کاربران با useMemo
  const userStats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  }), [users]);

  // توابع کمکی
  const getStatusColor = useCallback((status: string) => {
    return status === 'active' ? '#10b981' : '#ef4444';
  }, []);

  const getRoleColor = useCallback((role: string) => {
    return ROLE_COLORS[role] || '#6b7280';
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR').format(date);
    } catch {
      return dateString;
    }
  }, []);

  const getTaName = useCallback((taCode: string) => {
    return TA_MAPPING[taCode] || taCode;
  }, []);

  const handleClearSearch = useCallback(() => setSearchTerm(''), []);
  const handleClearError = useCallback(() => setError(''), []);

  return (
    <div className="users-container">
      {/* اشکال شناور در پس‌زمینه */}
      <div className="floating-shapes">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`shape shape-${i}`} />
        ))}
      </div>

      {/* دکمه بازگشت */}
      <button 
        onClick={() => router.push('/')}
        className="home-button"
        title="بازگشت به خانه"
        aria-label="بازگشت به صفحه اصلی"
      >
        🏠
      </button>

      {/* هدر صفحه */}
      <header className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">👥 مدیریت کاربران</h1>
            <p className="page-subtitle">مدیریت و مشاهده اطلاعات تمامی کاربران سیستم</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={fetchUsers}
              disabled={loading}
              className="refresh-button"
              aria-label="بروزرسانی لیست کاربران"
            >
              {loading ? '🔄' : '🔄'} بروزرسانی
            </button>
          </div>
        </div>

        <div className="stats-cards">
          <StatCard 
            icon="👤"
            number={userStats.total}
            label="کاربر کل"
          />
          <StatCard 
            icon="✅"
            number={userStats.active}
            label="فعال"
          />
          <StatCard 
            icon="⏸️"
            number={userStats.inactive}
            label="غیرفعال"
          />
        </div>
      </header>

      {/* نوار جستجو */}
      <SearchSection 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={handleClearSearch}
      />

      {/* نمایش خطا */}
      {error && (
        <ErrorBanner 
          message={error}
          onClose={handleClearError}
        />
      )}

      {/* محتوای اصلی */}
      <main className="main-content">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <UsersInfo 
              filteredCount={filteredUsers.length}
              totalCount={users.length}
            />

            <UsersGrid 
              users={filteredUsers}
              getStatusColor={getStatusColor}
              getRoleColor={getRoleColor}
              formatDate={formatDate}
              getTaName={getTaName}
            />

            {filteredUsers.length === 0 && (
              <EmptyState onClearFilter={handleClearSearch} />
            )}
          </>
        )}
      </main>

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
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 5%;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 70%;
          right: 5%;
          animation-delay: 1s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 10%;
          left: 15%;
          animation-delay: 0.5s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          top: 20%;
          right: 15%;
          animation-delay: 1.5s;
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

        .main-content {
          position: relative;
          z-index: 2;
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
          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// کامپوننت‌های جداگانه برای مدیریت بهتر

interface StatCardProps {
  icon: string;
  number: number;
  label: string;
}

function StatCard({ icon, number, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
      </div>
      <style jsx>{`
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

        @media (max-width: 480px) {
          .stat-card {
            min-width: 100px;
            padding: 15px;
          }

          .stat-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
}

function SearchSection({ searchTerm, onSearchChange, onClearSearch }: SearchSectionProps) {
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder="جستجو بر اساس نام، ایمیل یا نقش..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="جستجوی کاربران"
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="clear-search"
            aria-label="پاک کردن جستجو"
          >
            ✕
          </button>
        )}
      </div>
      <style jsx>{`
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
      `}</style>
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      ⚠️ {message}
      <button onClick={onClose} className="error-close" aria-label="بستن اخطار">
        ✕
      </button>
      <style jsx>{`
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
      `}</style>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner large"></div>
      <p>در حال بارگذاری کاربران از پایگاه داده...</p>
      <style jsx>{`
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

interface UsersInfoProps {
  filteredCount: number;
  totalCount: number;
}

function UsersInfo({ filteredCount, totalCount }: UsersInfoProps) {
  return (
    <div className="users-info">
      <span className="users-count">
        نمایش {filteredCount} از {totalCount} کاربر
      </span>
      <style jsx>{`
        .users-info {
          margin-bottom: 20px;
        }

        .users-count {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

interface UsersGridProps {
  users: User[];
  getStatusColor: (status: string) => string;
  getRoleColor: (role: string) => string;
  formatDate: (date: string) => string;
  getTaName: (taCode: string) => string;
}

function UsersGrid({ users, getStatusColor, getRoleColor, formatDate, getTaName }: UsersGridProps) {
  return (
    <div className="users-grid">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          getStatusColor={getStatusColor}
          getRoleColor={getRoleColor}
          formatDate={formatDate}
          getTaName={getTaName}
        />
      ))}
      <style jsx>{`
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .users-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

interface UserCardProps {
  user: User;
  getStatusColor: (status: string) => string;
  getRoleColor: (role: string) => string;
  formatDate: (date: string) => string;
  getTaName: (taCode: string) => string;
}

function UserCard({ user, getStatusColor, getRoleColor, formatDate, getTaName }: UserCardProps) {
  return (
    <div className="user-card">
      <div className="card-header">
        <div className="user-avatar">
          {user.avatar || '👤'}
        </div>
        <div 
          className="user-status" 
          style={{ backgroundColor: getStatusColor(user.status) }}
        >
          {user.status === 'active' ? 'فعال' : 'غیرفعال'}
        </div>
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-role" style={{ color: getRoleColor(user.role) }}>
          {user.role}
        </p>
        
        <div className="user-details">
          {/* <div className="detail-item">
            <span className="detail-icon">📧</span>
            <span className="detail-text">{user.studentCode}</span>
          </div> */}
          {/* <div className="detail-item">
            <span className="detail-icon">📱</span>
            <span className="detail-text">{getTaName(user.ta)}</span>
          </div> */}
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
        {/* <button className="action-btn edit-btn">
          ✏️ ویرایش
        </button>
        <button className="action-btn view-btn">
          👁️ مشاهده
        </button> */}
      </div>

      <style jsx>{`
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

        @media (max-width: 480px) {
          .user-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

interface EmptyStateProps {
  onClearFilter: () => void;
}

function EmptyState({ onClearFilter }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <h3>کاربری یافت نشد</h3>
      <p>هیچ کاربری با مشخصات جستجو شده مطابقت ندارد</p>
      <button 
        onClick={onClearFilter}
        className="clear-filter-btn"
      >
        پاک کردن فیلتر
      </button>
      <style jsx>{`
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
      `}</style>
    </div>
  );
}