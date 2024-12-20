import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from 'lodash';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  InputAdornment,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExerciseForm from "./ExerciseForm";
import * as s from "./Exercises.styles";
import { styled } from "@mui/material/styles";

const API_BASE_URL = "https://bfbackend.onrender.com";

const StyledTablePagination = styled(TablePagination)`
  .MuiTablePagination-selectLabel,
  .MuiTablePagination-displayedRows,
  .MuiTablePagination-select,
  .MuiTablePagination-actions {
    font-size: 14px;
  }
`;

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchExercises = useCallback(async (term) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises`, {
        params: { search: term }
      });
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }, []); 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchExercises = useCallback(
    debounce((term) => {
      fetchExercises(term);
    }, 300),
    [fetchExercises]
  );

  useEffect(() => {
    debouncedFetchExercises(searchTerm);
  }, [debouncedFetchExercises, searchTerm]);

  const handleAdd = () => {
    setSelectedExercise(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(exercises.map((ex) => ex._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await axios.delete(`${API_BASE_URL}/exercises/${id}`);
        fetchExercises(searchTerm);
      } catch (error) {
        console.error("Error deleting exercise:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected exercises?`)) {
      try {
        await Promise.all(selectedItems.map(id => axios.delete(`${API_BASE_URL}/exercises/${id}`)));
        fetchExercises(searchTerm);
        setSelectedItems([]);
      } catch (error) {
        console.error("Error deleting selected exercises:", error);
      }
    }
  };

  const handleSave = () => {
    fetchExercises(searchTerm);
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  return (
    <s.StyledBox>
      <s.Container>
        <Typography variant="h4" gutterBottom>
          Exercises
        </Typography>
        <s.AddButton onClick={handleAdd}>Add Exercise</s.AddButton>
      </s.Container>
      <s.StyledTableContainer component={Paper}>
        <s.TableHeader>
          {selectedItems.length > 0 ? (
            <>
              <Typography>{selectedItems.length} selected</Typography>
              <IconButton onClick={handleDeleteSelected}>
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <>
              <s.SearchInput
                placeholder="Search exercise..."
                value={searchTerm}
                onChange={handleSearchChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
              <s.FilterButton>
                <FilterListIcon />
              </s.FilterButton>
            </>
          )}
        </s.TableHeader>
        <Table>
          <TableHead>
            <TableRow>
              <s.StyledTableHeaderCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedItems.length > 0 &&
                    selectedItems.length < exercises.length
                  }
                  checked={selectedItems.length === exercises.length}
                  onChange={handleSelectAll}
                />
              </s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="name-column">Name</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="bodypart-column">Body Part</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="equipment-column">Equipment</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="difficulty-column">Difficulty</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="target-column">Target</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Actions</s.StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((exercise) => (
                <s.StyledTableRow key={exercise._id}>
                  <s.StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.includes(exercise._id)}
                      onChange={() => handleSelectItem(exercise._id)}
                    />
                  </s.StyledTableCell>
                  <s.StyledTableCell className="name-column">{exercise.name}</s.StyledTableCell>
                  <s.StyledTableCell className="bodypart-column">{exercise.bodyPart}</s.StyledTableCell>
                  <s.StyledTableCell className="equipment-column">{exercise.equipment}</s.StyledTableCell>
                  <s.StyledTableCell className="difficulty-column">{exercise.difficulty}</s.StyledTableCell>
                  <s.StyledTableCell className="target-column">{exercise.target}</s.StyledTableCell>
                  <s.StyledTableCell>
                    {exercise.isBanned && (
                      <Typography color="error">Banned</Typography>
                    )}
                    <IconButton onClick={(event) => handleMenuOpen(event, exercise._id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === exercise._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => {
                        handleEdit(exercise);
                        handleMenuClose();
                      }}>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleDelete(exercise._id);
                        handleMenuClose();
                      }}>
                        Delete
                      </MenuItem>
                    </Menu>
                  </s.StyledTableCell>
                </s.StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={exercises.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </s.StyledTableContainer>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogContent>
          <ExerciseForm
            exercise={selectedExercise}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </s.StyledBox>
  );
};

export default Exercises;