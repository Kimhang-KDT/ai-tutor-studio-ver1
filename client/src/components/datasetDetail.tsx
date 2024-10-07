import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Button } from '@mui/material';
import { getDataset } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Dataset {
  title: string;
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

interface DatasetDetailProps {
  id: string;
}

const DatasetDetail: React.FC<DatasetDetailProps> = ({ id }) => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const data = await getDataset(id);
        setDataset(data);
      } catch (error) {
        console.error('데이터셋 가져오기 실패:', error);
      }
    };

    fetchDataset();
  }, [id]);

  const handleEdit = () => {
    navigate(`/data/datasets/${id}/edit`, { state: { dataset } });
  };

  if (!dataset) {
    return <Typography>데이터를 불러오는 중...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>데이터셋 이름 : {dataset.title}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>강사 프로필</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography><strong>역할:</strong> {dataset.instructor_profile.role}</Typography>
                <Typography><strong>스타일:</strong> {dataset.instructor_profile.style}</Typography>
                <Typography><strong>어조:</strong> {dataset.instructor_profile.tone}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography><strong>소개:</strong> {dataset.instructor_profile.introduction}</Typography>
                <Typography><strong>대상 청중:</strong> {dataset.instructor_profile.target_audience.join(', ')}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography><strong>교육 방법:</strong> {dataset.instructor_profile.teaching_method.join(', ')}</Typography>
                <Typography><strong>핵심 포인트:</strong></Typography>
                <List dense>
                  {dataset.instructor_profile.key_points.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">중요 단어:</Typography>
            <List dense>
              {dataset.learning_content.important_words.map((word, index) => (
                <ListItem key={index}>
                  <ListItemText primary={word.word} secondary={word.explanation} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6">중요 문장:</Typography>
            <List dense>
              {dataset.learning_content.important_sentences.map((sentence, index) => (
                <ListItem key={index}>
                  <ListItemText primary={sentence.sentence} secondary={sentence.explanation} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6">중요 구문:</Typography>
            <List dense>
              {dataset.learning_content.important_phrases.map((phrase, index) => (
                <ListItem key={index}>
                  <ListItemText primary={phrase.phrase} secondary={phrase.explanation} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>학습 내용</Typography>
            <Typography><strong>카테고리:</strong> {dataset.learning_content.categories.join(', ')}</Typography>
            <Typography><strong>요약:</strong> {dataset.learning_content.summary}</Typography>
            <Typography><strong>난이도:</strong> {dataset.learning_content.level}</Typography>
            <Typography><strong>설명:</strong></Typography>
            <List dense>
              {dataset.learning_content.explanation.map((exp, index) => (
                <ListItem key={index}>
                  <ListItemText primary={exp} />
                </ListItem>
              ))}
            </List>
            <Typography><strong>질문:</strong></Typography>
            <List dense>
              {dataset.learning_content.question.map((q, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Q: ${q.q}`} secondary={`A: ${q.a}`} />
                </ListItem>
              ))}
            </List>
            <Typography><strong>참고 자료:</strong> {dataset.learning_content.reference.join(', ')}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>예시 문장</Typography>
            <List dense>
              {dataset.example_sentences.map((example, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`질문: ${example.input}`} secondary={`답안: ${example.output}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          수정
        </Button>
      </Box>
    </Box>
  );
};

export default DatasetDetail;