
import React from 'react';
import { EstimationInputs, EstimationResults } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, ChevronRight, Save, Share2, Check, Download } from 'lucide-react';

interface Props {
  inputs: EstimationInputs;
  results: EstimationResults;
}

const EstimateResultsView: React.FC<Props> = ({ inputs, results }) => {
  const chartData = [
    { name: 'Per Diem', value: results.perDiem, color: '#83849E' },
    { name: 'Admin Fees', value: results.adminFees, color: '#B48E4D' },
    { name: 'Tax', value: results.hostTax, color: '#181C31' },
    { name: 'Social Security', value: results.hostSocialSecurity, color: '#40AEBC' },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const SummaryItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-[#83849E] text-sm">{label}</span>
      <span className="text-[#181C31] font-bold text-sm">{value}</span>
    </div>
  );

  const CostLineItem = ({ 
    label, 
    value, 
    color, 
    tag, 
    tagColor 
  }: { 
    label: string; 
    value: number; 
    color: string; 
    tag?: string; 
    tagColor?: string 
  }) => (
    <div className="group flex items-center justify-between p-4 bg-white border border-[#EEEEEE] rounded-xl hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <div className="flex items-center gap-3">
          <span className="text-[#181C31] font-semibold">{label}</span>
          <Info size={14} className="text-[#EEEEEE]" />
          {tag && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-tight"
              style={{ backgroundColor: `${tagColor}20`, color: tagColor }}
            >
              {tag}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[#181C31] font-bold">{formatCurrency(value)}</span>
        <ChevronRight size={18} className="text-[#EEEEEE] group-hover:text-[#40AEBC] transition-colors" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-xl font-bold text-[#181C31]">Additional Cost Estimate</h2>
          <p className="text-[#83849E] text-xs">Incremental costs beyond base salary for this international deployment</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-[#EEEEEE]">
           <button className="px-4 py-1.5 text-xs font-bold bg-[#EDF5FF] text-[#181C31] rounded-md">EUR</button>
           <button className="px-4 py-1.5 text-xs font-bold text-[#83849E] hover:text-[#181C31]">BRL</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary & List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EEEEEE]">
            <h3 className="text-[#83849E] text-[10px] font-bold uppercase tracking-widest mb-4">Assignment Summary</h3>
            <div className="divide-y divide-[#EEEEEE]/50">
              <SummaryItem label="Duration" value={`${inputs.durationMonths} months`} />
              <SummaryItem label="Origin" value={inputs.homeCountry} />
              <SummaryItem label="Destination" value={inputs.hostCountry} />
              <SummaryItem label="Salary" value={`${formatCurrency(inputs.monthlySalary)}/month`} />
            </div>
          </div>

          <div className="space-y-3">
            <CostLineItem label="Salary (Base)" value={results.baseSalary} color="#40AEBC" />
            <CostLineItem label="Per Diem" value={results.perDiem} color="#83849E" tag="Tax Exempt" tagColor="#40AEBC" />
            <CostLineItem label="Admin Fees" value={results.adminFees} color="#B48E4D" />
            <CostLineItem label="Host Country Tax" value={results.hostTax} color="#181C31" />
            <CostLineItem label="Host Country Social Security" value={results.hostSocialSecurity} color="#40AEBC" tag="No Reciprocal Agreement" tagColor="#BD4040" />
          </div>
        </div>

        {/* Right: Chart & Actions */}
        <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className="text-[#83849E] text-[10px] font-bold uppercase tracking-widest">Total Additional Cost ({inputs.durationMonths} months)</h3>
              <Info size={12} className="text-[#EEEEEE]" />
            </div>
            <div className="text-3xl font-black text-[#181C31]">{formatCurrency(results.totalAdditionalCost)}</div>
            <div className="flex items-center justify-center gap-1 mt-1 text-xs text-[#83849E]">
              Daily additional cost: <span className="text-[#181C31] font-bold">{formatCurrency(results.totalAdditionalCost / (inputs.durationMonths * inputs.workingDaysPerMonth))}/day</span>
              <Info size={12} className="text-[#EEEEEE]" />
            </div>
          </div>

          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] font-bold text-[#83849E] uppercase block">Total</span>
              <span className="text-sm font-bold text-[#181C31]">{formatCurrency(results.totalAdditionalCost)}</span>
            </div>
          </div>

          <div className="w-full mt-6 space-y-3">
            {chartData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#83849E]">{item.name}</span>
                </div>
                <span className="text-[#181C31] font-bold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-10">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-[#EEEEEE] rounded-xl text-[#83849E] font-bold hover:bg-[#F9FBFF] transition-all">
              <Download size={18} />
              <span className="text-sm">Save</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-[#EEEEEE] rounded-xl text-[#83849E] font-bold hover:bg-[#F9FBFF] transition-all">
              <Share2 size={18} />
              <span className="text-sm">Share</span>
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#40AEBC] rounded-xl text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-[#40AEBC]/20">
              <Check size={18} />
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateResultsView;
