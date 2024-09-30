import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddData from '../pages/addData';
import CheckData from '../pages/checkData';

const DataRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="add" element={<AddData />} />
      <Route path="check" element={<CheckData />} />
    </Routes>
  );
};

export default DataRouter;
