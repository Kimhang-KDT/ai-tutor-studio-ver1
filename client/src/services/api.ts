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
    const response = await api.get('/data/datasets');
    return response.data;
  } catch (error) {
    console.error('데이터셋 목록 조회 중 오류 발생:', error);
    throw error;
  }
};

export const saveDataset = async (dataset: any) => {
  try {
    const response = await api.post('/data/save-dataset', dataset);
    return response.data;
  } catch (error) {
    console.error('데이터셋 저장 중 오류 발생:', error);
    throw error;
  }
};

export const getDataset = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data/dataset/${id}`);
    return response.data;
  } catch (error) {
    console.error('데이터셋 가져오기 실패:', error);
    throw error;
  }
};

export const updateDataset = async (id: string, dataset: any) => {
  try {
    const response = await api.put(`/data/dataset/${id}`, dataset);
    return response.data;
  } catch (error) {
    console.error('데이터셋 업데이트 중 오류 발생:', error);
    throw error;
  }
};
