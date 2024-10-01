import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CreateDatasetProps {
  filePaths: string[];
}

const CreateDataset: React.FC<CreateDatasetProps> = ({ filePaths }) => {
  const navigate = useNavigate();

  const handleNextStep = () => {
    navigate('/data/check');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        생성된 데이터셋
      </Typography>
      <Typography variant="body1" gutterBottom>
        다음 파일들로 데이터셋이 생성되었습니다:
      </Typography>
      <ul>
        {filePaths.map((path, index) => (
          <li key={index}>{path}</li>
        ))}
      </ul>
      <Button variant="contained" color="primary" onClick={handleNextStep} sx={{ mt: 2 }}>
        다음 단계로
      </Button>
    </Box>
  );
};

export default CreateDataset;
