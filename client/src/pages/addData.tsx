import React, { useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import Upload from '../components/upload';
import CreateDataset from '../components/createDataset';
import { createDataset } from '../services/api';
import axios from 'axios';

const AddData: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataset, setDataset] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDatasetCreated, setIsDatasetCreated] = useState(false);

  const handleFileSelected = (files: File[]) => {
    setSelectedFile(files[0]);
    setIsDatasetCreated(false);
  };

  const handleCreateDataset = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await createDataset(formData);
      setDataset(response.dataset);
      setIsDatasetCreated(true);
    } catch (error) {
      console.error('데이터셋 생성 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('서버 응답:', error.response.data);
          alert(`데이터셋 생성에 실패했습니다. 서버 오류: ${error.response.data.detail || '알 수 없는 오류'}`);
        } else if (error.request) {
          console.error('요청 오류:', error.request);
          alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          console.error('기타 오류:', error.message);
          alert(`데이터셋 생성에 실패했습니다. 오류: ${error.message}`);
        }
      } else {
        console.error('알 수 없는 오류:', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Upload onFilesSelected={handleFileSelected} />
      </Box>
      {selectedFile && !isDatasetCreated && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateDataset}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={24} /> : '데이터셋 생성'}
          </Button>
        </Box>
      )}
      {isDatasetCreated && dataset && (
        <Box sx={{ mt: 6 }}>
          <CreateDataset dataset={dataset} />
        </Box>
      )}
    </Container>
  );
};

export default AddData;
