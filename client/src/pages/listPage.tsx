import React from 'react';
import { Container, Typography } from '@mui/material';
import DatasetList from '../components/datasetList';

const ListPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        데이터셋 검수
      </Typography>
      <DatasetList />
    </Container>
  );
};

export default ListPage;
