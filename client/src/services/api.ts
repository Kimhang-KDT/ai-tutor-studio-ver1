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

// 여기에 다른 API 호출 함수들을 추가하세요