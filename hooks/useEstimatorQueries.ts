import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estimatorApi } from '../services/estimatorApi';
import { EstimationInputs, EstimationResults, BatchJob } from '../types';

// Query keys
export const queryKeys = {
  config: ['estimator', 'config'] as const,
  batchJob: (jobId: string) => ['estimator', 'batch', jobId] as const,
};

/**
 * Hook to fetch configuration data (countries and durations)
 */
export const useConfig = () => {
  return useQuery({
    queryKey: queryKeys.config,
    queryFn: () => estimatorApi.getConfig(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to calculate estimate (mutation)
 */
export const useCalculateEstimate = () => {
  return useMutation<EstimationResults, Error, EstimationInputs>({
    mutationFn: (inputs: EstimationInputs) => estimatorApi.calculateEstimate(inputs),
  });
};

/**
 * Hook to upload batch file
 */
export const useUploadBatchFile = () => {
  const queryClient = useQueryClient();

  return useMutation<{ job_id: string }, Error, File>({
    mutationFn: (file: File) => estimatorApi.uploadBatchFile(file),
    onSuccess: (data) => {
      // Invalidate and refetch batch job status when upload succeeds
      queryClient.invalidateQueries({ queryKey: queryKeys.batchJob(data.job_id) });
    },
  });
};

/**
 * Hook to get batch job status
 */
export const useBatchJobStatus = (
  jobId: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false | ((query: { state: { data?: BatchJob } }) => number | false);
  }
) => {
  return useQuery<BatchJob, Error>({
    queryKey: queryKeys.batchJob(jobId || ''),
    queryFn: () => estimatorApi.getBatchJobStatus(jobId!),
    enabled: !!jobId && (options?.enabled !== false),
    refetchInterval: options?.refetchInterval ?? (jobId ? 2000 : false),
  });
};
