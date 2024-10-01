import React, { useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import Upload from '../components/upload';
import CreateDataset from '../components/createDataset';
import { createDataset } from '../services/api';
import axios from 'axios';

const AddData: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFilePaths, setUploadedFilePaths] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDatasetCreated, setIsDatasetCreated] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setIsDatasetCreated(false);
  };

  const handleCreateDataset = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await createDataset(formData);
      setUploadedFilePaths(response.filePaths);
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
        <Typography variant="h4" component="h1" gutterBottom>
          데이터 추가
        </Typography>
        <Upload onFilesSelected={handleFilesSelected} />
      </Box>
      {selectedFiles.length > 0 && !isDatasetCreated && (
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
      {isDatasetCreated && (
        <Box sx={{ mt: 6 }}>
          <CreateDataset filePaths={uploadedFilePaths} />
        </Box>
      )}
    </Container>
  );
};

export default AddData;
