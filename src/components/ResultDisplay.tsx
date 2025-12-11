import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { type GeneratedContent } from '../lib/gemini';
import { GapAnalysis } from './GapAnalysis';
import { PPTGenerator } from './PPTGenerator';

interface Props {
    content: GeneratedContent;
    onReset: () => void;
}

export function ResultDisplay({ content, onReset }: Props) {
    const [copied, setCopied] = useState(false);

    // Convert structured content back to Markdown for display if needed, 
    // or render sections individually. We will render sections individually for better UI.

    const handleCopy = () => {
        // Reconstruct a markdown string for copying
        const md = `
# 자기 소개
${content.intro}

# 주요 핵심 역량
${content.keyMatches.map(m => `- **${m.skill}**: ${m.evidence}`).join('\n')}

# 커버 레터
${content.coverLetter}
    `;
        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const md = `
# 자기 소개
${content.intro}

# 주요 핵심 역량
${content.keyMatches.map(m => `- **${m.skill}**: ${m.evidence}`).join('\n')}

# 커버 레터
${content.coverLetter}
    `;
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tailored-portfolio.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-40 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-600" />
                    <span>생성된 결과물</span>
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <PPTGenerator content={content} />
                    <button
                        onClick={handleCopy}
                        className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors active:scale-95"
                    >
                        {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                        {copied ? '복사됨!' : '복사'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors active:scale-95"
                    >
                        <Download size={16} />
                        MD 다운로드
                    </button>
                </div>
            </div>

            <GapAnalysis gapAnalysis={content.gapAnalysis} />

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-slate-900/5 p-8 md:p-12 space-y-10">

                <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">자기 소개</h3>
                    <div className="prose prose-slate prose-blue max-w-none">
                        <ReactMarkdown>{content.intro}</ReactMarkdown>
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">주요 핵심 역량</h3>
                    <div className="grid gap-4">
                        {content.keyMatches.map((match, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-none mt-1">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{match.skill}</h4>
                                    <p className="text-slate-600">{match.evidence}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">커버 레터</h3>
                    <div className="prose prose-slate prose-blue max-w-none bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <ReactMarkdown>{content.coverLetter}</ReactMarkdown>
                    </div>
                </section>

            </div>

            <div className="flex justify-center pt-8 pb-20">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium px-6 py-3 hover:bg-slate-50 rounded-xl"
                >
                    <RefreshCw size={18} />
                    다시 시작하기
                </button>
            </div>
        </div>
    );
}
