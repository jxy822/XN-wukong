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
import { Plus, Check, X, Package, User, MapPin, Weight, Truck, FileText } from 'lucide-react';
import type { CreateSalesPlanRequest } from '@/types';
import { PICKUP_METHODS, RELEASE_METHODS } from '@/types';

interface AddPlanCardProps {
  pickupDate: string;
  userName: string;
  onAdd: (plan: CreateSalesPlanRequest, userName: string) => Promise<void>;
}

const emptyPlan: CreateSalesPlanRequest = {
  pickup_date: '',
  cargo_name: '',
  customer_name: '',
  salesperson: '',
  sub_salesperson: '',
  pickup_weight: '',
  pickup_method: '自提',
  pickup_location: '',
  release_method: '打款卸货',
  vehicle_info: '',
  remarks: '',
};

export function AddPlanCard({ pickupDate, userName, onAdd }: AddPlanCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState<CreateSalesPlanRequest>({
    ...emptyPlan,
    pickup_date: pickupDate,
    salesperson: userName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartAdd = () => {
    setNewPlan({
      ...emptyPlan,
      pickup_date: pickupDate,
      salesperson: userName,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewPlan({
      ...emptyPlan,
      pickup_date: pickupDate,
      salesperson: userName,
    });
  };

  const handleSave = async () => {
    // 验证必填字段
    if (!newPlan.cargo_name.trim()) {
      alert('请输入货物名称');
      return;
    }
    if (!newPlan.customer_name.trim()) {
      alert('请输入客户名称');
      return;
    }
    if (!newPlan.salesperson.trim()) {
      alert('请输入销售人员');
      return;
    }
    if (!newPlan.pickup_location.trim()) {
      alert('请输入提货地点');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(newPlan, userName);
      setIsAdding(false);
      setNewPlan({
        ...emptyPlan,
        pickup_date: pickupDate,
        salesperson: userName,
      });
    } catch (err) {
      // 错误已在 hook 中处理
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateSalesPlanRequest, value: string) => {
    setNewPlan((prev) => ({ ...prev, [field]: value }));
  };

  if (!isAdding) {
    return (
      <Card
        className="p-4 mb-3 border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#1e3a8a] cursor-pointer transition-all duration-200 flex items-center justify-center min-h-[100px]"
        onClick={handleStartAdd}
      >
        <div className="flex flex-col items-center text-gray-500">
          <Plus className="w-8 h-8 mb-1" />
          <span className="text-sm">新增计划</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-3 bg-green-50 border-green-200">
      <div className="space-y-3">
        {/* 货物名称 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <Package className="w-3 h-3" />
            货物名称 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={newPlan.cargo_name}
            onChange={(e) => handleChange('cargo_name', e.target.value)}
            className="h-8 text-sm"
            placeholder="请输入货物名称"
            autoFocus
          />
        </div>

        {/* 客户名称 */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <User className="w-3 h-3" />
            客户名称 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={newPlan.customer_name}
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
            value={newPlan.salesperson}
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
            value={newPlan.sub_salesperson}
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
            value={newPlan.pickup_weight}
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
            value={newPlan.pickup_method}
            onValueChange={(value) => handleChange('pickup_method', value as '自提' | '送到')}
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
            value={newPlan.pickup_location}
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
            value={newPlan.release_method}
            onValueChange={(value) => handleChange('release_method', value as '打款卸货' | '出数打款' | '其他')}
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
            value={newPlan.vehicle_info}
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
            value={newPlan.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            className="text-sm min-h-[60px]"
            placeholder="其他备注信息"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Check className="w-4 h-4 mr-1" />
            确认添加
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
