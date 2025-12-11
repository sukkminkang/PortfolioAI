
import { FileText, Briefcase, Sparkles, AlertCircle, Wand2 } from 'lucide-react';
import { SAMPLE_RESUME, SAMPLE_JD } from '../data/sample';


interface Props {
    resumeText: string;
    setResumeText: (text: string) => void;
    jobDescription: string;
    setJobDescription: (text: string) => void;
    onGenerate: () => void;
    error: string | null;
}

export function InputSection({ resumeText, setResumeText, jobDescription, setJobDescription, onGenerate, error }: Props) {
    const isReady = resumeText.trim().length > 50 && jobDescription.trim().length > 50;

    const fillSampleData = () => {
        setResumeText(SAMPLE_RESUME);
        setJobDescription(SAMPLE_JD);
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Input */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                            <FileText size={18} />
                        </div>
                        <h3>이력서 (Resume)</h3>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="이력서 내용을 여기에 붙여넣으세요..."
                            className="w-full h-80 p-5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none shadow-sm transition-all placeholder:text-slate-300"
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 pointer-events-none bg-white/80 px-2 py-1 rounded-md backdrop-blur">
                            {resumeText.length} 자
                        </div>
                    </div>
                </div>

                {/* JD Input */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                            <Briefcase size={18} />
                        </div>
                        <h3>직무 기술서 (JD)</h3>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="직무 기술서 내용을 여기에 붙여넣으세요..."
                            className="w-full h-80 p-5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 resize-none shadow-sm transition-all placeholder:text-slate-300"
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 pointer-events-none bg-white/80 px-2 py-1 rounded-md backdrop-blur">
                            {jobDescription.length} 자
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-pulse">
                    <AlertCircle size={20} />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="flex justify-center pt-8">
                <button
                    onClick={onGenerate}
                    disabled={!isReady}
                    className={`
            group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-600/20 transition-all duration-300
            ${isReady
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-600/40 hover:-translate-y-1 active:scale-[0.98]'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
          `}
                >
                    {isReady ? <Sparkles size={22} className="animate-spin-slow" /> : <Sparkles size={22} />}
                    <span>맞춤형 포트폴리오 생성하기</span>
                    {isReady && <div className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-ping opacity-50" />}
                </button>
            </div>

            {!isReady && (
                <div className="flex flex-col items-center gap-4 mt-6">
                    <p className="text-center text-slate-400 text-sm">
                        생성을 활성화하려면 두 항목 모두 50자 이상 입력해주세요.
                    </p>
                    <button
                        onClick={fillSampleData}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                        <Wand2 size={14} />
                        샘플 데이터 자동 입력
                    </button>
                </div>
            )}
        </div>
    );
}
