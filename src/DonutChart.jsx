const DonutChart = ({ passPercent, failPercent, size = 160 }) => {
    // show a gray placeholder if no data
    if (passPercent === 0 && failPercent === 0) {
        return (
            <div
                className="flex items-center justify-center text-slate-300 font-bold border-4 border-slate-100 rounded-full"
                style={{ width: size, height: size }}
            >
                No Data
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Pie Layer */}
            <div
                className="absolute inset-0 rounded-full shadow-sm"
                style={{
                    background: `conic-gradient(#4ade80 0% ${passPercent}%, #f87171 ${passPercent}% 100%)`
                }}
            />
            {/* Make Donut "hole" */}
            <div className="absolute bg-white rounded-full flex flex-col items-center justify-center shadow-inner"
                 style={{ width: size * 0.70, height: size * 0.70 }}>
                <span className="text-3xl font-black text-green-500">{passPercent}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PASS</span>
            </div>
        </div>
    );
};

export default DonutChart;