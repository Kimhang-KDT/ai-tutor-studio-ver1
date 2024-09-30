import React from 'react';
import Training from '../components/training';

const NewModel: React.FC = () => {
  return (
    <div className="new-model-page">
      <h1>새 모델 생성</h1>
      <Training />
    </div>
  );
};

export default NewModel;
