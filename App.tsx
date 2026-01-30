
import React, { useState, useCallback } from 'react';
import { EstimationInputs, EstimationResults, Tab } from './types';
import CostEstimatorForm from './components/CostEstimatorForm';
import EstimateResultsView from './components/EstimateResultsView';
import BatchProcessView from './components/BatchProcessView';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<EstimationInputs>({
    homeCountry: 'Finland',
    hostCountry: 'Brazil',
    monthlySalary: 7000,
    durationMonths: 6,
    dailyAllowance: 72,
    workingDaysPerMonth: 22,
  });

  const [results, setResults] = useState<EstimationResults | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SINGLE);

  const calculateEstimate = useCallback(() => {
    const baseSalaryTotal = inputs.monthlySalary * inputs.durationMonths;
    const perDiemTotal = inputs.dailyAllowance * inputs.workingDaysPerMonth * inputs.durationMonths;
    
    const adminFees = 2450;
    const hostTax = baseSalaryTotal * 0.25;
    const hostSocialSecurity = baseSalaryTotal * 0.35;

    setResults({
      baseSalary: baseSalaryTotal,
      perDiem: perDiemTotal,
      adminFees: adminFees,
      hostTax: hostTax,
      hostSocialSecurity: hostSocialSecurity,
      totalAdditionalCost: perDiemTotal + adminFees + hostTax + hostSocialSecurity
    });
  }, [inputs]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-8 max-w-7xl mx-auto">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-[#EEEEEE] overflow-hidden">
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#181C31]">Cost Estimation Module</h1>
              <p className="text-[#83849E] text-sm mt-1">
                {activeTab === Tab.SINGLE 
                  ? "Estimate international deployment costs for a single individual." 
                  : "Upload a bulk list of employees to generate simultaneous cost estimates."}
              </p>
            </div>
            <div className="flex border-b border-[#EEEEEE] w-full md:w-auto">
              {Object.values(Tab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === Tab.BATCH) setResults(null);
                  }}
                  className={`px-6 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-[#181C31] border-b-2 border-[#40AEBC]' 
                      : 'text-[#83849E] hover:text-[#181C31]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === Tab.SINGLE ? (
            <CostEstimatorForm 
              inputs={inputs} 
              setInputs={setInputs} 
              onGenerate={calculateEstimate} 
            />
          ) : (
            <BatchProcessView />
          )}
        </div>
      </div>

      {activeTab === Tab.SINGLE && results && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <EstimateResultsView inputs={inputs} results={results} />
        </div>
      )}
    </div>
  );
};

export default App;
