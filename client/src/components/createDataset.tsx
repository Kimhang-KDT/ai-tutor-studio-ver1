import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { saveDataset } from '../services/api';  // api.ts에서 saveDataset 함수 import

interface Dataset {
  instructor_profile: {
    role: string;
    style: string;
    tone: string;
    introduction: string;
    target_audience: string[];
    teaching_method: string[];
    key_points: string[];
  };
  learning_content: {
    categories: string[];
    summary: string;
    level: string;
    explanation: string[];
    question: Array<{ q: string; a: string }>;
    reference: string[];
    important_words: Array<{ word: string; explanation: string }>;
    important_sentences: Array<{ sentence: string; explanation: string }>;
    important_phrases: Array<{ phrase: string; explanation: string }>;
  };
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

  const handleNextStep = async () => {
    try {
      const response = await saveDataset(editedDataset);
      if (response.success) {
        navigate('/data/check');
      } else {
        console.error('데이터 저장 실패:', response.error);
      }
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
    }
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

  const renderField = (section: keyof Dataset, key: string, value: any) => {
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
      } else if (['important_words', 'important_sentences', 'important_phrases'].includes(key)) {
        const labelKey = key === 'important_words' ? 'word' : 
                         key === 'important_sentences' ? 'sentence' : 'phrase';
        return (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{labelTranslations[key] || key}</Typography>
            {value.map((item: { [key: string]: string }, index: number) => (
              <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: '4px' }}>
                <TextField
                  fullWidth
                  label={labelKey}
                  value={item[labelKey]}
                  onChange={(e) => {
                    const newValue = [...value];
                    newValue[index] = { ...newValue[index], [labelKey]: e.target.value };
                    handleChange(section, key, newValue);
                  }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="설명"
                  value={item.explanation}
                  onChange={(e) => {
                    const newValue = [...value];
                    newValue[index] = { ...newValue[index], explanation: e.target.value };
                    handleChange(section, key, newValue);
                  }}
                  sx={{ mb: 1 }}
                />
              </Box>
            ))}
          </Box>
        );
      } else if (key === 'example_sentences') {
        return (
          <Box key={key} sx={{ mb: 2 }}>
            {value.map((item: { input: string; output: string }, index: number) => (
              <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: '4px' }}>
                <TextField
                  fullWidth
                  label="질문"
                  value={item.input}
                  onChange={(e) => {
                    const newValue = [...value];
                    newValue[index] = { ...newValue[index], input: e.target.value };
                    handleChange(section, key, newValue);
                  }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="답변"
                  value={item.output}
                  onChange={(e) => {
                    const newValue = [...value];
                    newValue[index] = { ...newValue[index], output: e.target.value };
                    handleChange(section, key, newValue);
                  }}
                />
              </Box>
            ))}
          </Box>
        );
      } else {
        return (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{labelTranslations[key] || key}</Typography>
            {value.map((item: string, index: number) => (
              <TextField
                key={index}
                fullWidth
                value={item}
                onChange={(e) => {
                  const newValue = [...value];
                  newValue[index] = e.target.value;
                  handleChange(section, key, newValue);
                }}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        );
      }
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

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* 강사 프로필 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>강사 프로필</Typography>
            {Object.entries(editedDataset.instructor_profile).map(([key, value]) => 
              renderField('instructor_profile', key, value)
            )}
          </Paper>
        </Grid>

        {/* 학습 내용 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>학습 내용</Typography>
            {Object.entries(editedDataset.learning_content).map(([key, value]) => 
              renderField('learning_content', key, value)
            )}
          </Paper>
        </Grid>

        {/* 예시 문장 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>예시 문장</Typography>
            {renderField('example_sentences', 'example_sentences', editedDataset.example_sentences)}
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