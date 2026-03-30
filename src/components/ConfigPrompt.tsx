import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function ConfigPrompt() {
  const [copied, setCopied] = useState(false);

  const envContent = `VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center gap-3 text-amber-600">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="text-xl font-semibold">需要配置 Supabase</h2>
        </div>

        <div className="space-y-4 text-gray-600">
          <p>
            检测到 Supabase 尚未配置。请按照以下步骤完成配置：
          </p>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              前往{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1e3a8a] hover:underline inline-flex items-center gap-1"
              >
                Supabase 官网
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              创建项目
            </li>
            <li>
              在 SQL Editor 中执行{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                supabase_schema.sql
              </code>{' '}
              文件中的 SQL 语句
            </li>
            <li>
              复制 Project URL 和 Anon Key
            </li>
            <li>
              创建{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                .env
              </code>{' '}
              文件并添加以下配置：
            </li>
          </ol>

          <div className="relative bg-gray-900 rounded-lg p-4">
            <pre className="text-green-400 text-sm overflow-x-auto">
              {envContent}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            配置完成后，刷新页面即可正常使用。
          </p>
        </div>
      </Card>
    </div>
  );
}
