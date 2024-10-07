import React, { useState, useEffect } from 'react';
import { createNewModel, getModelStatus } from '../services/api';
import { Button, CircularProgress, Typography } from '@mui/material';

interface CreateModelProps {
  datasetId: string;
}

const CreateModel: React.FC<CreateModelProps> = ({ datasetId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (modelId && status === 'running') {
      intervalId = setInterval(async () => {
        try {
          const response = await getModelStatus(modelId);
          setStatus(response.status);
          if (response.status !== 'running') {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('상태 확인 중 오류 발생:', error);
          clearInterval(intervalId);
        }
      }, 60000); // 1분마다 상태 확인
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [modelId, status]);

  const handleCreateModel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createNewModel(datasetId);
      setModelId(response.model_id);
      setStatus(response.status);
    } catch (error) {
      console.error('모델 생성 실패:', error);
      setError('모델 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!modelId ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateModel}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : '모델 생성'}
        </Button>
      ) : (
        <Typography>상태: {status}</Typography>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default CreateModel;
