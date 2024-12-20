import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import main from "../../main";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import run1 from "./FinanceAdivser.jsx";
import ReactMarkdown from "react-markdown";
// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const CompareAnalysis = () => {
    const [chartType, setChartType] = useState("bar");
    const [timePeriod, setTimePeriod] = useState("month");
    const [generatedText, setgeneratedText] = useState("");
    const [analysis1, setAnalysis1] = useState(null);
    const [analysis2, setAnalysis2] = useState(null);
    const [startDate1, setStartDate1] = useState(new Date());
    const [startDate2, setStartDate2] = useState(new Date());
    const [chartData2, setChartData2] = useState(null); // Data for the second chart
    const [loading, setLoading] = useState(false);
    const [chartData1, setChartData1] = useState(null);
    
    const generateAnalysisText = async () => {
        setLoading(true);
        // Simulate fetching text (replace this with an API call if needed)
        const fetchedText = await run1(`dataset1 ${JSON.stringify(analysis1)}, dataset2 ${JSON.stringify(analysis2)}`);
        
        setgeneratedText(fetchedText);
    };
    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await main.get("/main/financial-records/", {
                params: {
                    time_period: timePeriod, // year, month, week
                    date: startDate1.toISOString().split("T")[0], // Format as YYYY-MM-DD
                },
            });
            const response1 = await main.get("/main/financial-records/", {
                params: {
                    time_period: timePeriod, // year, month, week
                    date: startDate2.toISOString().split("T")[0], // Format as YYYY-MM-DD
                },
            });
            console.log(startDate1, startDate2 , timePeriod);
            const formattedData = formatData(response.data,1);
            setChartData1(formattedData);
            console.log("Data fetched successfully:", formattedData);
            const formattedData1 = formatData(response1.data,2);
            setChartData2(formattedData1);
        } 
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };
     // Initialize dictionary

    // Function to generate random colors
    const generateRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            colors.push(color);
        }
        return colors;
    };
  2
    // Format data for the chart
    const formatData = (data,key) => {
        const labels = [];
        const amounts = [];
        var dic = {};
        let ana = new Map();
        data.forEach((record) => {
            // Check if the category already exists in the dictionary
            const key = `${record.type}-${record.CATEGORY_CHOICES}`; // Create a unique key using type and CATEGORY_CHOICES
            if (ana[key]) {
                ana[key] += record.amount; // If key exists, add the amount
            } else {
                ana[key] = record.amount; // If key doesn't exist, set the initial amount
            }
            if (dic[record.type]) {
                dic[record.type] += record.amount; // Accumulate the amount
            } else {
                dic[record.type] = record.amount; // Initialize the category
            }
        });

        // Populate labels and amounts for the chart
        Object.keys(dic).forEach((category) => {
            labels.push(category);
            amounts.push(dic[category]);
        });
        if(key==1)
        setAnalysis1(ana);
        else setAnalysis2(ana);
        // Generate background colors dynamically
        const backgroundColors = generateRandomColors(labels.length);
       
        return {
            labels,
            datasets: [
                {
                    label: "Financial Records",

                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderWidth: 1,
                },
            ],
        };
    };

    // Fetch data when timePeriod or selectedDate changes
    useEffect(() => {
        fetchData();

    }, [timePeriod, startDate1, startDate2]);
   
    // Render UI
    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md w-full">
            {/* Chart Type and Time Period Selector */}
            <div className="flex flex-wrap justify-between items-center space-y-2 md:space-y-0 mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setChartType("bar")}
                        className={`p-2 rounded ${chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Bar Chart
                    </button>
                    <button
                        onClick={() => setChartType("pie")}
                        className={`p-2 rounded ${chartType === "pie" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Pie Chart
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <label className="text-gray-700">Time Period</label>
                    <select
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="border rounded p-2"
                        value={timePeriod}
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>
            </div>

            {/* Date Pickers */}
            <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 space-y-4 md:space-y-0">
                <div className="flex flex-col md:mr-4 w-full md:w-1/2">
                    <label className="block text-gray-700 mb-2">Start Date 1</label>
                    <input
                        type="date"
                        value={startDate1.toISOString().split("T")[0]}
                        onChange={(e) => setStartDate1(new Date(e.target.value))}
                        className="border rounded p-2"
                    />
                </div>
                <div className="flex flex-col md:ml-4 w-full md:w-1/2">
                    <label className="block text-gray-700 mb-2">Start Date 2</label>
                    <input
                        type="date"
                        value={startDate2.toISOString().split("T")[0]}
                        onChange={(e) => setStartDate2(new Date(e.target.value))}
                        className="border rounded p-2"
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="flex flex-wrap md:flex-nowrap justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 h-[400px]">
            {chartData1 && chartType === "bar" && <Bar data={chartData1} options={{ responsive: true }} />}
            {chartData1 && chartType === "pie" && <Pie data={chartData1} options={{ responsive: true }} />}
        </div>
        <div className="w-full md:w-1/2 h-[400px]">
            {chartData2 && chartType === "bar" && <Bar data={chartData2} options={{ responsive: true }} />}
            {chartData2 && chartType === "pie" && <Pie data={chartData2} options={{ responsive: true }} />}
        </div>
    </div>

            {/* Generate Analysis Button */}
            <div className="mt-6">
                <button
                    onClick={generateAnalysisText}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Generate Comparison Analysis
                </button>
                {loading && !generatedText && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Loading...</h3>
                    </div>
                )}
                {generatedText && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Analysis Insights</h3>
                        <p className="text-gray-700 italic">
                            <ReactMarkdown>{generatedText}</ReactMarkdown>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompareAnalysis;
