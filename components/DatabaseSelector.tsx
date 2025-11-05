'use client';

import { useState, useEffect } from 'react';

interface Database {
  name: string;
  size: number;
  empty: boolean;
}

interface Collection {
  name: string;
  type: string;
}

export default function DatabaseSelector() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // دریافت لیست دیتابیس‌ها
  const fetchDatabases = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/list-databases');
      const data = await response.json();
      
      if (data.success) {
        setDatabases(data.databases);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('خطا در دریافت دیتابیس‌ها');
    } finally {
      setLoading(false);
    }
  };

  // دریافت لیست کالکشن‌ها وقتی دیتابیس انتخاب شد
  const fetchCollections = async (dbName: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/list-collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ databaseName: dbName }),
      });
      const data = await response.json();
      
      if (data.success) {
        setCollections(data.collections);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('خطا در دریافت کالکشن‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleDatabaseChange = (dbName: string) => {
    setSelectedDatabase(dbName);
    setSelectedCollection('');
    if (dbName) {
      fetchCollections(dbName);
    }
  };

  const saveSelection = () => {
    if (selectedDatabase && selectedCollection) {
      localStorage.setItem('selectedDatabase', selectedDatabase);
      localStorage.setItem('selectedCollection', selectedCollection);
      alert(`✅ تنظیمات ذخیره شد:\nدیتابیس: ${selectedDatabase}\nکالکشن: ${selectedCollection}`);
    } else {
      alert('لطفاً دیتابیس و کالکشن را انتخاب کنید');
    }
  };

  return (
    <div className="glass-card p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        🗄️ انتخاب دیتابیس و کالکشن
      </h2>

      {error && (
        <div className="error-message mb-4">
          {error}
        </div>
      )}

      {/* انتخاب دیتابیس */}
      <div className="mb-4">
        <label className="block text-white mb-2">انتخاب دیتابیس:</label>
        <select 
          value={selectedDatabase}
          onChange={(e) => handleDatabaseChange(e.target.value)}
          className="glass-input w-full p-3"
          disabled={loading}
        >
          <option value="">-- دیتابیس را انتخاب کنید --</option>
          {databases.map((db) => (
            <option key={db.name} value={db.name}>
              {db.name} {db.empty && '(خالی)'}
            </option>
          ))}
        </select>
      </div>

      {/* انتخاب کالکشن */}
      <div className="mb-6">
        <label className="block text-white mb-2">انتخاب کالکشن:</label>
        <select 
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="glass-input w-full p-3"
          disabled={!selectedDatabase || loading}
        >
          <option value="">-- کالکشن را انتخاب کنید --</option>
          {collections.map((col) => (
            <option key={col.name} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-4">
        <button
          onClick={saveSelection}
          disabled={!selectedDatabase || !selectedCollection}
          className="glass-button flex-1 py-3"
        >
          💾 ذخیره انتخاب
        </button>
        
        <button
          onClick={fetchDatabases}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-3 rounded-xl flex-1"
        >
          🔄 بروزرسانی
        </button>
      </div>

      {/* نمایش انتخاب فعلی */}
      {(selectedDatabase || selectedCollection) && (
        <div className="mt-4 p-3 bg-white/10 rounded-xl">
          <p className="text-white">
            <strong>دیتابیس:</strong> {selectedDatabase || '--'}
          </p>
          <p className="text-white">
            <strong>کالکشن:</strong> {selectedCollection || '--'}
          </p>
        </div>
      )}
    </div>
  );
}