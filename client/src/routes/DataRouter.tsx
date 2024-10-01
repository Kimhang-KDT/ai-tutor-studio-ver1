import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddData from '../pages/addData';
import ListPage from '../pages/listPage';
const DataRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/add" element={<AddData />} />
      <Route path="/lists" element={<ListPage />} />
    </Routes>
  );
};

export default DataRouter;
