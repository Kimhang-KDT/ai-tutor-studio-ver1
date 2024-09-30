import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NewModel from '../pages/newModel';
import TestModel from '../pages/testModel';

const ModelRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="new" element={<NewModel />} />
      <Route path="test" element={<TestModel />} />
    </Routes>
  );
};

export default ModelRouter;
