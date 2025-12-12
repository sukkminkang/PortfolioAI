import { useState } from 'react';
import { Copy, RefreshCw, Sparkles } from 'lucide-react';
import { type GeneratedContent } from '../lib/gemini';
import { PPTGenerator } from './PPTGenerator';

interface Props {
    content: GeneratedContent;
    onReset: () => void;
}

export function ResultDisplay({ content, onReset }: Props) {
    const [copied, setCopied] = useState(false);

    // [에러 방지] 데이터가 없거나 프로젝트 배열이 깨졌을 경우 안전하게 처리
    if (!content || !content.projects) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">데이터를 불러오는 데 실패했습니다.</p>
                <button onClick={onReset} className="px-4 py-2 bg-slate-200 rounded">다시 시도</button>
            </div>
        );
    }

    const handleCopy = () => {
        const md = `
# 지원자: ${content.candidateName}
# 비전: ${content.vision}
${content.projects.map(p => `## ${p.title}\n- 요약: ${p.summary}`).join('\n')}
        `;
        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-40 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-600" />
                    <span>생성된 포트폴리오 (보고서형)</span>
                </h2>
                <div className="flex gap-2">
                    <PPTGenerator content={content} />
                    <button onClick={handleCopy} className="px-4 py-2 border rounded hover:bg-slate-50 text-sm">
                        {copied ? "복사됨" : "텍스트 복사"}
                    </button>
                    <button onClick={onReset} className="px-4 py-2 text-slate-500 hover:text-blue-600">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* 웹 미리보기 (PDF 보고서 스타일) */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 min-h-[600px]">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">{content.candidateName}</h1>
                    <p className="text-slate-500">{content.targetPosition} 지원 포트폴리오</p>
                </div>

                <div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-lg mb-2 text-blue-900">Future Vision</h3>
                    <p className="text-slate-700 leading-relaxed">{content.vision}</p>
                </div>

                <div className="space-y-12">
                    {/* [에러 방지] projects가 있을 때만 map 실행 */}
                    {content.projects?.map((proj, i) => (
                        <div key={i} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {i + 1}. {proj.title}
                                    </h3>
                                    <span className="text-sm text-slate-500">{proj.period}</span>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg text-blue-900 mb-6 text-sm">
                                <strong>Summary:</strong> {proj.summary}
                            </div>
                            
                            {/* 3단계 프로세스 도식 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                                {proj.processSteps?.map((step, idx) => (
                                    <div key={idx} className="relative bg-white border border-slate-300 p-3 text-center rounded shadow-sm">
                                        <div className="text-xs font-bold text-slate-400 mb-1">STEP {idx + 1}</div>
                                        <div className="text-sm font-semibold text-slate-800">{step}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 주요 질문 (Q&A) */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-700 border-l-4 border-blue-500 pl-2">직면했던 주요 이슈 & 해결</h4>
                                {proj.keyQuestions?.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-slate-50 p-3 rounded">
                                        <div className="text-sm font-bold text-slate-800 mb-1">Q. {q.question}</div>
                                        <div className="text-sm text-slate-600">A. {q.answer}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}