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
import PlanForm from './PlanForm';
import * as s from "./PlanList.styles";
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

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPlans = useCallback(async (term) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans`, {
        params: { search: term }
      });
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchPlans = useCallback(
    debounce((term) => {
      fetchPlans(term);
    }, 300),
    [fetchPlans]
  );

  useEffect(() => {
    debouncedFetchPlans(searchTerm);
  }, [debouncedFetchPlans, searchTerm]);

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(plans.map((plan) => plan._id));
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
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`${API_BASE_URL}/plans/${id}`);
        fetchPlans(searchTerm);
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected plans?`)) {
      try {
        await Promise.all(selectedItems.map(id => axios.delete(`${API_BASE_URL}/plans/${id}`)));
        fetchPlans(searchTerm);
        setSelectedItems([]);
      } catch (error) {
        console.error("Error deleting selected plans:", error);
      }
    }
  };

  const handleSave = () => {
    fetchPlans(searchTerm);
    setIsModalOpen(false);
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
          Plans
        </Typography>
        <s.AddButton onClick={handleAdd}>Add Plan</s.AddButton>
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
                placeholder="Search plan..."
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
                    selectedItems.length < plans.length
                  }
                  checked={selectedItems.length === plans.length}
                  onChange={handleSelectAll}
                />
              </s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="title-column">Title</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="subtitle-column">Subtitle</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="duration-column">Duration</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="ispro-column">Is Pro</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="image-column">Image</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="actions-column">Actions</s.StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((plan) => (
                <s.StyledTableRow key={plan._id}>
                  <s.StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.includes(plan._id)}
                      onChange={() => handleSelectItem(plan._id)}
                    />
                  </s.StyledTableCell>
                  <s.StyledTableCell className="title-column">{plan.title}</s.StyledTableCell>
                  <s.StyledTableCell className="subtitle-column">{plan.subtitle}</s.StyledTableCell>
                  <s.StyledTableCell className="duration-column">{`${plan.duration.weeks} weeks, ${plan.duration.daysPerWeek} days/week`}</s.StyledTableCell>
                  <s.StyledTableCell className="ispro-column">{plan.isPro ? 'Yes' : 'No'}</s.StyledTableCell>
                  <s.StyledTableCell className="image-column">
                    {plan.backgroundImage && (
                      <s.ThumbnailImage src={plan.backgroundImage} alt={plan.title} />
                    )}
                  </s.StyledTableCell>
                  <s.StyledTableCell className="actions-column">
                    <IconButton onClick={(event) => handleMenuOpen(event, plan._id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === plan._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => {
                        handleEdit(plan);
                        handleMenuClose();
                      }}>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleDelete(plan._id);
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
          count={plans.length}
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
          <PlanForm
            plan={selectedPlan}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </s.StyledBox>
  );
};

export default PlanList;