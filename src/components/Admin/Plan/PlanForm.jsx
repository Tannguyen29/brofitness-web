import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MuiColorInput } from 'mui-color-input';

const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "20px",
  width: "500px",
  margin: "0 auto",
});

const StyledButton = styled(Button)({
  backgroundColor: "#FD6300",
  color: "white",
  "&:hover": {
    backgroundColor: "#e55a00",
  },
});

const SectionContainer = styled(Paper)({
  padding: "15px",
  marginBottom: "20px",
});

const SubSectionContainer = styled(Box)({
  marginBottom: "15px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "5px",
});

const InputWrapper = styled(Box)({
  marginBottom: "15px",
});

const DropzoneArea = styled(Box)({
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#999999',
  },
});

const API_BASE_URL = "http://localhost:5000";

const PlanForm = ({ plan, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: "",
    isPro: false,
    accentColor: "#000000",
    duration: { weeks: 1, daysPerWeek: 1 },
    weeks: [],
    targetAudience: {
      experienceLevel: "",
      fitnessGoal: "",
      equipmentNeeded: "",
      activityLevel: "",
    },
  });
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (plan) {
      console.log("Received plan:", plan);
      const newFormData = {
        ...plan,
        duration: plan.duration || { weeks: 1, daysPerWeek: 1 },
        weeks: plan.weeks || [],
        accentColor: plan.accentColor || "#000000",
        targetAudience: {
          experienceLevel: plan.targetAudience.experienceLevels?.[0] || "",
          fitnessGoal: plan.targetAudience.fitnessGoals?.[0] || "",
          equipmentNeeded: plan.targetAudience.equipmentNeeded?.[0] || "",
          activityLevel: plan.targetAudience.activityLevels?.[0] || "",
        },
      };
      console.log("Setting form data:", newFormData);
      setFormData(newFormData);
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        backgroundImage: "",
        isPro: false,
        accentColor: "#000000",
        duration: { weeks: 1, daysPerWeek: 1 },
        weeks: [],
        targetAudience: {
          experienceLevel: "",
          fitnessGoal: "",
          equipmentNeeded: "",
          activityLevel: "",
        },
      });
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      duration: {
        ...prevData.duration,
        [name]: Number(value),
      },
    }));
  };

  const handleTargetAudienceChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      targetAudience: {
        ...prevData.targetAudience,
        [field]: value,
        [`${field}s`]: [value], 
      },
    }));
  };

  const handleWeekChange = (weekIndex, dayIndex, field, value) => {
    const updatedWeeks = [...formData.weeks];
    if (field === "focusArea") {
      updatedWeeks[weekIndex].days[dayIndex][field] = Array.isArray(value) ? value : [];
    } else {
      updatedWeeks[weekIndex].days[dayIndex][field] = value;
    }
    setFormData((prevData) => ({
      ...prevData,
      weeks: updatedWeeks,
    }));
  };

  const calculateTotalTime = (exercises) => {
    return exercises.reduce((total, exercise) => {
      const duration = parseInt(exercise.duration) || 0;
      const sets = parseInt(exercise.sets) || 1;
      return total + (duration * sets) / 60;
    }, 0);
  };

  const handleExerciseChange = (
    weekIndex,
    dayIndex,
    exerciseIndex,
    field,
    value
  ) => {
    const updatedWeeks = [...formData.weeks];
    updatedWeeks[weekIndex].days[dayIndex].exercises[exerciseIndex][field] = value;

    const totalTime = calculateTotalTime(updatedWeeks[weekIndex].days[dayIndex].exercises);
    updatedWeeks[weekIndex].days[dayIndex].totalTime = `${Math.round(totalTime)} minutes`;

    setFormData((prevData) => ({
      ...prevData,
      weeks: updatedWeeks,
    }));
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
          totalTime: '0 minutes',
          focusArea: []
        });
      }
      newWeeks.push(week);
    }
    setFormData((prevData) => ({
      ...prevData,
      weeks: newWeeks
    }));
  }, [formData.duration.weeks, formData.duration.daysPerWeek]);

  useEffect(() => {
    if (!plan) generateWeeks();
  }, [generateWeeks, plan]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prevData) => ({
        ...prevData,
        backgroundImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);

    let backgroundImageFile = null;
    if (formData.backgroundImage && formData.backgroundImage.startsWith('data:image')) {
      const response = await fetch(formData.backgroundImage);
      const blob = await response.blob();
      backgroundImageFile = new File([blob], "background.jpg", { type: "image/jpeg" });

      const compressedFile = await compressImage(backgroundImageFile);
      if (compressedFile) {
        backgroundImageFile = compressedFile;
      }
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'backgroundImage') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      }
    });
    formDataToSend.append('planData', JSON.stringify(formData));
    if (backgroundImageFile) {
      formDataToSend.append('backgroundImage', backgroundImageFile);
    }

    try {
      if (plan) {
        await axios.patch(`${API_BASE_URL}/plans/${plan._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_BASE_URL}/plans`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      onSave();
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error saving plan:", error.response.data);
      } else {
        console.error("Error saving plan:", error);
      }
    }
  };

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
        margin="normal"
      />
      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the image here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop an image here, or click to select an image</Typography>
        )}
      </DropzoneArea>

      {formData.backgroundImage && (
        <Box mt={2}>
          <img src={formData.backgroundImage} alt="Background" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </Box>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isPro}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                isPro: e.target.checked,
              }))
            }
            name="isPro"
          />
        }
        label="Is Pro Plan"
      />
      <InputWrapper>
        <MuiColorInput
          name="accentColor"
          label="Accent Color"
          value={formData.accentColor}
          onChange={(color) =>
            setFormData((prevData) => ({
              ...prevData,
              accentColor: color
            }))
          }
          fullWidth
        />
      </InputWrapper>
      <Typography variant="h6">Target Audience</Typography>
      <InputWrapper>
        <FormControl fullWidth>
          <InputLabel>Experience Level</InputLabel>
          <Select
            value={formData.targetAudience.experienceLevel}
            onChange={(e) => handleTargetAudienceChange("experienceLevel", e.target.value)}
            label="Experience Level"
          >
            {["beginner", "intermediate", "advanced"].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </InputWrapper>
      <InputWrapper>
        <FormControl fullWidth>
          <InputLabel>Fitness Goal</InputLabel>
          <Select
            value={formData.targetAudience.fitnessGoal}
            onChange={(e) => handleTargetAudienceChange("fitnessGoal", e.target.value)}
            label="Fitness Goal"
          >
            {["loseWeight", "buildMuscle", "keepFit"].map((goal) => (
              <MenuItem key={goal} value={goal}>
                {goal}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </InputWrapper>
      <InputWrapper>
        <FormControl fullWidth>
          <InputLabel>Equipment Needed</InputLabel>
          <Select
            value={formData.targetAudience.equipmentNeeded}
            onChange={(e) => handleTargetAudienceChange("equipmentNeeded", e.target.value)}
            label="Equipment Needed"
          >
            {["body weight", "dumbbell", "barbell"].map((equipment) => (
              <MenuItem key={equipment} value={equipment}>
                {equipment}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </InputWrapper>
      <InputWrapper>
        <FormControl fullWidth>
          <InputLabel>Activity Level</InputLabel>
          <Select
            value={formData.targetAudience.activityLevel}
            onChange={(e) => handleTargetAudienceChange("activityLevel", e.target.value)}
            label="Activity Level"
          >
            {["sedentary", "moderate", "active"].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </InputWrapper>
      <FormControl fullWidth>
        <InputLabel>Weeks</InputLabel>
        <Select
          name="weeks"
          value={formData.duration.weeks}
          onChange={handleDurationChange}
          label="Weeks"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
            <MenuItem key={week} value={week}>
              {week}
            </MenuItem>
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
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.weeks.map((week, weekIndex) => (
        <SectionContainer key={weekIndex}>
          <Typography variant="h6">Week {week.weekNumber}</Typography>
          {week.days.map((day, dayIndex) => (
            <SubSectionContainer key={dayIndex}>
              <Typography variant="subtitle1">Day {day.dayNumber}</Typography>
              <InputWrapper>
                <FormControl fullWidth>
                  <InputLabel>Focus Area</InputLabel>
                  <Select
                    multiple
                    value={Array.isArray(day.focusArea) ? day.focusArea : []}
                    onChange={(e) =>
                      handleWeekChange(
                        weekIndex,
                        dayIndex,
                        "focusArea",
                        e.target.value
                      )
                    }
                    label="Focus Area"
                  >
                    {["chest", "back", "legs", "shoulders", "arms", "abs"].map(
                      (area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </InputWrapper>
              <InputWrapper>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={day.level}
                    onChange={(e) =>
                      handleWeekChange(
                        weekIndex,
                        dayIndex,
                        "level",
                        e.target.value
                      )
                    }
                    label="Level"
                  >
                    {["beginner", "intermediate", "advanced"].map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </InputWrapper>
              <InputWrapper>
                <TextField
                  label="Total Time"
                  value={day.totalTime}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </InputWrapper>
              {day.exercises &&
                day.exercises.map((exercise, exerciseIndex) => {
                  const selectedEquipment = formData.targetAudience.equipmentNeeded;
                  const filteredExercises = exercises.filter(ex =>
                    selectedEquipment.includes(ex.equipment) &&
                    day.focusArea.some(area => ex.bodyPart === area)
                  );

                  const sortedExercises = [...filteredExercises].sort((a, b) =>
                    ["beginner", "intermediate", "advanced"].indexOf(a.difficulty) -
                    ["beginner", "intermediate", "advanced"].indexOf(b.difficulty)
                  );

                  return (
                    <SubSectionContainer key={exerciseIndex}>
                      <InputWrapper>
                        <FormControl fullWidth>
                          <InputLabel>Exercise</InputLabel>
                          <Select
                            value={exercise.name}
                            onChange={(e) =>
                              handleExerciseChange(
                                weekIndex,
                                dayIndex,
                                exerciseIndex,
                                "name",
                                e.target.value
                              )
                            }
                            label="Exercise"
                          >
                            {sortedExercises.map((ex) => (
                              <MenuItem key={ex._id} value={ex.name}>
                                {ex.name} - {ex.difficulty}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </InputWrapper>
                      <InputWrapper>
                        <TextField
                          label="Duration (seconds)"
                          type="number"
                          value={exercise.duration}
                          onChange={(e) =>
                            handleExerciseChange(
                              weekIndex,
                              dayIndex,
                              exerciseIndex,
                              "duration",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <TextField
                          label="Sets"
                          type="number"
                          value={exercise.sets}
                          onChange={(e) =>
                            handleExerciseChange(
                              weekIndex,
                              dayIndex,
                              exerciseIndex,
                              "sets",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <TextField
                          label="Reps"
                          type="number"
                          value={exercise.reps}
                          onChange={(e) =>
                            handleExerciseChange(
                              weekIndex,
                              dayIndex,
                              exerciseIndex,
                              "reps",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <FormControl fullWidth>
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={exercise.type}
                            onChange={(e) =>
                              handleExerciseChange(
                                weekIndex,
                                dayIndex,
                                exerciseIndex,
                                "type",
                                e.target.value
                              )
                            }
                            label="Type"
                          >
                            {[
                              "strength",
                              "cardio",
                              "flexibility",
                              "balance",
                              "endurance",
                              "HIIT",
                              "circuit",
                              "bodyweight",
                              "resistance",
                              "plyometric",
                            ].map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </InputWrapper>
                    </SubSectionContainer>
                  );
                })}
              <Button
                onClick={() => {
                  const updatedWeeks = [...formData.weeks];
                  updatedWeeks[weekIndex].days[dayIndex].exercises.push({
                    name: "",
                    duration: "",
                    sets: 1,
                    reps: 0,
                    type: "",
                  });
                  setFormData((prevData) => ({
                    ...prevData,
                    weeks: updatedWeeks,
                  }));
                }}
              >
                Add Exercise
              </Button>
            </SubSectionContainer>
          ))}
        </SectionContainer>
      ))}

      <StyledButton type="submit" variant="contained">
        {plan ? "Update" : "Add"} Plan
      </StyledButton>
    </FormContainer>
  );
};

export default PlanForm;
