import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, TextField, Grid, List, ListItem, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getDataset, updateDataset } from '../services/api';

interface Dataset {
  _id?: string;
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

interface UpdateDatasetProps {
  id: string;
  onEditComplete: () => void;
}

const UpdateDataset: React.FC<UpdateDatasetProps> = ({ id, onEditComplete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("UpdateDataset 컴포넌트가 렌더링됨", { id, location });

  useEffect(() => {
    const fetchDataset = async () => {
      if (id) {
        try {
          console.log("데이터셋 가져오기 시도", id);
          const data = location.state?.dataset || await getDataset(id);
          console.log("가져온 데이터셋", data);
          setDataset(data);
        } catch (error) {
          console.error('데이터셋 로딩 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDataset();
  }, [id, location.state]);

  const handleChange = (section: keyof Dataset, key: string, value: any) => {
    if (dataset) {
      setDataset((prev) => {
        if (!prev) return prev;
        if (section === 'title') {
          return { ...prev, [section]: value };
        }
        return {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [key]: value
          }
        };
      });
    }
  };

  const handleArrayChange = (section: keyof Dataset, key: string, index: number, value: any) => {
    if (dataset) {
      setDataset((prev) => {
        if (!prev) return prev;
        const newArray = [...((prev[section] as any)[key] as any[])];
        if (section === 'example_sentences') {
          newArray[index] = value;
        } else {
          newArray[index] = value;
        }
        return {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [key]: newArray
          }
        };
      });
    }
  };

  const handleAddArrayItem = (section: keyof Dataset, key: string) => {
    if (dataset) {
      setDataset((prev) => {
        if (!prev) return prev;
        const newArray = [...((prev[section] as any)[key] as any[]), ''];
        return {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [key]: newArray
          }
        };
      });
    }
  };

  const handleRemoveArrayItem = (section: keyof Dataset, key: string, index: number) => {
    if (dataset) {
      setDataset((prev) => {
        if (!prev) return prev;
        const newArray = [...((prev[section] as any)[key] as any[])];
        newArray.splice(index, 1);
        return {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [key]: newArray
          }
        };
      });
    }
  };

  const handleSave = async () => {
    if (dataset && id) {
      try {
        await updateDataset(id, dataset);
        onEditComplete();
        navigate(`/data/datasets/${id}`);  // 수정 후 상세 페이지로 이동
      } catch (error) {
        console.error('데이터셋 업데이트 중 오류 발생:', error);
      }
    }
  };

  if (loading) {
    return <Typography>데이터를 불러오는 중...</Typography>;
  }

  if (!dataset) {
    return <Typography>데이터셋을 찾을 수 없습니다.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>데이터셋 수정</Typography>
      <TextField
        fullWidth
        label="데이터셋 이름"
        value={dataset.title}
        onChange={(e) => handleChange('title', 'title', e.target.value)}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>강사 프로필</Typography>
            {Object.entries(dataset.instructor_profile).map(([key, value]) => (
              <React.Fragment key={key}>
                {Array.isArray(value) ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{key}</Typography>
                    <List>
                      {value.map((item, index) => (
                        <ListItem key={index}>
                          <TextField
                            fullWidth
                            value={item}
                            onChange={(e) => handleArrayChange('instructor_profile', key, index, e.target.value)}
                          />
                          <IconButton onClick={() => handleRemoveArrayItem('instructor_profile', key, index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('instructor_profile', key)}>
                      추가
                    </Button>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    label={key}
                    value={value}
                    onChange={(e) => handleChange('instructor_profile', key, e.target.value)}
                    sx={{ mb: 1 }}
                  />
                )}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>학습 내용</Typography>
            {Object.entries(dataset.learning_content).map(([key, value]) => (
              <React.Fragment key={key}>
                {Array.isArray(value) ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{key}</Typography>
                    <List>
                      {value.map((item, index) => (
                        <ListItem key={index}>
                          <TextField
                            fullWidth
                            value={typeof item === 'string' ? item : JSON.stringify(item)}
                            onChange={(e) => handleArrayChange('learning_content', key, index, e.target.value)}
                          />
                          <IconButton onClick={() => handleRemoveArrayItem('learning_content', key, index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('learning_content', key)}>
                      추가
                    </Button>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    label={key}
                    value={value}
                    onChange={(e) => handleChange('learning_content', key, e.target.value)}
                    sx={{ mb: 1 }}
                  />
                )}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>예시 문장</Typography>
            <List>
              {dataset.example_sentences.map((example, index) => (
                <ListItem key={index}>
                  <TextField
                    fullWidth
                    label="입력"
                    value={example.input}
                    onChange={(e) => handleArrayChange('example_sentences', 'example_sentences', index, { ...example, input: e.target.value })}
                    sx={{ mr: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="출력"
                    value={example.output}
                    onChange={(e) => handleArrayChange('example_sentences', 'example_sentences', index, { ...example, output: e.target.value })}
                  />
                  <IconButton onClick={() => handleRemoveArrayItem('example_sentences', 'example_sentences', index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('example_sentences', 'example_sentences')}>
              예시 문장 추가
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
        저장
      </Button>
    </Box>
  );
};

export default UpdateDataset;