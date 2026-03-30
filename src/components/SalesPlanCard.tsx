import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  MapPin,
  User,
  Package,
  Weight,
  Truck,
  FileText
} from 'lucide-react';
import type { SalesPlan, ValidationResult } from '@/types';
import { PICKUP_METHODS, RELEASE_METHODS } from '@/types';
import { validatePlan } from '@/hooks/useSalesPlans';

interface SalesPlanCardProps {
  plan: SalesPlan;
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

export function SalesPlanCard({
  plan,
  isEditMode,
  userName,
  onUpdate,
  onDelete,
}: SalesPlanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedPlan, setEditedPlan] = useState<SalesPlan>(plan);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证状态
  const validation: ValidationResult = validatePlan(plan);
  const isIncomplete = !validation.isValid;

  const handleEdit = () => {
    setEditedPlan(plan);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedPlan(plan);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const updates = {
        cargo_name: editedPlan.cargo_name,
        customer_name: editedPlan.customer_name,
        salesperson: editedPlan.salesperson,
        sub_salesperson: editedPlan.sub_salesperson,
        pickup_weight: editedPlan.pickup_weight,
        pickup_method: editedPlan.pickup_method,
        pickup_location: editedPlan.pickup_location,
        release_method: editedPlan.release_method,
        vehicle_info: editedPlan.vehicle_info,
        remarks: editedPlan.remarks,
      };
      await onUpdate(plan.id, updates, userName, plan.version);
      setIsEditing(false);
    } catch (err) {
      // 错误已在 hook 中处理
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这条记录吗？此操作不可恢复。')) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(plan.id, userName);
    } catch (err) {
      // 错误已在 hook 中处理
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (field: keyof SalesPlan, value: string) => {
    setEditedPlan((prev) => ({ ...prev, [field]: value }));
  };

  // 只读模式显示
  if (!isEditing) {
    return (
      <Card 
        className={`
          relative p-4 mb-3 transition-all duration-200
          ${isIncomplete ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'}
          hover:shadow-md
        `}
      >
        {/* 待补充角标 */}
        {isIncomplete && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <AlertTriangle className="w-3 h-3" />
            待补充
          </div>
        )}

        {/* 操作按钮 */}
        {isEditMode && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-blue-600"
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 内容 */}
        <div className="space-y-2 pr-16">
          {/* 货物名称 */}
          <div className="flex items-start gap-2">
            <Package className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">货物</span>
              <p className="text-sm font-medium text-gray-900 truncate">{plan.cargo_name}</p>
            </div>
          </div>

          {/* 客户名称 */}
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">客户</span>
              <p className="text-sm text-gray-700 truncate">{plan.customer_name}</p>
            </div>
          </div>

          {/* 销售人员 */}
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">销售</span>
              <p className="text-sm text-gray-700 truncate">
                {plan.salesperson}
                {plan.sub_salesperson && (
                  <span className="text-gray-500"> → {plan.sub_salesperson}</span>
                )}
              </p>
            </div>
          </div>

          {/* 提货信息 */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">提货</span>
              <p className="text-sm text-gray-700 truncate">
                {plan.pickup_method} · {plan.pickup_location}
              </p>
            </div>
          </div>

          {/* 提货重量 */}
          {plan.pickup_weight && (
            <div className="flex items-start gap-2">
              <Weight className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500">重量</span>
                <p className="text-sm text-gray-700 truncate">{plan.pickup_weight}</p>
              </div>
            </div>
          )}

          {/* 放行方式 */}
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">放行</span>
              <p className={`text-sm truncate ${!plan.release_method ? 'text-red-500' : 'text-gray-700'}`}>
                {plan.release_method || '未填写'}
              </p>
            </div>
          </div>

          {/* 用车信息 */}
          {plan.vehicle_info && (
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500">用车</span>
                <p className="text-sm text-gray-700 truncate">{plan.vehicle_info}</p>
              </div>
            </div>
          )}

          {/* 备注 */}
          {plan.remarks && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500">备注</span>
                <p className="text-sm text-gray-700 truncate">{plan.remarks}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // 编辑模式
  return (
    <Card className="p-4 mb-3 bg-blue-50 border-blue-200">
      <div className="space-y-3">
        {/* 货物名称 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <Package className="w-3 h-3" />
            货物名称 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={editedPlan.cargo_name}
            onChange={(e) => handleChange('cargo_name', e.target.value)}
            className="h-8 text-sm"
            placeholder="请输入货物名称"
          />
        </div>

        {/* 客户名称 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <User className="w-3 h-3" />
            客户名称 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={editedPlan.customer_name}
            onChange={(e) => handleChange('customer_name', e.target.value)}
            className="h-8 text-sm"
            placeholder="请输入客户名称"
          />
        </div>

        {/* 销售人员 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <User className="w-3 h-3" />
            销售人员 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={editedPlan.salesperson}
            onChange={(e) => handleChange('salesperson', e.target.value)}
            className="h-8 text-sm"
            placeholder="请输入销售人员"
          />
        </div>

        {/* 下级业务员 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <User className="w-3 h-3" />
            下级业务员
          </Label>
          <Input
            value={editedPlan.sub_salesperson}
            onChange={(e) => handleChange('sub_salesperson', e.target.value)}
            className="h-8 text-sm"
            placeholder="空表示销售自己跟进"
          />
        </div>

        {/* 提货重量 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <Weight className="w-3 h-3" />
            提货重量
          </Label>
          <Input
            value={editedPlan.pickup_weight}
            onChange={(e) => handleChange('pickup_weight', e.target.value)}
            className="h-8 text-sm"
            placeholder="如：66/一车/两件/9"
          />
        </div>

        {/* 提货方式 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            提货方式 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={editedPlan.pickup_method}
            onValueChange={(value) => handleChange('pickup_method', value)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="选择提货方式" />
            </SelectTrigger>
            <SelectContent>
              {PICKUP_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 提货地点 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            提货地点 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={editedPlan.pickup_location}
            onChange={(e) => handleChange('pickup_location', e.target.value)}
            className="h-8 text-sm"
            placeholder="如：天津/河北唐山"
          />
        </div>

        {/* 放行方式 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            放行方式 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={editedPlan.release_method}
            onValueChange={(value) => handleChange('release_method', value)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="选择放行方式" />
            </SelectTrigger>
            <SelectContent>
              {RELEASE_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 用车信息 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <Truck className="w-3 h-3" />
            是否用车
          </Label>
          <Input
            value={editedPlan.vehicle_info}
            onChange={(e) => handleChange('vehicle_info', e.target.value)}
            className="h-8 text-sm"
            placeholder="用车信息"
          />
        </div>

        {/* 备注 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            备注
          </Label>
          <Textarea
            value={editedPlan.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            className="text-sm min-h-[60px]"
            placeholder="其他备注信息"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Check className="w-4 h-4 mr-1" />
            保存
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-1" />
            取消
          </Button>
        </div>
      </div>
    </Card>
  );
}
