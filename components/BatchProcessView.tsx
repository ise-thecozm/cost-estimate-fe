
import React, { useCallback, useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useUploadBatchFile, useBatchJobStatus } from '../hooks/useEstimatorQueries';
import { useAuth } from '../contexts/AuthContext';
import { BatchJobStatus } from '../types';

const BatchProcessView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadBatchFile();
  const { data: jobStatus, isLoading: isLoadingStatus } = useBatchJobStatus(
    jobId,
    {
      enabled: !!jobId,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return status === 'PENDING' || status === 'PROCESSING' ? 2000 : false;
      },
    }
  );

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`Invalid file format. Allowed: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit');
      return;
    }

    setSelectedFile(file);
    setJobId(null); // Reset job ID when new file is selected
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !isAuthenticated) {
      if (!isAuthenticated) {
        alert('Please authenticate first. Set your token using the auth context.');
      }
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);
      setJobId(result.job_id);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedFile, isAuthenticated, uploadMutation]);

  const getStatusColor = (status: BatchJobStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'PROCESSING':
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: BatchJobStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className={getStatusColor(status)} size={20} />;
      case 'FAILED':
        return <XCircle className={getStatusColor(status)} size={20} />;
      case 'PROCESSING':
        return <Loader2 className={`${getStatusColor(status)} animate-spin`} size={20} />;
      default:
        return <AlertCircle className={getStatusColor(status)} size={20} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="md:col-span-2 border-2 border-dashed border-[#EEEEEE] rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-[#F9FBFF] hover:border-[#40AEBC] transition-colors group cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-[#40AEBC]" size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#181C31]">Upload Deployment Data</h3>
          <p className="text-[#83849E] text-sm max-w-xs mt-2">
            Drag and drop your CSV or XLSX file here, or click to browse files.
          </p>
          {selectedFile && (
            <p className="text-sm text-[#40AEBC] font-semibold mt-4">
              Selected: {selectedFile.name}
            </p>
          )}
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

      {/* Job Status Section */}
      {jobStatus && (
        <div className="bg-white border border-[#EEEEEE] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(jobStatus.status)}
              <div>
                <h3 className="font-bold text-[#181C31]">Batch Job Status</h3>
                <p className="text-xs text-[#83849E]">Job ID: {jobStatus.id}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${getStatusColor(jobStatus.status)}`}>
              {jobStatus.status}
            </span>
          </div>

          {jobStatus.status === 'PROCESSING' && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-[#83849E] mb-2">
                <span>Progress</span>
                <span>{jobStatus.processed_rows} / {jobStatus.total_rows}</span>
              </div>
              <div className="w-full bg-[#EEEEEE] rounded-full h-2">
                <div
                  className="bg-[#40AEBC] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${jobStatus.total_rows > 0 ? (jobStatus.processed_rows / jobStatus.total_rows) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {jobStatus.status === 'FAILED' && jobStatus.error_message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm font-semibold">Error:</p>
              <p className="text-red-700 text-sm mt-1">{jobStatus.error_message}</p>
            </div>
          )}

          {jobStatus.status === 'COMPLETED' && jobStatus.results && (
            <div className="mt-4">
              <p className="text-sm text-[#83849E] mb-2">
                Successfully processed {jobStatus.results.length} records
              </p>
              <div className="max-h-64 overflow-y-auto border border-[#EEEEEE] rounded-lg p-4">
                <pre className="text-xs text-[#181C31]">
                  {JSON.stringify(jobStatus.results.slice(0, 5), null, 2)}
                  {jobStatus.results.length > 5 && '\n... (showing first 5 results)'}
                </pre>
              </div>
            </div>
          )}

          <div className="text-xs text-[#83849E] mt-4">
            Created: {new Date(jobStatus.created_at).toLocaleString()}
            {jobStatus.updated_at !== jobStatus.created_at && (
              <> | Updated: {new Date(jobStatus.updated_at).toLocaleString()}</>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-[#EEEEEE]">
        <div className="flex items-center gap-4 text-[#83849E]">
          {selectedFile ? (
            <>
              <FileSpreadsheet className="text-[#40AEBC]" size={20} />
              <span className="text-xs">{selectedFile.name}</span>
            </>
          ) : (
            <>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#EEEEEE]" />
                ))}
              </div>
              <span className="text-xs">No files uploaded yet</span>
            </>
          )}
        </div>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending || !isAuthenticated}
          className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${!selectedFile || uploadMutation.isPending || !isAuthenticated
            ? 'bg-[#EEEEEE] text-[#83849E] cursor-not-allowed'
            : 'bg-[#40AEBC] text-white hover:opacity-90 active:scale-95'
            }`}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Uploading...
            </>
          ) : (
            <>
              <Play size={18} />
              Start Batch Processing
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BatchProcessView;
