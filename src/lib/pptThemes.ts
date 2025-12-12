export interface PPTTheme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        text: string;
        background: string;
        headerText: string;
    };
    fonts: {
        title: string;
        body: string;
    };
}

// 오직 sample.pptx 스타일 하나만 정의
export const themes: PPTTheme[] = [
    {
        name: "Sample Style (Blue & White)",
        colors: {
            primary: '1F497D',   
            secondary: '4F81BD', 
            accent: 'C0504D',    
            text: '333333',      
            background: 'FFFFFF', 
            headerText: 'FFFFFF'  
        },
        fonts: { title: 'Arial', body: 'Arial' }
    }
];

// lineLimit 제거하여 경고 해결
export const getAdaptiveFontSize = (text: string | undefined, baseSize: number): number => {
    if (!text) return baseSize;
    const length = text.length;
    const lines = text.split('\n').length;
    
    if (length > 400 || lines > 15) return baseSize * 0.6;
    if (length > 250 || lines > 10) return baseSize * 0.75;
    if (length > 150 || lines > 8) return baseSize * 0.85;
    
    return baseSize;
};