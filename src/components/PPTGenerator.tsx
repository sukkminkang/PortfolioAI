import pptxgen from 'pptxgenjs';
import { Presentation } from 'lucide-react';
import { type GeneratedContent } from '../lib/gemini';

interface Props {
    content: GeneratedContent;
}

export function PPTGenerator({ content }: Props) {

    const generatePPT = () => {
        const pres = new pptxgen();

        // --- Slide 1: Title ---
        let slide = pres.addSlide();
        slide.background = { color: 'F0F9FF' }; // Light blue bg
        slide.addText("맞춤형 포트폴리오 제안", { x: 1, y: 3, w: '80%', fontSize: 36, bold: true, color: '0369a1' });
        slide.addText("지원자: [이름]", { x: 1, y: 4, fontSize: 18, color: '64748b' });

        // --- Slide 2: Introduction ---
        slide = pres.addSlide();
        slide.addText("자기 소개", { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: '0369a1' });
        slide.addText(content.intro, { x: 0.5, y: 1.5, w: '90%', fontSize: 14, color: '334155', lineSpacing: 24 });

        // --- Slide 3: Key Matches ---
        slide = pres.addSlide();
        slide.addText("주요 핵심 역량", { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: '0369a1' });

        content.keyMatches.forEach((match, index) => {
            const yPos = 1.5 + (index * 1.2);
            slide.addText(`● ${match.skill}`, { x: 0.5, y: yPos, w: '90%', fontSize: 16, bold: true, color: '0f172a' });
            slide.addText(match.evidence, { x: 0.8, y: yPos + 0.4, w: '85%', fontSize: 14, color: '475569' });
        });

        // --- Slide 4: Gap Analysis & Plan ---
        if (content.gapAnalysis && content.gapAnalysis.missingSkills.length > 0) {
            slide = pres.addSlide();
            slide.addText("역량 강화 계획", { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: 'b45309' }); // Amber theme for gaps

            content.gapAnalysis.missingSkills.forEach((gap, index) => {
                const yPos = 1.5 + (index * 1.5);
                if (yPos < 6) { // Prevent overflow
                    slide.addText(`⚠️ ${gap.skill}`, { x: 0.5, y: yPos, w: '90%', fontSize: 16, bold: true, color: '92400e' });
                    slide.addText(`추천 활동: ${gap.recommendation}`, { x: 0.8, y: yPos + 0.5, w: '85%', fontSize: 14, color: '78350f', italic: true });
                }
            });
        }

        // --- Slide 5: Cover Letter ---
        slide = pres.addSlide();
        slide.addText("커버 레터", { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: '0369a1' });
        slide.addText(content.coverLetter, { x: 0.5, y: 1.5, w: '90%', h: '75%', fontSize: 11, color: '334155', lineSpacing: 18 });

        pres.writeFile({ fileName: "Tailored_Portfolio.pptx" });
    };

    return (
        <button
            onClick={generatePPT}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow active:scale-95"
        >
            <Presentation size={18} />
            <span>PPT 다운로드</span>
        </button>
    );
}
