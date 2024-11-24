import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '20px',
  width: '500px',
  margin: '0 auto',
});

const StyledButton = styled(Button)({
  backgroundColor: '#FD6300',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e55a00',
  },
});

const SectionContainer = styled(Paper)({
  padding: '15px',
  marginBottom: '20px',
});

const SubSectionContainer = styled(Box)({
  marginBottom: '15px',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
});

const API_BASE_URL = "http://localhost:5000";

const PlanForm = ({ plan, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    backgroundImage: '',
    isPro: false,
    targetAudience: {
      experienceLevels: ['beginner'],
      fitnessGoals: ['keepFit'],
      equipmentNeeded: ['body weight'],
      activityLevels: ['moderate']
    },
    duration: { weeks: 1, daysPerWeek: 1 },
    weeks: [],
  });
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
    fetchExercises();
  }, [plan]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      duration: {
        ...prevData.duration,
        [name]: Number(value)
      }
    }));
  };

  const handleWeekChange = (weekIndex, dayIndex, field, value) => {
    const updatedWeeks = [...formData.weeks];
    updatedWeeks[weekIndex].days[dayIndex][field] = value;
    setFormData(prevData => ({
      ...prevData,
      weeks: updatedWeeks
    }));
  };

  const handleExerciseChange = (weekIndex, dayIndex, exerciseIndex, field, value) => {
    const updatedWeeks = [...formData.weeks];
    if (field === 'name') {
      const selectedExercise = exercises.find(ex => ex.name === value);
      updatedWeeks[weekIndex].days[dayIndex].exercises[exerciseIndex] = {
        ...updatedWeeks[weekIndex].days[dayIndex].exercises[exerciseIndex],
        name: value,
        exerciseId: selectedExercise?._id,
        gifUrl: selectedExercise?.gifUrl
      };
    } else {
      updatedWeeks[weekIndex].days[dayIndex].exercises[exerciseIndex][field] = value;
    }
    setFormData(prevData => ({
      ...prevData,
      weeks: updatedWeeks
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        weeks: formData.weeks.map(week => ({
          weekNumber: week.weekNumber,
          days: week.days.map(day => ({
            dayNumber: day.dayNumber,
            exercises: day.exercises.map(exercise => {
              const fullExercise = exercises.find(ex => ex.name === exercise.name);
              return {
                exerciseId: fullExercise?._id,
                name: exercise.name,
                duration: parseInt(exercise.duration) || 0,
                sets: parseInt(exercise.sets) || 1,
                reps: parseInt(exercise.reps) || 0,
                type: exercise.type || 'exercise',
                gifUrl: fullExercise?.gifUrl
              };
            }),
            level: day.level || 'beginner',
            totalTime: day.totalTime || '30',
            focusArea: Array.isArray(day.focusArea) ? day.focusArea : [day.focusArea]
          }))
        }))
      };

      console.log("Submitting formatted data:", formattedData);

      if (plan) {
        await axios.patch(`${API_BASE_URL}/plans/${plan._id}`, formattedData);
      } else {
        await axios.post(`${API_BASE_URL}/plans`, formattedData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
    }
  };

  const generateWeeks = useCallback(() => {
    const newWeeks = [];
    for (let i = 0; i < formData.duration.weeks; i++) {
      const week = {
        weekNumber: i + 1,
        days: []
      };
      for (let j = 0; j < formData.duration.daysPerWeek; j++) {
        week.days.push({
          dayNumber: j + 1,
          exercises: [],
          level: '',
          totalTime: '',
          focusArea: ''
        });
      }
      newWeeks.push(week);
    }
    setFormData(prevData => ({
      ...prevData,
      weeks: newWeeks
    }));
  }, [formData.duration.weeks, formData.duration.daysPerWeek]);
  
  useEffect(() => {
    generateWeeks();
  }, [generateWeeks]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextField
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        name="subtitle"
        label="Subtitle"
        value={formData.subtitle}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
      />
      <TextField
        name="backgroundImage"
        label="Background Image URL"
        value={formData.backgroundImage}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isPro}
            onChange={(e) => setFormData(prevData => ({ ...prevData, isPro: e.target.checked }))}
            name="isPro"
          />
        }
        label="Is Pro Plan"
      />
      <FormControl fullWidth>
        <InputLabel>Weeks</InputLabel>
        <Select
          name="weeks"
          value={formData.duration.weeks}
          onChange={handleDurationChange}
          label="Weeks"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
            <MenuItem key={week} value={week}>{week}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Days per Week</InputLabel>
        <Select
          name="daysPerWeek"
          value={formData.duration.daysPerWeek}
          onChange={handleDurationChange}
          label="Days per Week"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <MenuItem key={day} value={day}>{day}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {formData.weeks.map((week, weekIndex) => (
        <SectionContainer key={weekIndex}>
          <Typography variant="h6">Week {week.weekNumber}</Typography>
          {week.days.map((day, dayIndex) => (
            <SubSectionContainer key={dayIndex}>
              <Typography variant="subtitle1">Day {day.dayNumber}</Typography>
              <FormControl fullWidth>
                <InputLabel>Focus Area</InputLabel>
                <Select
                  value={day.focusArea}
                  onChange={(e) => handleWeekChange(weekIndex, dayIndex, 'focusArea', e.target.value)}
                  label="Focus Area"
                >
                  {['chest', 'back', 'legs', 'shoulders', 'arms', 'abs'].map((area) => (
                    <MenuItem key={area} value={area}>{area}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={day.level}
                  onChange={(e) => handleWeekChange(weekIndex, dayIndex, 'level', e.target.value)}
                  label="Level"
                >
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Total Time"
                value={day.totalTime}
                onChange={(e) => handleWeekChange(weekIndex, dayIndex, 'totalTime', e.target.value)}
                fullWidth
              />
              {day.exercises.map((exercise, exerciseIndex) => (
                <SubSectionContainer key={exerciseIndex}>
                  <FormControl fullWidth>
                    <InputLabel>Exercise</InputLabel>
                    <Select
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'name', e.target.value)}
                      label="Exercise"
                    >
                      {exercises
                        .filter(ex => ex.bodyPart === day.focusArea && ex.difficulty === day.level)
                        .map((ex) => (
                          <MenuItem key={ex._id} value={ex.name}>{ex.name}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Duration"
                    value={exercise.duration}
                    onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'duration', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Reps"
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'reps', Number(e.target.value))}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={exercise.type}
                        onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'type', e.target.value)}
                        label="Type"
                    >
                        {['strength', 'cardio', 'flexibility', 'balance', 'endurance', 'HIIT', 'circuit', 'bodyweight', 'resistance', 'plyometric'].map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </SubSectionContainer>
              ))}
              <Button onClick={() => {
                const updatedWeeks = [...formData.weeks];
                updatedWeeks[weekIndex].days[dayIndex].exercises.push({
                  name: '',
                  duration: '0',
                  sets: 1,
                  reps: 0,
                  type: 'exercise'
                });
                setFormData(prevData => ({
                  ...prevData,
                  weeks: updatedWeeks
                }));
              }}>
                Add Exercise
              </Button>
            </SubSectionContainer>
          ))}
        </SectionContainer>
      ))}
      <StyledButton type="submit" variant="contained">
        {plan ? 'Update' : 'Add'} Plan
      </StyledButton>
    </FormContainer>
  );
};

export default PlanForm;
