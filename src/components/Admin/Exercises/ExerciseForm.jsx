import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '20px',
  width: '400px',
  margin: '0 auto',
});

const StyledButton = styled(Button)({
  backgroundColor: '#FD6300',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e55a00',
  },
});

const DropzoneContainer = styled(Box)({
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
});

const bodyParts = [
  "chest", "back", "legs", "shoulders", "arms", "abs"
];

const equipments = [
  "body weight", "dumbbell", "barbell"
];

const targets = [
  "abductors", "abs", "adductors", "biceps", "calves", "cardiovascular system",
  "delts", "forearms", "glutes", "hamstrings", "lats", "levator scapulae", "pectorals", "quads", "serratus anterior", "core"
  , "spine", "traps", "triceps", "upper back"
];

const difficulties = ["beginner", "intermediate", "advanced"];

const ExerciseForm = ({ exercise, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bodyPart: '',
    equipment: '',
    gifUrl: '',
    name: '',
    target: '',
    secondaryMuscles: [],
    instructions: '',
    difficulty: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (exercise) {
      setFormData(exercise);
      setPreviewImage(exercise.gifUrl);
    }
  }, [exercise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSecondaryMusclesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prevData => ({
      ...prevData,
      secondaryMuscles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFormData(prevData => ({
      ...prevData,
      gifFile: file
    }));
    setPreviewImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'secondaryMuscles') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'gifFile') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.gifFile) {
        formDataToSend.append('gifFile', formData.gifFile);
      }

      if (exercise) {
        await axios.patch(`http://localhost:5000/exercises/${exercise._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/exercises', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <FormControl fullWidth required>
        <InputLabel>Body Part</InputLabel>
        <Select
          name="bodyPart"
          value={formData.bodyPart}
          onChange={handleChange}
          label="Body Part"
        >
          {bodyParts.map((part) => (
            <MenuItem key={part} value={part}>{part}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Equipment</InputLabel>
        <Select
          name="equipment"
          value={formData.equipment}
          onChange={handleChange}
          label="Equipment"
        >
          {equipments.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <DropzoneContainer {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the image here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop an image here, or click to select one</Typography>
        )}
      </DropzoneContainer>
      
      {previewImage && (
        <Box mt={2}>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </Box>
      )}

      <TextField
        name="gifUrl"
        label="GIF URL (optional)"
        value={formData.gifUrl}
        onChange={handleChange}
        fullWidth
      />
      <FormControl fullWidth required>
        <InputLabel>Target</InputLabel>
        <Select
          name="target"
          value={formData.target}
          onChange={handleChange}
          label="Target"
        >
          {targets.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Secondary Muscles</InputLabel>
        <Select
          multiple
          name="secondaryMuscles"
          value={formData.secondaryMuscles}
          onChange={handleSecondaryMusclesChange}
          input={<OutlinedInput label="Secondary Muscles" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {targets.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="instructions"
        label="Instructions"
        value={formData.instructions}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />
      <FormControl fullWidth required>
        <InputLabel>Difficulty</InputLabel>
        <Select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          label="Difficulty"
        >
          {difficulties.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <StyledButton type="submit" variant="contained">
        {exercise ? 'Update' : 'Add'} Exercise
      </StyledButton>
    </FormContainer>
  );
};

export default ExerciseForm;