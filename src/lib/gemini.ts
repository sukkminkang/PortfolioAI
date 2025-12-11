import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generatePortfolio(apiKey: string, resume: string, jd: string): Promise<GeneratedContent> {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for stability and specify responseMimeType to ensure valid JSON
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    You are an expert career coach and portfolio designer.
    I will provide you with a Resume and a Job Description (JD).
    Your goal is to perform a Gap Analysis, identify missing skills, and generate a tailored portfolio & cover letter.
    
    RESUME:
    ${resume}
    
    JOB DESCRIPTION:
    ${jd}
    
    OUTPUT FORMAT:
    Return the response in **strictly valid JSON format**.
    **IMPORTANT: WRITE THE ENTIRE CONTENT IN KOREAN.**
    
    Structure:
    {
      "intro": "[A professional 2-3 paragraph portfolio intro. If skills are missing, focus on potential, quick learning ability, and relevant foundational skills]",
      "keyMatches": [
        { "skill": "[Skill from JD]", "evidence": "[Evidence from Resume]" }
      ],
      "gapAnalysis": {
        "missingSkills": [
          { "skill": "[Missing Skill]", "recommendation": "[Specific action to learn/demonstrate this skill]" }
        ],
        "advice": "[Overall mentoring advice for this candidate applying to this role. Be encouraging but realistic]"
      },
      "coverLetter": "[A complete professional cover letter. If missing skills, admit it honestly but emphasize eagerness to learn and relevant side-projects/foundation]"
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON cleanup: find the first '{' and the last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("Invalid JSON response received from API");
        }

        const jsonString = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`콘텐츠 생성에 실패했습니다. API 키를 확인해주세요. (${errorMessage})`);
    }
}

export interface GeneratedContent {
    intro: string;
    keyMatches: { skill: string; evidence: string }[];
    gapAnalysis: {
        missingSkills: { skill: string; recommendation: string }[];
        advice: string;
    };
    coverLetter: string;
}
