
import React from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, Play } from 'lucide-react';

const BatchProcessView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border-2 border-dashed border-[#EEEEEE] rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-[#F9FBFF] hover:border-[#40AEBC] transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-[#40AEBC]" size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#181C31]">Upload Deployment Data</h3>
          <p className="text-[#83849E] text-sm max-w-xs mt-2">
            Drag and drop your CSV or XLSX file here, or click to browse files.
          </p>
          <div className="mt-6 flex gap-3">
             <span className="text-[10px] bg-white px-2 py-1 rounded border border-[#EEEEEE] text-[#83849E]">MAX 10MB</span>
             <span className="text-[10px] bg-white px-2 py-1 rounded border border-[#EEEEEE] text-[#83849E]">CSV, XLSX</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#EEEEEE] rounded-xl p-5">
            <h4 className="text-sm font-bold text-[#181C31] flex items-center gap-2 mb-3">
              <Download size={16} className="text-[#40AEBC]" />
              Templates
            </h4>
            <p className="text-xs text-[#83849E] mb-4">Use our standard format for faster processing and validation.</p>
            <button className="w-full py-2.5 px-4 text-xs font-bold border border-[#EEEEEE] rounded-lg hover:bg-[#F9FBFF] flex items-center justify-center gap-2 transition-colors">
              <FileSpreadsheet size={14} />
              Download Template.csv
            </button>
          </div>

          <div className="bg-[#EDF5FF] rounded-xl p-5 border border-[#40AEBC]/20">
            <h4 className="text-sm font-bold text-[#181C31] flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-[#40AEBC]" />
              Quick Instructions
            </h4>
            <ul className="text-[11px] text-[#83849E] space-y-2 list-disc pl-4">
              <li>Ensure "Monthly Salary" is in base currency (EUR).</li>
              <li>Include country codes (ISO-2) for Home and Host.</li>
              <li>Limit batch to 500 records per upload.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-[#EEEEEE]">
        <div className="flex items-center gap-4 text-[#83849E]">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#EEEEEE]" />
            ))}
          </div>
          <span className="text-xs">No files uploaded yet</span>
        </div>
        <button className="px-8 py-3 bg-[#EEEEEE] text-[#83849E] rounded-lg font-bold flex items-center gap-2 cursor-not-allowed">
          <Play size={18} />
          Start Batch Processing
        </button>
      </div>
    </div>
  );
};

export default BatchProcessView;
