import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { getDatasets } from '../services/api';

const DatasetList: React.FC = () => {
  const [datasets, setDatasets] = useState<string[]>([]);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await getDatasets();
        setDatasets(response.datasets);
      } catch (error) {
        console.error('데이터셋 목록 조회 실패:', error);
      }
    };

    fetchDatasets();
  }, []);

  return (
    <Box>
      <List>
        
      </List>
    </Box>
  );
};

export default DatasetList;
