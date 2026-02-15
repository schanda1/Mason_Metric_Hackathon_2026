import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import ResultsView from './ResultsView';

function App() {
    // STATE: Tracks which "page" we are on
    const [view, setView] = useState('search');

    // STATE: Form Data
    const [subject, setSubject] = useState("");
    const [courseNum, setCourseNum] = useState("");
    const [professor, setProfessor] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-100 to-red-100 text-slate-800 p-10 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* VIEW 1: SEARCH FORM */}
                {view === 'search' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <header className="text-center mb-12">
                            <h1 className="text-5xl font-extrabold tracking-tight text-red-600 mb-2 drop-shadow-sm">
                                Find Your Perfect Match ❤️
                            </h1>
                            <p className="text-pink-600 font-medium text-lg">
                                (And by match, we mean a professor who gives A's)
                            </p>
                        </header>

                        <div className="flex flex-wrap justify-center gap-8">
                            {/* Subject Card */}
                            <Card className="w-[320px] bg-white border-pink-300 border-4 shadow-xl hover:shadow-2xl transition-all">
                                <CardHeader className="bg-pink-50 rounded-t-lg">
                                    <CardTitle className="text-red-500 flex items-center gap-2 text-xl">
                                        <span className="bg-red-100 text-red-600 p-2 rounded-full text-sm">01</span>
                                        Department
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Input
                                        placeholder="e.g. CYSE"
                                        value={subject}
                                        // FIX: Removed .toUpperCase() so you can type normally
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="bg-slate-50 border-pink-200 focus-visible:ring-pink-400 text-lg uppercase placeholder:normal-case"
                                    />
                                </CardContent>
                            </Card>

                            {/* Course Number Card */}
                            <Card className="w-[320px] bg-white border-pink-300 border-4 shadow-xl hover:shadow-2xl transition-all">
                                <CardHeader className="bg-pink-50 rounded-t-lg">
                                    <CardTitle className="text-red-500 flex items-center gap-2 text-xl">
                                        <span className="bg-red-100 text-red-600 p-2 rounded-full text-sm">02</span>
                                        Course #
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Input
                                        placeholder="e.g. 214"
                                        value={courseNum}
                                        // FIX: Removed .trim() so you can type spaces if needed
                                        onChange={(e) => setCourseNum(e.target.value)}
                                        className="bg-slate-50 border-pink-200 focus-visible:ring-pink-400 text-lg"
                                    />
                                </CardContent>
                            </Card>

                            {/* Professor Card */}
                            <Card className="w-[320px] bg-white border-pink-300 border-4 shadow-xl hover:shadow-2xl transition-all">
                                <CardHeader className="bg-pink-50 rounded-t-lg">
                                    <CardTitle className="text-red-500 flex items-center gap-2 text-xl">
                                        <span className="bg-red-100 text-red-600 p-2 rounded-full text-sm">03</span>
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
                            <Button
                                disabled={!subject || !courseNum}
                                onClick={() => setView('results')}
                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-12 py-8 text-xl rounded-full shadow-lg shadow-pink-300 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                REVEAL MY DATE (DATA) 💘
                            </Button>
                        </div>
                    </div>
                )}

                {/* VIEW 2: RESULTS */}
                {view === 'results' && (
                    <ResultsView
                        subject={subject}
                        courseNum={courseNum}
                        initialProfessor={professor}
                        onBack={() => setView('search')}
                    />
                )}

            </div>
        </div>
    )
}

export default App