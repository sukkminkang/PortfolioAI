import { GoogleGenerativeAI } from "@google/generative-ai";

// PDF 보고서형 포트폴리오를 위한 데이터 구조
export interface ProjectQuestion {
    question: string;
    answer: string;
}

export interface Project {
    title: string;
    period: string;
    summary: string;
    processSteps: [string, string, string]; // 단계별 진행 (3단계)
    keyQuestions: ProjectQuestion[]; // Q&A (3개)
}

export interface GeneratedContent {
    candidateName: string;
    targetPosition: string;
    vision: string;
    projects: Project[];
}

export async function generatePortfolio(apiKey: string, resume: string, jd: string): Promise<GeneratedContent> {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 모델명: gemini-1.5-flash-001 (안정적인 버전)
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", 
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    You are a professional portfolio consultant.
    Your task is to restructure the candidate's Resume into a "Project-Based Portfolio" format (Consulting Report Style).

    RESUME:
    ${resume}

    JOB DESCRIPTION:
    ${jd}

    **INSTRUCTIONS:**
    1. Extract candidate's name and target position.
    2. Define a "Vision" relevant to the JD.
    3. Select **top 2 most relevant projects**.
    4. Structure each project EXACTLY as:
       - **Summary**: Concise overview.
       - **Process Steps**: 3 logical steps (e.g., Planning, Dev, Deployment).
       - **Key Questions**: 3 critical technical/business questions faced and how they were solved.

    **IMPORTANT:** **WRITE ALL OUTPUT CONTENT IN KOREAN (한국어).**
    Even though this prompt is in English, the JSON values (summary, questions, answers, vision) MUST be in Korean.

    **OUTPUT JSON FORMAT:**
    {
      "candidateName": "김철수",
      "targetPosition": "프론트엔드 엔지니어",
      "vision": "[회사명]의 핵심 인재로서...",
      "projects": [
        {
          "title": "프로젝트 명",
          "period": "2023.01 - 2023.06",
          "summary": "이 프로젝트는...",
          "processSteps": ["기획 및 설계", "개발 및 구현", "배포 및 운영"],
          "keyQuestions": [
            { "question": "데이터 처리 속도 문제?", "answer": "캐싱을 도입하여 해결..." },
            { "question": "사용자 이탈률?", "answer": "UX 개선을 통해..." },
            { "question": "보안 이슈?", "answer": "암호화 모듈 적용..." }
          ]
        }
      ]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) throw new Error("JSON 파싱 실패");

        const jsonString = text.substring(firstBrace, lastBrace + 1).replace(/```json/g, "").replace(/```/g, "");
        return JSON.parse(jsonString);

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        let msg = error.message || String(error);
        if (msg.includes("404") || msg.includes("not found")) msg = "모델을 찾을 수 없습니다(404). 'gemini-1.5-flash-001' 사용 중인지 확인하세요.";
        throw new Error(`생성 실패: ${msg}`);
    }
}