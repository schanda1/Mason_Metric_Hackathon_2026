import { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// IMPORTANT: Import the NEW file we just created!
// (If your script saved it in src/assets, this path is correct)
import gradeData from "./assets/final_data.json";

const ResultsView = ({ subject, courseNum, initialProfessor, onBack }) => {
    const [selectedProfessor, setSelectedProfessor] = useState(initialProfessor || null);

    // 1. FILTER: Specific Column Match (Safe & Clean!)
    const courseData = useMemo(() => {
        return gradeData.filter(item => {
            // Now we can trust the keys because the Python script fixed them!
            const dataSubject = item.subject; // Already uppercase
            const searchSubject = subject.toUpperCase().trim();

            const dataCourse = String(item.course_num);
            const searchCourse = courseNum.trim();

            // Exact Match Logic
            return dataSubject === searchSubject && dataCourse === searchCourse;
        });
    }, [subject, courseNum]);

    // 2. AGGREGATE: Group by Instructor
    const professorList = useMemo(() => {
        const groups = {};

        courseData.forEach(row => {
            const instructorName = row.instructor;

            if (!groups[instructorName]) {
                groups[instructorName] = {
                    name: instructorName,
                    totalStudents: 0,
                    passed: 0,
                    a_count: 0
                };
            }

            // Grades are now simple integers (0, 5, 10, etc.)
            const a = row.A;
            const b = row.B;
            const c = row.C;
            const total = row.total_students;

            groups[instructorName].totalStudents += total;
            groups[instructorName].passed += (a + b + c);
            groups[instructorName].a_count += a;
        });

        // Sort by "A Rate" (Best professors at the top)
        return Object.values(groups).map(p => ({
            ...p,
            passRate: p.totalStudents > 0 ? ((p.passed / p.totalStudents) * 100).toFixed(0) : 0,
            aRate: p.totalStudents > 0 ? ((p.a_count / p.totalStudents) * 100).toFixed(0) : 0
        })).sort((a, b) => b.aRate - a.aRate);

    }, [courseData]);

    // 3. STATS: For Selected Professor (Detail View)
    const activeStats = useMemo(() => {
        if (!selectedProfessor) return null;

        const relevantData = courseData.filter(i => i.instructor === selectedProfessor);

        let acc = { A: 0, B: 0, C: 0, D: 0, F: 0, W: 0, Total: 0 };
        relevantData.forEach(row => {
            acc.A += row.A;
            acc.B += row.B;
            acc.C += row.C;
            acc.D += row.D;
            acc.F += row.F;
            acc.W += row.W;
            acc.Total += row.total_students;
        });
        return acc;
    }, [courseData, selectedProfessor]);

    const getPercent = (val, total) => total > 0 ? ((val / total) * 100).toFixed(1) : 0;

    // --- NO MATCHES SCREEN ---
    if (courseData.length === 0) {
        return (
            <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
                <h2 className="text-4xl font-extrabold text-slate-300 mb-4">💔</h2>
                <h2 className="text-2xl font-bold text-slate-600 mb-2">No Matches Found</h2>
                <p className="text-slate-400 mb-8">
                    We couldn't find any data for <strong>{subject} {courseNum}</strong>.
                </p>
                <div className="bg-slate-100 p-4 rounded text-xs text-slate-500 max-w-md mx-auto mb-4">
                    <strong>Debug Tip:</strong> Check if your search matches this format:
                    <br/>Subject: "{subject.toUpperCase()}" (e.g. IT)
                    <br/>Course: "{courseNum}" (e.g. 214)
                </div>
                <Button onClick={onBack} variant="outline" className="border-red-400 text-red-500 hover:bg-red-50">
                    Try Another Search
                </Button>
            </div>
        )
    }

    // --- RENDER: DETAIL VIEW ---
    if (selectedProfessor && activeStats) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <header className="text-center mb-10">
                    <Button
                        onClick={() => setSelectedProfessor(null)}
                        variant="ghost"
                        className="mb-4 text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                    >
                        ← Back to Matches
                    </Button>
                    <h2 className="text-4xl font-extrabold text-red-600 mb-2">
                        {selectedProfessor} ❤️
                    </h2>
                    <p className="text-slate-500 text-lg">
                        {subject} {courseNum} Compatibility Report
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="border-pink-300 border-4 shadow-xl">
                        <CardHeader className="bg-pink-50">
                            <CardTitle className="text-red-500 text-center">PASS RATE (A-C)</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-center">
                            <div className="text-6xl font-black text-pink-600 mb-4">
                                {getPercent(activeStats.A + activeStats.B + activeStats.C, activeStats.Total)}%
                            </div>
                            <p className="text-slate-500">Students passed this class</p>
                        </CardContent>
                    </Card>

                    <Card className="border-pink-300 border-4 shadow-xl">
                        <CardHeader className="bg-pink-50">
                            <CardTitle className="text-red-500 text-center">Grade Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                                <div key={grade} className="flex items-center gap-4">
                                    <span className="font-bold w-8 text-slate-700">{grade}</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-red-400 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${getPercent(activeStats[grade], activeStats.Total)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-slate-500 w-12 text-right">
                                        {getPercent(activeStats[grade], activeStats.Total)}%
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // --- RENDER: LIST VIEW ---
    return (
        <div className="animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto">
            <header className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-red-600 mb-2">
                    {subject} {courseNum} Matches 💘
                </h2>
                <p className="text-pink-600 text-lg">
                    We found {professorList.length} potential matches for you.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professorList.map((prof) => (
                    <Card
                        key={prof.name}
                        onClick={() => setSelectedProfessor(prof.name)}
                        className="cursor-pointer hover:scale-105 transition-transform border-2 border-pink-100 hover:border-red-400 hover:shadow-lg"
                    >
                        <CardContent className="p-6 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">{prof.name}</h3>
                                <p className="text-slate-500 text-sm">{prof.totalStudents} students graded</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-red-500">{prof.aRate}%</div>
                                <div className="text-xs text-pink-400 font-bold">A-RATE</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="border-red-400 text-red-500 hover:bg-red-50"
                >
                    ← Search Again
                </Button>
            </div>
        </div>
    );
};

export default ResultsView;