import React, { useEffect, useState } from 'react';
import { getDatasets } from '../services/api';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

interface Dataset {
  _id: string;
  title: string;
  instructor_profile: {
    role: string;
  };
  learning_content: {
    level: string;
  };
  created_at: string;
}

const DatasetList: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const data = await getDatasets();
        setDatasets(data.data_lists);
      } catch (error) {
        console.error('데이터셋 목록 가져오기 실패:', error);
      }
    };

    fetchDatasets();
  }, []);

  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: '데이터 이름', 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Link to={`/data/datasets/${params.row.id}`}>
          {params.value}
        </Link>
      )
    },
    { field: 'role', headerName: '역할', width: 150 },
    { field: 'level', headerName: '레벨', width: 100 },
    { field: 'created_at', headerName: '생성일', width: 200 },
  ];

  const rows = datasets.map((dataset) => ({
    id: dataset._id,
    title: dataset.title,
    role: dataset.instructor_profile.role,
    level: dataset.learning_content.level,
    created_at: new Date(dataset.created_at).toLocaleString(),
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
      />
    </div>
  );
};

export default DatasetList;
