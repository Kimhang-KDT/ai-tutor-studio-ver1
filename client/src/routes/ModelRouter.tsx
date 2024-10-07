import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TestModel from '../pages/testModel';

const ModelRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="test" element={<TestModel />} />
      {/* 다른 모델 관련 라우트들을 여기에 추가할 수 있습니다 */}
    </Routes>
  );
};

export default ModelRouter;
