import { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import gradeData from "./assets/final_data.json";
import DonutChart from './DonutChart';

const ResultsView = ({ subject, courseNum, initialProfessor, onBack }) => {
    const [selectedProfessor, setSelectedProfessor] = useState(initialProfessor || null);

    //Filters data
    const courseData = useMemo(() => {
        return gradeData.filter(item => {
            return item.subject === subject.toUpperCase().trim() &&
                String(item.course_num) === courseNum.trim();
        });
    }, [subject, courseNum]);

    // Aggregates datat
    const courseStats = useMemo(() => {
        let acc = { Passed: 0, Failed: 0, Total: 0 };
        courseData.forEach(row => {
            acc.Passed += (row.A + row.B + row.C);
            acc.Failed += (row.D + row.F + row.W);
            acc.Total += row.total_students;
        });
        return acc;
    }, [courseData]);

    // Professor list - Bottom Half of Screen
    const professorList = useMemo(() => {
        const groups = {};
        courseData.forEach(row => {
            const instr = row.instructor;
            if (!groups[instr]) groups[instr] = { name: instr, totalStudents: 0, passed: 0, a_count: 0 };

            groups[instr].totalStudents += row.total_students;
            groups[instr].passed += (row.A + row.B + row.C);
            groups[instr].a_count += row.A;
        });
        return Object.values(groups).map(p => ({
            ...p,
            passRate: p.totalStudents > 0 ? ((p.passed / p.totalStudents) * 100).toFixed(0) : 0,
            aRate: p.totalStudents > 0 ? ((p.a_count / p.totalStudents) * 100).toFixed(0) : 0
        })).sort((a, b) => b.aRate - a.aRate);
    }, [courseData]);

    // Individual Professor Data
    const activeStats = useMemo(() => {
        if (!selectedProfessor) return null;
        const relevantData = courseData.filter(i => i.instructor === selectedProfessor);
        let acc = { A: 0, B: 0, C: 0, D: 0, F: 0, W: 0, Total: 0 };
        relevantData.forEach(row => {
            acc.A += row.A; acc.B += row.B; acc.C += row.C;
            acc.D += row.D; acc.F += row.F; acc.W += row.W;
            acc.Total += row.total_students;
        });
        return acc;
    }, [courseData, selectedProfessor]);

    const getPercent = (val, total) => total > 0 ? ((val / total) * 100).toFixed(1) : 0;

    // If no matches
    if (courseData.length === 0) {
        return (
            <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
                <h2 className="text-4xl font-extrabold text-slate-300 mb-4">💔</h2>
                <h2 className="text-2xl font-bold text-slate-600 mb-2">No Matches Found</h2>
                {/* FIX: Uppercase here too for consistency */}
                <p className="text-slate-400 mb-8">
                    We couldn't find any data for <strong>{subject.toUpperCase()} {courseNum}</strong>.
                </p>
                <Button onClick={onBack} variant="outline" className="mt-4 border-red-400 text-red-500 hover:bg-red-50">Try Another Search</Button>
            </div>
        )
    }

    //Renders Professor Detailed View
    if (selectedProfessor && activeStats) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <header className="text-center mb-10">
                    <Button onClick={() => setSelectedProfessor(null)} variant="ghost" className="mb-4 text-pink-500 hover:text-pink-700 hover:bg-pink-50">← Back to List</Button>
                    <h2 className="text-4xl font-extrabold text-red-600 mb-2">{selectedProfessor} ❤️</h2>
                    <p className="text-slate-500 text-lg">{subject.toUpperCase()} {courseNum} Compatibility Report</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="border-pink-300 border-4 shadow-xl">
                        <CardHeader className="bg-pink-50"><CardTitle className="text-red-500 text-center">PASS RATE</CardTitle></CardHeader>
                        <CardContent className="pt-6 flex justify-center">
                            <DonutChart
                                passPercent={parseFloat(getPercent(activeStats.A+activeStats.B+activeStats.C, activeStats.Total))}
                                failPercent={parseFloat(getPercent(activeStats.D+activeStats.F+activeStats.W, activeStats.Total))}
                                size={200}
                            />
                        </CardContent>
                    </Card>
                    <Card className="border-pink-300 border-4 shadow-xl">
                        <CardHeader className="bg-pink-50"><CardTitle className="text-red-500 text-center">Grades</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            {['A', 'B', 'C', 'D', 'F', 'W'].map((grade) => (
                                <div key={grade} className="flex items-center gap-4">
                                    <span className="font-bold w-8 text-slate-700">{grade}</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                        <div className={`h-full rounded-full ${['A','B'].includes(grade)?'bg-green-400':['C'].includes(grade)?'bg-yellow-400':'bg-red-400'}`} style={{ width: `${getPercent(activeStats[grade], activeStats.Total)}%` }} />
                                    </div>
                                    <span className="text-sm text-slate-500 w-12 text-right">{getPercent(activeStats[grade], activeStats.Total)}%</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    //Renders Main List View
    const coursePassRate = courseStats.Total > 0 ? ((courseStats.Passed / courseStats.Total) * 100).toFixed(1) : 0;
    const courseFailRate = courseStats.Total > 0 ? ((courseStats.Failed / courseStats.Total) * 100).toFixed(1) : 0;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12 bg-white p-8 rounded-2xl shadow-xl border-2 border-pink-100">
                <div className="text-center md:text-left">
                    <Button onClick={onBack} variant="ghost" className="text-pink-400 mb-2 p-0 hover:bg-transparent hover:text-pink-600">← New Search</Button>

                    <h2 className="text-5xl font-black text-slate-800 mb-2">{subject.toUpperCase()} {courseNum}</h2>

                    <p className="text-slate-500 text-lg">Analyzed {courseStats.Total} student records</p>
                </div>

                <div className="flex items-center gap-6">
                    <DonutChart passPercent={parseFloat(coursePassRate)} failPercent={parseFloat(courseFailRate)} size={160} />
                    <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-full"></div> Passed: {courseStats.Passed}</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div> Failed/W: {courseStats.Failed}</div>
                    </div>
                </div>
            </div>

            {/* Professor List */}
            <h3 className="text-2xl font-bold text-slate-700 mb-6 pl-2 border-l-4 border-red-500">
                Select a Professor ({professorList.length} Found):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professorList.map((prof) => (
                    <Card
                        key={prof.name}
                        onClick={() => setSelectedProfessor(prof.name)}
                        className="cursor-pointer hover:scale-105 transition-transform border-2 border-pink-50 hover:border-red-400 hover:shadow-xl group bg-white"
                    >
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800 group-hover:text-red-600 transition-colors mb-1">{prof.name}</h3>
                                <p className="text-slate-400 text-xs uppercase tracking-wide font-bold">{prof.totalStudents} Graded</p>
                            </div>
                            <div className="flex justify-between items-end mt-6">
                                <div>
                                    <div className="text-3xl font-black text-slate-800">{prof.passRate}%</div>
                                    <div className="text-xs font-bold text-green-500">PASS RATE</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-red-400">{prof.aRate}%</div>
                                    <div className="text-xs font-bold text-red-300">A-RATE</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ResultsView;