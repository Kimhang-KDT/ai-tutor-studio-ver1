import React from 'react';
import { useParams } from 'react-router-dom';
import DatasetDetail from '../components/datasetDetail';

const CheckData: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>잘못된 데이터셋 ID입니다.</div>;
  }

  return (
    <div>
      <DatasetDetail id={id} />
    </div>
  );
};

export default CheckData;
