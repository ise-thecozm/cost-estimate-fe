import apiClient from './api';
import { EstimationInputs, EstimationResults, Country, ConfigData, BatchJob } from '../types';

// Login response type
export interface LoginResponse {
  token: string;
  username: string;
  email: string;
}

// Login request type
export interface LoginRequest {
  username: string;
  password: string;
}

// API Service Functions

export const estimatorApi = {
  /**
   * Login and get authentication token
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },
  /**
   * Get configuration data (countries and durations)
   */
  getConfig: async (): Promise<ConfigData> => {
    const response = await apiClient.get('/config');
    return response.data;
  },

  /**
   * Calculate single estimate
   */
  calculateEstimate: async (inputs: EstimationInputs): Promise<EstimationResults> => {
    const response = await apiClient.post('/estimate/calculate', inputs);
    return response.data;
  },

  /**
   * Upload batch file for processing
   */
  uploadBatchFile: async (file: File): Promise<{ job_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/estimate/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get batch job status and results
   */
  getBatchJobStatus: async (jobId: string): Promise<BatchJob> => {
    const response = await apiClient.get(`/estimate/batch/${jobId}`);
    return response.data;
  },
};
