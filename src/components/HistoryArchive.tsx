import { useState } from 'react';
import { ChevronDown, ChevronUp, Archive, Calendar } from 'lucide-react';
import type { SalesPlan } from '@/types';
import { SalesPlanCard } from './SalesPlanCard';
import { formatDateDisplay, groupByDate } from '@/hooks/useSalesPlans';

interface HistoryArchiveProps {
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
}

export function HistoryArchive({
  plans,
  isEditMode,
  userName,
  onUpdate,
  onDelete,
}: HistoryArchiveProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (plans.length === 0) {
    return null;
  }

  const groupedPlans = groupByDate(plans);
  const sortedDates = Object.keys(groupedPlans).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* 折叠头部 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
            <Archive className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-700">历史归档</h3>
            <p className="text-xs text-gray-500">
              昨天及以前的计划（共 {plans.length} 条）
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {isExpanded ? '点击收起' : '点击展开'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date} className="space-y-2">
                {/* 日期标签 */}
                <div className="flex items-center gap-2 py-2 border-b border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    {formatDateDisplay(date)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({groupedPlans[date].length} 条)
                  </span>
                </div>

                {/* 该日期的卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {groupedPlans[date].map((plan) => (
                    <SalesPlanCard
                      key={plan.id}
                      plan={plan}
                      isEditMode={isEditMode}
                      userName={userName}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
