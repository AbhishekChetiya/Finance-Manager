import React, { useState, useEffect } from 'react';
import main from '../../main.jsx';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
const FinanceTracker = () => {
    const [data, setData] = useState([]);
    const [maxPage, setMaxPage] = useState(0);
    const { isLogin, setIsLogin } = useAuth();
    const [newTransaction, setNewTransaction] = useState({
        CATEGORY_CHOICES: 'expense',
        amount: '',
        date: '',
        type: ''
    });
    const [currentPage, setCurrentPage] = useState(1);

    const checkLogin = async () => {
        const ACCESS_TOKEN = localStorage.getItem('access');
        const REFRESH_TOKEN = localStorage.getItem('refresh');
        if (ACCESS_TOKEN && REFRESH_TOKEN) {
            setIsLogin(true);
        }
        else if (REFRESH_TOKEN) {
            const res = await main.post("/token/refresh/", { refresh: REFRESH });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsLogin(true);
            }
            else {
                setIsLogin(false);
                Navigate("/login");
            }
        }
        else {
            setIsLogin(false);
            Navigate("/login");
        }
    };
    // Fetch data on initial load
    const getdata = async () => {
        try {
            const res = await main.get("/main/financial-records/", {
                params: {
                    time_period: "week", // year, month, week
                    date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
                    limit: 4,
                    offset: 4 * (currentPage - 1)
                },
            });
            setData(res.data); 
            console.log(res.data);
        // Ensure data is properly set
        } catch (err) {
            console.log(err);
        }
    };
    const getdata1 = async () => {
        try {
            const res = await main.get("/main/financial-records/", {
                params: {
                    time_period: "week", // year, month, week
                    date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
                },
            });
            setMaxPage(res.data.length); // Ensure data is properly set
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        console.log("useEffect");
        getdata1();
        checkLogin();
    }, [])
    useEffect(() => {
        getdata();
    }, [currentPage])

    // Delete transaction
    const deletenode = async (id) => {
        try {
            await main.delete(`main/data/delete/${id}/`);
            getdata();  // Refresh data after deletion
        } catch (err) {
            console.log(err);
        }
    };

    // Create a new transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const res = await main.post('/main/add-data/', {
                CATEGORY_CHOICES: newTransaction.CATEGORY_CHOICES,
                amount: newTransaction.amount,
                created_at: newTransaction.created_at,
                type: newTransaction.type
            });

            if (res.status === 201) {
                alert("Data added successfully");
                getdata();  // Refresh data after adding
            } else {
                alert("Error in adding data");
            }
        } catch (err) {
            alert("Error in adding data");
            console.log(err);
        }
        setNewTransaction({
            CATEGORY_CHOICES: 'expense',
            amount: '',
            created_at: '',
            type: ''
        });
    };

    // Pagination logic
    const itemsPerPage = 4;
    // Calculate total balance
    const totalBalance = data.reduce((acc, transaction) => acc + ((transaction.CATEGORY_CHOICES === 'expense') ? -1 * transaction.amount : transaction.amount), 0);

    // Pagination handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-6">
                    <h1 className="text-2xl font-bold">
                        {`First ${(currentPage - 1) * 4 + 1} to ${Math.min(maxPage, currentPage * 4)} Transactions of This Week`}
                    </h1>
                    <div className="mt-4">
                        <p className="text-sm">Total Balance</p>
                        <p className={`text-3xl font-extrabold ${totalBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            ${Math.abs(totalBalance).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Data Table */}
                <div className="p-6">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-100 text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((transaction) => (
                                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{transaction.created_at}</td>
                                    <td className="px-4 py-3">{transaction.type}</td>
                                    <td className={`px-4 py-3 font-semibold ${transaction.CATEGORY_CHOICES === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => deletenode(transaction.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {Math.ceil(maxPage / itemsPerPage)}
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={(currentPage === Math.ceil(maxPage / itemsPerPage))}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Transaction Form */}
                <div className="p-6 bg-gray-100 border-t">
                    <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
                    <form onSubmit={handleAddTransaction} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={newTransaction.CATEGORY_CHOICES}
                                onChange={(e) => setNewTransaction({
                                    ...newTransaction,
                                    CATEGORY_CHOICES: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={newTransaction.type}
                                onChange={(e) => setNewTransaction({
                                    ...newTransaction,
                                    type: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            >
                                <option value="" disabled>Select a type</option>
                                {newTransaction.CATEGORY_CHOICES === 'expense' && (
                                    <>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Rent">Rent</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Food and Dining">Food and Dining</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Loans">Loans</option>
                                        <option value="Gifts">Gifts</option>
                                        <option value="Charity">Charity</option>
                                        <option value="Subscriptions">Subscriptions</option>
                                        <option value="Pets">Pets</option>
                                        <option value="Household">Household</option>
                                        <option value="Childcare">Childcare</option>
                                        <option value="Fitness">Fitness</option>
                                        <option value="Taxes">Taxes</option>
                                        <option value="Vacation">Vacation</option>
                                        <option value="Hobbies">Hobbies</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Beauty">Beauty</option>
                                    </>
                                )}
                                {newTransaction.CATEGORY_CHOICES === 'income' && (
                                    <>
                                        <option value="Salary">Salary</option>
                                        <option value="Investment">Investment</option>
                                        <option value="Savings">Savings</option>
                                        <option value="Business">Business</option>
                                        <option value="Emergency Fund">Emergency Fund</option>
                                        <option value="Other">Other</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={newTransaction.amount}
                                onChange={(e) => setNewTransaction({
                                    ...newTransaction,
                                    amount: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                                step="0.01"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={newTransaction.created_at}
                                onChange={(e) => setNewTransaction({
                                    ...newTransaction,
                                    created_at: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Add Transaction
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FinanceTracker;
