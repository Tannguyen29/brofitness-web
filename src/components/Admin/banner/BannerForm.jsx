import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TextField, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useDropzone } from 'react-dropzone';
import { FormContainer, StyledButton } from './BannerStyles';

const BannerForm = ({ onClose, banner, onSave }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (banner) {
      setName(banner.name);
      setImageUrl(banner.imageUrl);
      setExpiryDate(new Date(banner.expiryDate));
    }
  }, [banner]);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('expiryDate', expiryDate.toISOString());
    if (file) {
      formData.append('image', file);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    try {
      if (banner) {
        await axios.put(`http://localhost:5000/banners/${banner._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/banners', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextField
        label="Banner Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box 
        {...getRootProps()} 
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          marginTop: 2,
          marginBottom: 2
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the image here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop an image here, or click to select one</Typography>
        )}
        {file && <Typography>Selected file: {file.name}</Typography>}
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Expiry Date"
          value={expiryDate}
          onChange={(newValue) => setExpiryDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>
      <StyledButton type="submit" variant="contained">
        {banner ? 'Update' : 'Create'} Banner
      </StyledButton>
    </FormContainer>
  );
};

export default BannerForm;