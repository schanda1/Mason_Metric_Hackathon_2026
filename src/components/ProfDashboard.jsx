import React, { useState } from 'react';
import gradeData from '../assets/cleaned_grades.json';
import { PieChart, Tooltip, Pie, CellProps, ResponsiveContainer } from 'recharts';

const ProfDashboard = ()  => {
    const [search, setSearch] = useState("")
    const [selectedProf, setSelectedProf] = useState(null);

    const allProfs = [...new Set(gradeData.map(item => item.Instructor))];

}




