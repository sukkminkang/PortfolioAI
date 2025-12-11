import { useState, useEffect } from 'react';
import { Sparkles, Github } from 'lucide-react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { InputSection } from './components/InputSection';
import { ResultDisplay } from './components/ResultDisplay';
import { generatePortfolio, type GeneratedContent } from './lib/gemini';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [step, setStep] = useState<'apikey' | 'input' | 'generating' | 'result'>('apikey');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setStep('input');
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setStep('input');
  };

  const handleGenerate = async () => {
    if (!resumeText || !jobDescription) return;

    setStep('generating');
    setError(null);

    try {
      const result = await generatePortfolio(apiKey, resumeText, jobDescription);
      setGeneratedContent(result);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating content.');
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setGeneratedContent(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">PortfolioAI</span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {apiKey && (
              <button
                onClick={() => { localStorage.removeItem('gemini_api_key'); setApiKey(''); setStep('apikey'); }}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                키 초기화
              </button>
            )}
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <a href="https://github.com/google/generative-ai-js" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Github size={20} />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            단 몇 초 만에 완성하는 <span className="text-blue-600">맞춤형 포트폴리오</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            이력서와 직무 기술서(JD)를 붙여넣으세요. Gemini AI가 당신을 위한 맞춤형 소개와 커버 레터를 작성해 드립니다.
          </p>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {step === 'apikey' && (
            <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
          )}

          {step === 'input' && (
            <InputSection
              resumeText={resumeText}
              setResumeText={setResumeText}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onGenerate={handleGenerate}
              error={error}
            />
          )}

          {step === 'generating' && (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-slate-800 animate-pulse">맞춤형 콘텐츠 생성 중...</h3>
              <p className="text-slate-500 mt-2">키워드를 분석하고 역량을 매칭하고 있습니다.</p>
            </div>
          )}

          {step === 'result' && generatedContent && (
            <ResultDisplay
              content={generatedContent}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Sparkles size={14} className="text-blue-500" /> by Antigravity
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
