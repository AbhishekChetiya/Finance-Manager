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
import run from "./FinanceAdivser";
import ReactMarkdown from "react-markdown";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const FinancialChart = () => {
    const [chartType, setChartType] = useState("bar");
    const [timePeriod, setTimePeriod] = useState("month");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chartData, setChartData] = useState(null);
    const [chartData1, setChartData1] = useState(null);
    const [generatedText, setgeneratedText] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateAnalysisText = async () => {
        // Simulate fetching text (replace this with an API call if needed)
        const fetchedText = await run(JSON.stringify(analysis));
        setgeneratedText(fetchedText);
    };

    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await main.get("/main/financial-records/", {
                params: {
                    time_period: timePeriod, // year, month, week
                    date: selectedDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
                },
            });
            const formattedData = formatData(response.data);
            setChartData(formattedData);
            console.log("Data fetched successfully:", formattedData);
        } catch (error) {
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

    // Format data for the chart
    const formatData = (data) => {
        let income = 0;
        let expense = 0;
        var dic = {};
        const labels = [];
        const amounts = [];
        let ana = new Map();
        data.forEach((record) => {
            const key = `${record.type}-${record.CATEGORY_CHOICES}`; // Create a unique key using type and CATEGORY_CHOICES
            if (ana[key]) {
                ana[key] += record.amount; // If key exists, add the amount
            } else {
                ana[key] = record.amount; // If key doesn't exist, set the initial amount
            }
            if (record.CATEGORY_CHOICES === "income") {
                income += record.amount;
            } else if (record.CATEGORY_CHOICES === "expense") {
                expense += record.amount;
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
        setAnalysis(ana);
        console.log(amounts)
        // Generate background colors dynamically
        const backgroundColors = generateRandomColors(labels.length);
        setChartData1({
            labels: ["Income", "Expense"],
            datasets: [
                {
                    label: "Financial Records",
                    data: [income, expense],
                    backgroundColor: ["#4CAF50", "#F44336"],
                    borderWidth: 1,
                },
            ],
        });

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
    }, [timePeriod, selectedDate]);

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                {/* Date Picker */}
                <div className="flex items-center space-x-4">
                    <input
                        type="date"
                        value={selectedDate.toISOString().split("T")[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="border rounded p-2"
                    />
                    {/* Time Period Selector */}
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="year">Yearly</option>
                        <option value="month">Monthly</option>
                        <option value="week">Weekly</option>
                    </select>
                </div>

                {/* Chart Type Selector */}
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
            </div>

            {/* Chart */}
            <div className="flex flex-wrap md:flex-nowrap justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/2 h-[400px]">
                    {chartData && chartType === "bar" && <Bar data={chartData} options={{ responsive: true }} />}
                    {chartData && chartType === "pie" && <Pie data={chartData} options={{ responsive: true }} />}
                </div>
                <div className="w-full md:w-1/2 h-[400px]">
                    {chartData1 && chartType === "bar" && <Bar data={chartData1} options={{ responsive: true }} />}
                    {chartData1 && chartType === "pie" && <Pie data={chartData1} options={{ responsive: true }} />}
                </div>
            </div>

            <div className="mt-4">
                <button
                    onClick={() => {
                        setLoading(true);
                        generateAnalysisText();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Generate Analysis
                </button>
                {loading && !generatedText && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            Loading...
                        </h3>
                    </div>
                )}

                {generatedText && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            Analysis Insights
                        </h3>
                        <p className="text-gray-700 italic">
                            <ReactMarkdown>{generatedText}</ReactMarkdown>
                        </p>
                    </div>
                )}

                {/* Check if email exists and render the email form if present */}
                {/* {email && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            Send an Email
                        </h3>
                        <form action={`mailto:${email}`} method="get">
                            <div>
                                <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    id="email-subject"
                                    name="subject"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Subject of the email"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="email-body" className="block text-sm font-medium text-gray-700">Body</label>
                                <textarea
                                    id="email-body"
                                    name="body"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Your message"
                                    rows="4"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Send Email
                            </button>
                        </form>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default FinancialChart;
