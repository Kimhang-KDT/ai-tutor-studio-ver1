import React from 'react';
import DatasetList from '../components/datasetList';

const ListPage: React.FC = () => {
  return (
    <div>
      <h1>데이터셋 목록</h1>
      <DatasetList />
    </div>
  );
};

export default ListPage;
