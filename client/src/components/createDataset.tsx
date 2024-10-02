import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Dataset {
  instructor_profile: Record<string, string>;
  learning_content: Record<string, string | string[]>;
  example_sentences: Array<{ input: string; output: string }>;
}

interface CreateDatasetProps {
  dataset: Dataset;
}

const labelTranslations: Record<string, string> = {
  role: '역할',
  style: '스타일',
  tone: '어조',
  introduction: '소개',
  target_audience: '대상 청중',
  teaching_method: '교육 방법',
  key_points: '핵심 포인트',
  categories: '카테고리',
  summary: '요약',
  level: '난이도',
  explanation: '설명',
  question: '질문',
  reference: '참고 자료',
  important_words: '중요 단어',
  important_sentences: '중요 문장',
  important_phrases: '중요 구문',
};

const CreateDataset: React.FC<CreateDatasetProps> = ({ dataset }) => {
  const navigate = useNavigate();
  const [editedDataset, setEditedDataset] = useState<Dataset>(dataset);

  const handleNextStep = () => {
    navigate('/data/check');
  };

  const handleChange = (section: keyof Dataset, key: string, value: any) => {
    setEditedDataset((prev: Dataset) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderComplexField = (section: keyof Dataset, key: string, value: any) => {
    if (Array.isArray(value)) {
      if (key === 'question') {
        return (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{labelTranslations[key] || key}</Typography>
            {value.map((item, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  label="질문"
                  value={item.q}
                  onChange={(e) => {
                    const newQuestions = [...value];
                    newQuestions[index] = { ...newQuestions[index], q: e.target.value };
                    handleChange(section, key, newQuestions);
                  }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="답변"
                  value={item.a}
                  onChange={(e) => {
                    const newQuestions = [...value];
                    newQuestions[index] = { ...newQuestions[index], a: e.target.value };
                    handleChange(section, key, newQuestions);
                  }}
                />
              </Box>
            ))}
          </Box>
        );
      }
      // ... 기존의 배열 처리 코드
    } else if (typeof value === 'object') {
      return (
        <Box key={key} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">{labelTranslations[key] || key}</Typography>
          {Object.entries(value).map(([subKey, subValue]) => (
            <TextField
              key={subKey}
              fullWidth
              label={subKey}
              value={subValue as string}
              onChange={(e) => {
                const newValue = { ...value, [subKey]: e.target.value };
                handleChange(section, key, newValue);
              }}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      );
    } else {
      return (
        <TextField
          key={key}
          fullWidth
          multiline
          label={labelTranslations[key] || key}
          value={value as string}
          onChange={(e) => handleChange(section, key, e.target.value)}
          sx={{ mb: 2 }}
        />
      );
    }
  };

  // 데이터 유효성 검사 함수 추가
  const isValidSection = (section: any): section is Record<string, any> => {
    return section !== null && typeof section === 'object';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        데이터셋 생성 및 편집
      </Typography>
      
      <Grid container spacing={4}>
        {/* 강사 프로필 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>강사 프로필</Typography>
            {isValidSection(editedDataset.instructor_profile) && 
              Object.entries(editedDataset.instructor_profile).map(([key, value]) => 
                renderComplexField('instructor_profile', key, value)
              )
            }
          </Paper>
        </Grid>

        {/* 학습 내용 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>학습 내용</Typography>
            {isValidSection(editedDataset.learning_content) && 
              Object.entries(editedDataset.learning_content).map(([key, value]) => 
                renderComplexField('learning_content', key, value)
              )
            }
          </Paper>
        </Grid>

        {/* 예시 문장 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>예시 문장</Typography>
            {Array.isArray(editedDataset.example_sentences) && editedDataset.example_sentences.map((sentence: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="입력"
                  value={sentence.input || ''}
                  onChange={(e) => {
                    const newSentences = [...editedDataset.example_sentences];
                    newSentences[index] = { ...newSentences[index], input: e.target.value };
                    setEditedDataset(prev => ({ ...prev, example_sentences: newSentences }));
                  }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="출력"
                  value={sentence.output || ''}
                  onChange={(e) => {
                    const newSentences = [...editedDataset.example_sentences];
                    newSentences[index] = { ...newSentences[index], output: e.target.value };
                    setEditedDataset(prev => ({ ...prev, example_sentences: newSentences }));
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleNextStep} sx={{ mt: 3 }}>
        다음 단계로
      </Button>
    </Box>
  );
};

export default CreateDataset;
