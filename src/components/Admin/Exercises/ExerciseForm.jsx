import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    if (exercise) {
      setFormData(exercise);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (exercise) {
        await axios.patch(`http://localhost:5000/exercises/${exercise._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/exercises', formData);
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
      <TextField
        name="gifUrl"
        label="GIF URL"
        value={formData.gifUrl}
        onChange={handleChange}
        fullWidth
        required
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