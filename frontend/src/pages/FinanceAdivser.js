import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const generationConfig = {
  temperature: 0.4,
  topP: 0.4,
  topK: 64,
  responseMimeType: 'text/plain',
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", generationConfig
});
// export async funtion run
let conversationHistory = [];
const MAX_HISTORY = 3;

const prompt = `You are a financial adviser. Your sole task is to provide actionable advice to reduce expenses and increase income based on the provided data
Here is the format of the data:

Income: Lists of income sources with their types (e.g., salary, freelancing, investments, etc.) and amounts.
Expenses: Lists of expenses with their types (e.g., food, rent, entertainment, etc.) and amounts.
Objective: Analyze the data, identify unnecessary or excessive expenses, and suggest practical ways to reduce them. Similarly, identify potential opportunities to enhance or diversify income sources.

Rules:
Focus only on reducing expenses and increasing income.
Be concise and actionable.
Provide insights for both short-term and long-term improvements.
Example Input Data:
Income:
Salary: $4000/month
Freelancing: $500/month
Expenses:
Rent: $1200/month
Food: $600/month
Entertainment: $400/month
Subscriptions: $200/month
Expected Output:
Reduce Expenses:
Consider cutting back on subscriptions and canceling unused services ($200/month).
Limit entertainment expenses by opting for free or low-cost activities.
Increase Income:
Explore additional freelancing opportunities to utilize spare time.
Invest in upskilling to negotiate a salary increase or switch to higher-paying roles.`;



const prompt1 = `You are an analysis bot that compares financial datasets and provides actionable insights. Below are two datasets for monthly income and expenses from two individuals (or time periods). Compare the datasets, identify key differences, and suggest improvements to optimize savings and reduce unnecessary expenses.

Dataset 1:
Income:

Salary: $4000/month
Freelancing: $500/month
Expenses:

Rent: $1200/month
Food: $600/month
Entertainment: $400/month
Subscriptions: $200/month
Dataset 2:
Income:

Salary: $3500/month
Freelancing: $800/month
Expenses:

Rent: $1000/month
Food: $700/month
Entertainment: $500/month
Subscriptions: $250/month
Key Instructions:

Compare the income and expense structures between Dataset 1 and Dataset 2.
Highlight areas where savings are possible in both datasets.
Provide actionable insights to improve savings and optimize spending in both cases.
Suggest whether adjustments in income sources (like freelancing) or expense allocations (like entertainment or subscriptions) are needed.
`;

const updateHistory = (role, message) => {
  conversationHistory.push({ role, parts: [{ text: message }] });
  if (conversationHistory.length > MAX_HISTORY * 2) {
    // *2 because each exchange has user + model messages
    conversationHistory = conversationHistory.slice(-MAX_HISTORY * 2);
  }
};



export default async function run(user_input) {
  const chatSession = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          { text: prompt },
        ],
      },
      ...conversationHistory,
    ],
  });

  updateHistory("user", user_input);
    // updateHistory("model", response);
  console.log("user_input", user_input);
  const result = await chatSession.sendMessage(user_input);
  return result.response.text();
}


export async function run1(user_input) {
  const chatSession = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          { text: prompt1 },
        ],
      },
      ...conversationHistory,
    ],
  });

  updateHistory("user", user_input);
    // updateHistory("model", response);
  console.log("user_input", user_input);
  const result = await chatSession.sendMessage(user_input);
  return result.response.text();
}
