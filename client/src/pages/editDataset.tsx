import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UpdateDataset from '../components/updateDataset';

const EditDataset: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div>잘못된 데이터셋 ID입니다.</div>;
  }

  const handleEditComplete = () => {
    navigate(`/data/datasets/${id}`);
  };

  return (
    <div>
      <h1>데이터셋 수정</h1>
      <UpdateDataset id={id} onEditComplete={handleEditComplete} />
    </div>
  );
};

export default EditDataset;