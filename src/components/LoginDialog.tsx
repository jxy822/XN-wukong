import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, User, Key } from 'lucide-react';
import type { UserMode } from '@/types';
import { TEAM_KEY } from '@/types';

interface LoginDialogProps {
  isOpen: boolean;
  onLogin: (mode: UserMode, name: string, teamKey?: string) => boolean;
}

export function LoginDialog({ isOpen, onLogin }: LoginDialogProps) {
  const [activeTab, setActiveTab] = useState<UserMode>('edit');
  const [name, setName] = useState('');
  const [teamKey, setTeamKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 验证姓名
    if (!name.trim()) {
      setError('请输入您的姓名');
      setIsLoading(false);
      return;
    }

    // 编辑模式验证团队密钥
    if (activeTab === 'edit' && teamKey !== TEAM_KEY) {
      setError('团队密钥错误');
      setIsLoading(false);
      return;
    }

    const success = onLogin(activeTab, name, activeTab === 'edit' ? teamKey : undefined);
    
    if (success) {
      setName('');
      setTeamKey('');
    } else {
      setError('登录失败，请重试');
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1e3a8a]">
            销售计划协作看板
          </DialogTitle>
          <DialogDescription>
            请选择访问方式进入系统
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
              编辑模式
            </TabsTrigger>
            <TabsTrigger value="readonly" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
              仅查看
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* 姓名输入 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                您的姓名
              </Label>
              <Input
                id="name"
                placeholder="请输入姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>

            {/* 编辑模式显示团队密钥输入 */}
            <TabsContent value="edit" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamKey" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  团队密钥
                </Label>
                <div className="relative">
                  <Input
                    id="teamKey"
                    type={showKey ? 'text' : 'password'}
                    placeholder="请输入团队密钥"
                    value={teamKey}
                    onChange={(e) => setTeamKey(e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  提示：默认团队密钥为 "xn"
                </p>
              </div>
            </TabsContent>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
              disabled={isLoading}
            >
              {isLoading ? '进入中...' : activeTab === 'edit' ? '进入编辑模式' : '进入查看模式'}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
