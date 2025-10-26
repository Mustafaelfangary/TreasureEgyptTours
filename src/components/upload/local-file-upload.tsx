import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useFileUpload } from '@/hooks/use-file-upload';

interface LocalFileUploadProps {
  onUpload: (file: File) => Promise<string>;
  accept?: string;
  label?: string;
  fileUrl?: string;
  onDelete?: () => void;
  onReplace?: (url: string) => void;
}

export function LocalFileUpload({
  onUpload,
  accept = 'image/*',
  label = 'Upload File',
  fileUrl,
  onDelete,
  onReplace,
}: LocalFileUploadProps) {
  const { uploading, error, deleteFile, replaceFile } = useFileUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          await onUpload(acceptedFiles[0]!);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    },
    [onUpload]
  );

  const dropzoneOptions: any = {
    onDrop,
    multiple: false,
  };
  
  if (accept) {
    dropzoneOptions.accept = { [accept]: [] };
  }
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && fileUrl) {
      const filename = fileUrl.split('/').pop()!;
      try {
        const newUrl = await replaceFile(filename, e.target.files[0]);
        onReplace?.(newUrl);
      } catch (err) {
        console.error('Error replacing file:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (fileUrl) {
      const filename = fileUrl.split('/').pop()!;
      try {
        await deleteFile(filename);
        onDelete?.();
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  };

  return (
    <Box>
      {fileUrl ? (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={fileUrl} controls style={{ maxWidth: '100%', maxHeight: 200 }} />
          ) : (
            <img src={fileUrl} alt="Uploaded file" style={{ maxWidth: '100%', maxHeight: 200 }} />
          )}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <button onClick={handleDelete} disabled={uploading} style={{ color: 'red' }}>Delete</button>
            <label style={{ cursor: 'pointer', color: 'blue' }}>
              Replace
              <input type="file" accept={accept} style={{ display: 'none' }} onChange={handleReplace} />
            </label>
          </Box>
        </Box>
      ) : (
        <div
          {...getRootProps()}
          style={{
            padding: '24px',
            textAlign: 'center' as const,
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f5f5f5' : '#ffffff',
            border: '2px dashed',
            borderColor: isDragActive ? '#1976d2' : '#e0e0e0',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDragActive ? '#f5f5f5' : '#ffffff';
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </Typography>
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </div>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
} 