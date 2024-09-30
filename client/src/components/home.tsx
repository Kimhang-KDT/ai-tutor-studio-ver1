import React from 'react';
import '../styles/home.css';

interface ModelData {
  theme: '기초영어' | '자기계발' | '영어학습';
  level: '초급' | '중급' | '고급';
  name: string;
  version: string;
  isRepresentative: boolean;
  status: '배포가능' | '배포불가';
  createdAt: string;
}

const modelData: ModelData[] = [
  {
    theme: '기초영어',
    level: '초급',
    name: '초급_기초영어_ver1',
    version: '1.0',
    isRepresentative: true,
    status: '배포가능',
    createdAt: '2023-03-15',
  },
  {
    theme: '기초영어',
    level: '중급',
    name: '중급_기초영어_ver1',
    version: '1.0',
    isRepresentative: false,
    status: '배포불가',
    createdAt: '2023-04-02',
  },
  // ... 더 많은 데이터 추가
];

const Home: React.FC = () => {
  return (
    <div className="home-component">
      <h2>대시보드</h2>
      <table className="model-table">
        <thead>
          <tr>
            <th>테마</th>
            <th>레벨</th>
            <th>모델명</th>
            <th>버전</th>
            <th>대표 모델</th>
            <th>현재 상태</th>
            <th>생성일</th>
          </tr>
        </thead>
        <tbody>
          {modelData.map((model, index) => (
            <tr key={index}>
              <td>{model.theme}</td>
              <td>{model.level}</td>
              <td>{model.name}</td>
              <td>{model.version}</td>
              <td>
                {model.isRepresentative && (
                  <span className="representative-badge">대표</span>
                )}
              </td>
              <td>
                <span className={`status-badge ${model.status === '배포가능' ? 'deployable' : 'not-deployable'}`}>
                  {model.status}
                </span>
              </td>
              <td>{model.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
