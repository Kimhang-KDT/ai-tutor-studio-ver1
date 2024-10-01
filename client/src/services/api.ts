import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createDataset = async (formData: FormData) => {
  try {
    const response = await api.post('/data/create-dataset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('데이터셋 생성 중 오류 발생:', error);
    throw error;
  }
};

export const getDatasets = async () => {
  try {
    const response = await api.get('/datasets');
    return response.data;
  } catch (error) {
    console.error('데이터셋 목록 조회 중 오류 발생:', error);
    throw error;
  }
};

// getDataset : 데이터셋 하나 조회
//export const getDataset = async (datasetId: string) => {
//  try {
//    const response = await api.get(`/datasets/${datasetId}`);
//    return response.data;
//  } catch (error) {
//    console.error('데이터셋 조회 중 오류 발생:', error);
//    throw error;
//  }
//};
