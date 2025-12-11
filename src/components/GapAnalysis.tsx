
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
    gapAnalysis: {
        missingSkills: { skill: string; recommendation: string }[];
        advice: string;
    };
}

export function GapAnalysis({ gapAnalysis }: Props) {
    if (!gapAnalysis) return null;

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-amber-900">역량 분석 및 보완점</h3>
                </div>

                <p className="text-amber-800 mb-6 leading-relaxed">
                    {gapAnalysis.advice}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    {gapAnalysis.missingSkills.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-amber-500">
                                    <Lightbulb size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{item.skill}</h4>
                                    <p className="text-sm text-slate-600 mt-1">{item.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
