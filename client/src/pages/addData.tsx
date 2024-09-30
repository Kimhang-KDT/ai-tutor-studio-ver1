import React from 'react';
import Upload from '../components/upload';
import CreateDataset from '../components/createDataset';

const AddData: React.FC = () => {
  return (
    <div className="add-data-page">
      <h1>데이터 업로드</h1>
      <Upload />
      <CreateDataset />
    </div>
  );
};

export default AddData;
