import React from 'react';
import { Box, Typography } from '@mui/material';

interface CreateDatasetProps {
  filePaths: string[];
}

const CreateDataset: React.FC<CreateDatasetProps> = ({ filePaths }) => {
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
    </Box>
  );
};

export default CreateDataset;
