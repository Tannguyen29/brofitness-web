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
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExerciseForm from "./ExerciseForm";
import * as s from "./Exercises.styles";
import { styled } from "@mui/material/styles";

const API_BASE_URL = "http://localhost:5000";

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
  const [totalExercises, setTotalExercises] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("name_asc");

  const fetchExercises = useCallback(async (term, pageNum, rowsPerPageNum, sort) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises`, {
        params: { 
          search: term,
          page: pageNum + 1,
          limit: rowsPerPageNum,
          sort: sort
        }
      });
      setExercises(response.data.exercises);
      setTotalExercises(response.data.total);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }, []); 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchExercises = useCallback(
    debounce((term, pageNum, rowsPerPageNum, sort) => {
      fetchExercises(term, pageNum, rowsPerPageNum, sort);
    }, 300),
    [fetchExercises]
  );

  useEffect(() => {
    debouncedFetchExercises(searchTerm, page, rowsPerPage, sortOrder);
  }, [debouncedFetchExercises, searchTerm, page, rowsPerPage, sortOrder]);

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
        debouncedFetchExercises(searchTerm, page, rowsPerPage, sortOrder);
      } catch (error) {
        console.error("Error deleting exercise:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected exercises?`)) {
      try {
        await Promise.all(selectedItems.map(id => axios.delete(`${API_BASE_URL}/exercises/${id}`)));
        debouncedFetchExercises(searchTerm, page, rowsPerPage, sortOrder);
        setSelectedItems([]);
      } catch (error) {
        console.error("Error deleting selected exercises:", error);
      }
    }
  };
  
  const handleSave = () => {
    debouncedFetchExercises(searchTerm, page, rowsPerPage, sortOrder);
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
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setFilterAnchorEl(null);
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
              <s.FilterButton onClick={handleFilterClick}>
                <FilterListIcon />
              </s.FilterButton>
              <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <List>
                  <ListItem button onClick={() => handleSortChange('name_asc')}>
                    <ListItemText primary="Sort A-Z" />
                  </ListItem>
                  <ListItem button onClick={() => handleSortChange('id_asc')}>
                    <ListItemText primary="Oldest to Newest" />
                  </ListItem>
                  <ListItem button onClick={() => handleSortChange('id_desc')}>
                    <ListItemText primary="Newest to Oldest" />
                  </ListItem>
                </List>
              </Popover>
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
            {exercises.map((exercise) => (
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
          count={totalExercises}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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