import pptxgen from 'pptxgenjs';
import { Presentation } from 'lucide-react';
import { type GeneratedContent } from '../lib/gemini';

interface Props {
    content: GeneratedContent;
}

// [추가됨] 텍스트 길이에 따라 폰트 크기를 자동으로 조절하는 함수
const getSmartFontSize = (text: string, baseSize: number, charLimit: number = 100): number => {
    if (!text) return baseSize;
    const length = text.length;
    // 글자 수가 기준보다 많으면 폰트 크기를 줄임 (최소 60%까지)
    if (length > charLimit * 1.5) return baseSize * 0.75;
    if (length > charLimit) return baseSize * 0.9;
    return baseSize;
};

export function PPTGenerator({ content }: Props) {

    const generatePPT = async () => {
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches

        const theme = {
            primary: "003366",   // 짙은 남색
            secondary: "336699", // 파랑
            text: "333333",      
            gray: "F4F6F8",      // 아주 연한 회색 배경
            white: "FFFFFF"
        };

        // --- Slide 1: Cover ---
        const cover = pres.addSlide();
        
        // 상단 장식선
        cover.addShape(pres.ShapeType.rect, { x: 0, y: 0.5, w: 10, h: 0.15, fill: { color: theme.primary } });
        
        // 메인 타이틀
        cover.addText("프로젝트 포트폴리오", {
            x: 0, y: 1.5, w: 10, h: 1.0,
            fontSize: 44, bold: true, color: theme.primary, align: 'center', fontFace: 'Arial'
        });

        // 목차
        cover.addText(`I. 주요 수행 프로젝트\nII. ${content.targetPosition}에서의 향후 비전`, {
            x: 2.5, y: 3.0, w: 6.0, h: 1.5,
            fontSize: 18, color: theme.text, align: 'left', lineSpacing: 32
        });

        // 하단 정보
        cover.addText(`${new Date().toLocaleDateString()}\n지원자  ${content.candidateName}`, {
            x: 6.5, y: 4.8, w: 3.0, h: 0.8,
            fontSize: 14, color: theme.text, align: 'right'
        });

        // --- Slide 2+: Projects (레이아웃 간격 조정) ---
        if (content.projects) {
            content.projects.forEach((proj, idx) => {
                const slide = pres.addSlide();

                // 1. 헤더 (위치: y=0.3)
                slide.addText(`${idx + 1}. 주요 수행 프로젝트 : ${proj.title}`, {
                    x: 0.4, y: 0.3, w: 9.2, h: 0.5,
                    fontSize: 20, bold: true, color: theme.primary
                });
                
                // 2. 요약 박스 (위치: y=0.9, 높이 확보)
                // 텍스트가 길 경우 폰트 줄임 (기본 14pt)
                const sumFontSize = getSmartFontSize(proj.summary, 14, 150);
                slide.addText(proj.summary, {
                    x: 0.5, y: 0.9, w: 9.0, h: 0.8, // 높이 0.8로 늘림
                    fontSize: sumFontSize, color: theme.text, 
                    fill: { color: theme.gray }, valign: 'middle', 
                    rectRadius: 0.1 // 둥근 모서리 약간
                });

                // 3. 3단계 프로세스 도식 (위치: y=2.0 -> 조금 더 아래로 내려서 겹침 방지)
                const stepY = 1.9;
                const stepW = 2.8;
                const stepGap = 0.3;
                
                proj.processSteps.forEach((step, sIdx) => {
                    const xPos = 0.5 + (stepW + stepGap) * sIdx;
                    
                    // 화살표 도형
                    slide.addShape(pres.ShapeType.chevron, { 
                        x: xPos, y: stepY, w: stepW, h: 0.7, 
                        fill: { color: theme.secondary, transparency: sIdx * 20 },
                        line: { color: theme.white, width: 1.5 }
                    });
                    
                    // Step 텍스트 (길면 축소)
                    const stepFontSize = getSmartFontSize(step, 12, 40);
                    slide.addText(`STEP ${sIdx + 1}\n${step}`, {
                        x: xPos + 0.2, y: stepY, w: stepW - 0.4, h: 0.7, 
                        fontSize: stepFontSize, color: "FFFFFF", align: 'center', valign: 'middle'
                    });
                });

                // 4. Q&A 섹션 (위치: y=2.9 시작)
                slide.addText("주요 이슈 및 해결 과정", {
                    x: 0.5, y: 2.8, w: 4.0, h: 0.4,
                    fontSize: 16, bold: true, color: theme.primary
                });

                // 질문 간격(Gap)을 충분히 둠
                proj.keyQuestions.forEach((q, qIdx) => {
                    // 시작점 3.3부터, 각 항목당 0.75 높이 할당
                    const qY = 3.3 + (qIdx * 0.75); 
                    
                    // 질문 (Q) - 한 줄 처리
                    const qFontSize = getSmartFontSize(q.question, 12, 80);
                    slide.addText(`Q. ${q.question}`, {
                        x: 0.5, y: qY, w: 9.0, h: 0.3, 
                        fontSize: qFontSize, bold: true, color: theme.secondary
                    });
                    
                    // 답변 (A) - 텍스트 양에 따라 폰트 조절
                    const aFontSize = getSmartFontSize(q.answer, 11, 120);
                    slide.addText(`A. ${q.answer}`, {
                        x: 0.8, y: qY + 0.3, w: 8.7, h: 0.4, 
                        fontSize: aFontSize, color: theme.text, valign: 'top'
                    });
                });
            });
        }

        // --- Slide 3: Vision ---
        const vSlide = pres.addSlide();
        vSlide.addText(`II. 향후 비전`, { 
            x: 0.5, y: 0.3, w: 9.0, h: 0.5, fontSize: 20, bold: true, color: theme.primary 
        });
        
        // 비전 박스
        vSlide.addShape(pres.ShapeType.rect, { 
            x: 1.0, y: 1.5, w: 8.0, h: 3.0, 
            fill: { color: theme.gray }, line: { color: theme.secondary, width: 2 } 
        });
        
        const vFontSize = getSmartFontSize(content.vision, 20, 200);
        vSlide.addText(content.vision, { 
            x: 1.5, y: 2.0, w: 7.0, h: 2.0, 
            fontSize: vFontSize, color: theme.text, align: 'center', lineSpacing: vFontSize * 1.5
        });

        await pres.writeFile({ fileName: "Consulting_Report_Portfolio.pptx" });
    };

    return (
        <button
            onClick={generatePPT}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
            <Presentation size={18} />
            <span>보고서형 PPT 다운로드</span>
        </button>
    );
}