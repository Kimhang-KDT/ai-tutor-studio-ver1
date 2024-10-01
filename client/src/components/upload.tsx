import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface UploadProps {
  onFilesSelected: (files: File[]) => void;
}

const Upload: React.FC<UploadProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box sx={{ mt: 2 }}>
      <h2>데이터 업로드</h2>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>파일을 여기에 놓으세요...</Typography>
        ) : (
          <Typography>
            파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
          </Typography>
        )}
      </Box>
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">선택된 파일:</Typography>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Upload;
