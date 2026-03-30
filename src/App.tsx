import { useAuth } from '@/hooks/useAuth';
import { useSalesPlans } from '@/hooks/useSalesPlans';
import { LoginDialog } from '@/components/LoginDialog';
import { Header } from '@/components/Header';
import { DateColumn } from '@/components/DateColumn';
import { HistoryArchive } from '@/components/HistoryArchive';
import { ConfigPrompt } from '@/components/ConfigPrompt';
import { Toaster } from '@/components/ui/sonner';
import { isSupabaseConfigured } from '@/lib/supabase';
import './App.css';

function App() {
  const {
    userInfo,
    isAuthenticated,
    isEditMode,
    userName,
    login,
    logout,
  } = useAuth();

  const {
    groupedPlans,
    historicalPlans,
    futureDates,
    isLoading,
    refresh,
    createPlan,
    updatePlan,
    deletePlan,
  } = useSalesPlans();

  // 检查 Supabase 配置
  if (!isSupabaseConfigured()) {
    return (
      <>
        <ConfigPrompt />
        <Toaster />
      </>
    );
  }

  // 未登录显示登录对话框
  if (!isAuthenticated) {
    return (
      <>
        <LoginDialog isOpen={!isAuthenticated} onLogin={login} />
        <Toaster />
      </>
    );
  }

  // 获取今天的日期
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 头部导航 */}
      <Header
        userName={userName}
        userMode={userInfo?.mode || 'readonly'}
        onLogout={logout}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 横向滑动日期看板 */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth horizontal-scroll">
          <div className="flex h-full min-w-max">
            {futureDates.map((date) => (
              <DateColumn
                key={date}
                date={date}
                plans={groupedPlans[date] || []}
                isEditMode={isEditMode}
                userName={userName}
                onUpdate={updatePlan}
                onDelete={deletePlan}
                onAdd={createPlan}
                isToday={date === today}
              />
            ))}
          </div>
        </div>

        {/* 历史归档区域 */}
        <HistoryArchive
          plans={historicalPlans}
          isEditMode={isEditMode}
          userName={userName}
          onUpdate={updatePlan}
          onDelete={deletePlan}
        />
      </div>

      <Toaster />
    </div>
  );
}

export default App;
