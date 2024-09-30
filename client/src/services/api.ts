import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const someApiCall = async () => {
  try {
    const response = await api.get('/some-endpoint');
    return response.data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};

// 여기에 다른 API 호출 함수들을 추가하세요