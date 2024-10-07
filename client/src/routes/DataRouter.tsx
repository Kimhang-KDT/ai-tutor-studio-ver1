import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddData from '../pages/addData';
import ListPage from '../pages/listPage';
import CheckData from '../pages/checkData';
import EditDataset from '../pages/editDataset';

const DataRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/add" element={<AddData />} />
      <Route path="/lists" element={<ListPage />} />
      <Route path="/datasets/:id" element={<CheckData />} />
      <Route path="/datasets/:id/edit" element={<EditDataset />} />
    </Routes>
  );
};

export default DataRouter;
