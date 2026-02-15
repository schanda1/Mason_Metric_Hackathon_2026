import {useMemo, useState} from 'react'
import './App.css'
import { Button, Card, CardHeader, CardTitle, CardContent} from "@/components/ui"
import { Input } from "@/components/ui/input"
import gradeData from "./assets/cleaned_grades.json";


function App() {
    const [subject, setSubject] = useState("");
    const [courseNum, setCourseNum] = useState("");
    const [professor, setProfessor] = useState("");

    if (!gradeData) {
        return <div className="text-white">Loading Data...</div>;
    }

    const allSubjects = useMemo(() => {
        return [...new Set(gradeData.map(item => item.Subject))].sort();
    }, []);

    const allProfs = useMemo(() => {
        // Safety Check: Ensure gradeData is an array
        if (!Array.isArray(gradeData)) return [];
        return [...new Set(gradeData.map(item => item.Instructor))].sort();
    }, []);

    const availableNumbers = useMemo(() => {
        if (!subject) return [];
        return [...new Set(gradeData.filter(i => i.Subject === subject).map(i => i.Course))].sort();
    }, [subject]);


    const filtered = professor.length > 1
        ? allProfs.filter(p =>
            p && typeof p === 'string' && p.toLowerCase().includes(professor.toLowerCase())
        ).slice(0, 5)
        : [];

    return (
        // BACKGROUND: Changed from dark green to a romantic pink gradient
        <div className="min-h-screen bg-gradient-to-b from-pink-100 to-red-100 text-slate-800 p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    {/* TITLE: Deep Red for contrast */}
                    <h1 className="text-5xl font-extrabold tracking-tight text-red-600 mb-2 drop-shadow-sm">
                        Find Your Perfect Match ❤️
                    </h1>
                    <p className="text-pink-600 font-medium text-lg">
                        (And by match, we mean a professor who gives A's)
                    </p>
                </header>

                <div className="flex flex-wrap justify-center gap-8">
                    {/* Subject Card */}
                    {/* CARD: White background with Pink Border */}
                    <Card className="w-[320px] bg-white border-pink-300 border-4 shadow-xl hover:shadow-2xl transition-all">
                        <CardHeader className="bg-pink-50 rounded-t-lg">
                            <CardTitle className="text-red-500 flex items-center gap-2 text-xl">
                                <span className="bg-red-100 text-red-600 p-2 rounded-full text-sm">❤️</span>
                                Department
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Input
                                placeholder="e.g. CYSE"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value.toUpperCase())}
                                // INPUT: Pink ring when you type
                                className="bg-slate-50 border-pink-200 focus-visible:ring-pink-400 text-lg"
                            />
                        </CardContent>
                    </Card>

                    {/* Course Number Card */}
                    <Card className="w-[320px] bg-white border-pink-300 border-4 shadow-xl hover:shadow-2xl transition-all">
                        <CardHeader className="bg-pink-50 rounded-t-lg">
                            <CardTitle className="text-red-500 flex items-center gap-2 text-xl">
                                <span className="bg-red-100 text-red-600 p-2 rounded-full text-sm">❤️</span>
                                Course #
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Input
                                placeholder="e.g. 214"
                                value={courseNum}
                                onChange={(e) => setCourseNum(e.target.value)}
                                className="bg-slate-50 border-pink-200 focus-visible:ring-pink-400 text-lg"
                            />
                        </CardContent>
                    </Card>

                    {/* Professor Card */}
                    <Card className="w-[320px] bg-white border-pink-300 border-4 shadow-xl hover:shadow-2xl transition-all">
                        <CardHeader className="bg-pink-50 rounded-t-lg">
                            <CardTitle className="text-red-500 flex items-center gap-2 text-xl">
                                <span className="bg-red-100 text-red-600 p-2 rounded-full text-sm">❤️</span>
                                Instructor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Input
                                placeholder="e.g. McDonald"
                                value={professor}
                                onChange={(e) => setProfessor(e.target.value)}
                                className="bg-slate-50 border-pink-200 focus-visible:ring-pink-400 text-lg"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-16 text-center">
                    {/* BUTTON: Hot Pink to Red Gradient */}
                    <Button
                        disabled={!subject || !courseNum}
                        className="bg-gradient-to-r from-red-500 to-pink-500
                        hover:from-red-600 hover:to-pink-600 text-white font-bold
                        px-12 py-8 text-xl rounded-full shadow-lg shadow-pink-300 transition-transform
                        transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        REVEAL MY DATE (DATA) 💘
                    </Button>
                    {(!subject || !courseNum) && (
                        <p className="text-red-400 mt-4 text-sm font-medium animate-pulse">
                            Please enter a Department and Course Number first!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default App