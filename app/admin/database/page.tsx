import DatabaseSelector from '@/components/DatabaseSelector';

export default function DatabaseSetupPage() {
  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <DatabaseSelector />
        
        <div className="glass-card p-6 max-w-md mx-auto mt-6">
          <h3 className="text-white text-lg mb-4">📋 راهنما:</h3>
          <ul className="text-white/80 space-y-2 text-sm">
            <li>• ابتدا دیتابیس مورد نظر را انتخاب کنید</li>
            <li>• سپس کالکشن users را انتخاب کنید</li>
            <li>• اگر کالکشن users وجود ندارد، می‌توانید هر کالکشن دیگری انتخاب کنید</li>
            <li>• برای ایجاد کالکشن جدید، با مدیر دیتابیس تماس بگیرید</li>
          </ul>
        </div>
      </div>
    </div>
  );
}