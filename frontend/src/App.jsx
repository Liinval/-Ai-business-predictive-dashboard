import axios from "axios"
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, Users, DollarSign, Sliders } from 'lucide-react';

function App() {
  const [inputs, setInputs] = useState({ marketing: 0.5, users: 0.6, month: 0.66 });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchPrediction = async () => {
  setLoading(true);
  try {
   const  API_BASE_URL =import.meta.env.VITE_API_URL||'http://localhost:5000';
    const response = await axios.post('${API_BASE_URL}/api/predict', inputs);
    
    
    setData(response.data);
  } catch (error) {
    console.error("Error fetching AI prediction with Axios:", error);
  }
  setLoading(false);
};

  useEffect(() => {
    fetchPrediction();
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <header className="flex items-center space-x-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="p-3 bg-indigo-50 rounded-xl">
          <Brain className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Business Predictive Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time prediction analytics using Brain.js neural nets</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center space-x-2 mb-6">
            <Sliders className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900">Simulation Variables</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">Marketing Budget Weight </label>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{inputs.marketing}</span>
              </div>
              <input 
                type="range" name="marketing" min="0" max="1" step="0.05" 
                value={inputs.marketing} onChange={handleInputChange}
                className="w-full accent-indigo-600 bg-slate-100 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">User Acquisition Index</label>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{inputs.users}</span>
              </div>
              <input 
                type="range" name="users" min="0" max="1" step="0.05" 
                value={inputs.users} onChange={handleInputChange}
                className="w-full accent-indigo-600 bg-slate-100 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button 
              onClick={fetchPrediction} 
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition duration-150 ease-in-out disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Processing Model...' : 'Run Simulation Forecast'}
            </button>
          </div>
        </section>

        <div className="lg:col-span-2 space-y-8">
          {data && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Projected Next Month Revenue</p>
                    <p className="text-2xl font-bold text-slate-900">${data.predictedRevenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Model Target Confidence</p>
                    <p className="text-2xl font-bold text-slate-900">{(data.accuracy * 100)}% Accuracy</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue Projections Timeline</h3>
                  <div className="w-full h-[260px]">
                    <ResponsiveContainer width="99%" height="100%">
                      <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="actualRevenue" stroke="#10B981" strokeWidth={3} name="Actual" />
                        <Line type="monotone" dataKey="predictedRevenue" stroke="#EF4444" strokeWidth={3} strokeDasharray="6 6" name="AI Forecast" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Simulated Platform Scaling</h3>
                  <div className="w-full h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Active Growth" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
  
