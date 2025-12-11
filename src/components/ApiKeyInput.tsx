import { useState, type FormEvent } from 'react';
import { Key, Lock, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
    onApiKeySubmit: (key: string) => void;
}

export function ApiKeyInput({ onApiKeySubmit }: Props) {
    const [key, setKey] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (key.trim().length > 0) {
            onApiKeySubmit(key);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 transition-all">
            <div className="text-center mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-4 ring-blue-50/50">
                    <Key size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">API 키 입력</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    이 도구는 무료로 제공되며, 사용하려면 Google Gemini API 키가 필요합니다.
                    귀하의 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Lock size={16} />
                        </div>
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Gemini API 키를 여기에 붙여넣으세요"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 hover:border-slate-300"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                    <span>시작하기</span>
                    <ArrowRight size={18} />
                </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50 py-3 rounded-lg border border-slate-100">
                키가 없으신가요? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 hover:underline">
                    Google에서 무료로 발급받기
                    <ExternalLink size={10} />
                </a>
            </div>
        </div>
    );
}
