import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  LogOut, 
  Eye, 
  Edit3, 
  RefreshCw,
  Menu
} from 'lucide-react';
import type { UserMode } from '@/types';

interface HeaderProps {
  userName: string;
  userMode: UserMode;
  onLogout: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({
  userName,
  userMode,
  onLogout,
  onRefresh,
  isLoading,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#1e3a8a] text-white shadow-lg">
      <div className="flex items-center justify-between h-14 px-4">
        {/* 左侧：标题 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg">
            <Menu className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold hidden sm:block">
            销售计划协作看板
          </h1>
        </div>

        {/* 中间：模式指示器 */}
        <div className="flex items-center gap-2">
          <div
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
              ${userMode === 'edit' 
                ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                : 'bg-blue-400/20 text-blue-100 border border-blue-400/30'}
            `}
          >
            {userMode === 'edit' ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">编辑模式</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">仅查看</span>
              </>
            )}
          </div>
        </div>

        {/* 右侧：用户菜单 */}
        <div className="flex items-center gap-2">
          {/* 刷新按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10"
              >
                <div className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">
                  {userMode === 'edit' ? '编辑权限' : '只读权限'}
                </p>
              </div>
              
              <DropdownMenuItem onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新数据
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
