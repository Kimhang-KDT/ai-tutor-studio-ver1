import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getDatasets, createNewModel, getModelStatusByDatasetId } from '../services/api';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

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

interface ModelStatus {
  [key: string]: string;
}

const DatasetList: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [modelStatuses, setModelStatuses] = useState<ModelStatus>({});
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const fetchDatasets = useCallback(async () => {
    try {
      const data = await getDatasets();
      setDatasets(data.data_lists);
      
      const statuses: ModelStatus = {};
      for (const dataset of data.data_lists) {
        const status = await getModelStatusByDatasetId(dataset._id);
        statuses[dataset._id] = status.status || '미생성';
      }
      setModelStatuses(statuses);
    } catch (error) {
      console.error('데이터셋 목록 가져오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
    return () => {
      // 컴포넌트 언마운트 시 모든 인터벌 제거
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [fetchDatasets]);

  const handleCreateModel = async (datasetId: string) => {
    try {
      const response = await createNewModel(datasetId);
      console.log(`Model creation response for dataset ${datasetId}:`, response); // 디버깅용 로그
      setModelStatuses(prev => {
        const newStatuses = { ...prev, [datasetId]: '진행중' };
        console.log('Updated model statuses:', newStatuses); // 디버깅용 로그
        return newStatuses;
      });
      
      if (intervalRefs.current[datasetId]) {
        clearInterval(intervalRefs.current[datasetId]);
      }
      
      intervalRefs.current[datasetId] = setInterval(async () => {
        const statusResponse = await getModelStatusByDatasetId(datasetId);
        console.log(`Status update for dataset ${datasetId}:`, statusResponse); // 디버깅용 로그
        setModelStatuses(prev => {
          const newStatuses = { ...prev, [datasetId]: statusResponse.status };
          console.log('Updated model statuses:', newStatuses); // 디버깅용 로그
          return newStatuses;
        });
        
        if (statusResponse.status !== '진행중') {
          clearInterval(intervalRefs.current[datasetId]);
          delete intervalRefs.current[datasetId];
        }
      }, 60000);
    } catch (error) {
      console.error('모델 생성 실패:', error);
      setModelStatuses(prev => ({ ...prev, [datasetId]: '실패' }));
    }
  };

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
    {
      field: 'modelStatus',
      headerName: '학습 현황',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>
          {modelStatuses[params.row.id] || '미생성'}
        </Typography>
      ),
    },
    {
      field: 'modelCreation',
      headerName: '모델 생성',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const status = modelStatuses[params.row.id];
        const isDisabled = status === '진행중' || status === '완료';
        console.log(`Dataset ${params.row.id} status: ${status}, isDisabled: ${isDisabled}`); // 디버깅용 로그
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCreateModel(params.row.id)}
            disabled={isDisabled}
          >
            모델 생성
          </Button>
        );
      },
    },
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
