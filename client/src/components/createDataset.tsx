import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CreateDatasetProps {
  dataset: any;
}

const CreateDataset: React.FC<CreateDatasetProps> = ({ dataset }) => {
  const navigate = useNavigate();

  const handleNextStep = () => {
    navigate('/data/check');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        생성된 데이터셋
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2, maxHeight: '500px', overflow: 'auto' }}>
        <pre>{JSON.stringify(dataset, null, 2)}</pre>
      </Paper>
      <Button variant="contained" color="primary" onClick={handleNextStep} sx={{ mt: 2 }}>
        다음 단계로
      </Button>
    </Box>
  );
};

export default CreateDataset;
