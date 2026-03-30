import { useRef, useEffect } from 'react';
import type { SalesPlan } from '@/types';
import { SalesPlanCard } from './SalesPlanCard';
import { AddPlanCard } from './AddPlanCard';
import { formatDateDisplay } from '@/hooks/useSalesPlans';
import { Calendar } from 'lucide-react';

interface DateColumnProps {
  date: string;
  plans: SalesPlan[];
  isEditMode: boolean;
  userName: string;
  onUpdate: (
    id: string,
    updates: Partial<SalesPlan>,
    userName: string,
    version: number
  ) => Promise<void>;
  onDelete: (id: string, userName: string) => Promise<void>;
  onAdd: (plan: any, userName: string) => Promise<void>;
  isToday?: boolean;
}

export function DateColumn({
  date,
  plans,
  isEditMode,
  userName,
  onUpdate,
  onDelete,
  onAdd,
  isToday = false,
}: DateColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);

  // 今天列自动滚动到中间
  useEffect(() => {
    if (isToday && columnRef.current) {
      columnRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [isToday]);

  return (
    <div
      ref={columnRef}
      className={`
        flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[32vw] lg:w-[22vw] xl:w-[18vw]
        min-w-[280px] max-w-[380px]
        h-full flex flex-col
        snap-start snap-always
        border-r border-gray-200
        ${isToday ? 'bg-blue-50/50' : 'bg-white'}
      `}
    >
      {/* 日期头部 */}
      <div
        className={`
          sticky top-0 z-10 px-4 py-3 border-b border-gray-200
          flex items-center justify-between
          ${isToday ? 'bg-[#1e3a8a] text-white' : 'bg-white'}
        `}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold">{formatDateDisplay(date)}</span>
        </div>
        <span
          className={`
            text-xs px-2 py-1 rounded-full
            ${isToday 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-100 text-gray-600'}
          `}
        >
          {plans.length} 条
        </span>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {/* 新增卡片（仅编辑模式） */}
        {isEditMode && (
          <AddPlanCard
            pickupDate={date}
            userName={userName}
            onAdd={onAdd}
          />
        )}

        {/* 计划卡片列表 */}
        {plans.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">暂无计划</p>
          </div>
        ) : (
          plans.map((plan) => (
            <SalesPlanCard
              key={plan.id}
              plan={plan}
              isEditMode={isEditMode}
              userName={userName}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
