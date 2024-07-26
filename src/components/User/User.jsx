import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  InputAdornment,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as s from "./User.styles";

const API_BASE_URL = "http://localhost:5000";

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(users.map((user) => user._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${id}`);
        fetchUsers(); // Refresh danh sách sau khi xóa
      } catch (error) {
        console.error(
          "Error deleting user:",
          error.response?.data || error.message
        );
        alert("Failed to delete user. Please check console for details.");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedItems.length} selected users?`
      )
    ) {
      try {
        await Promise.all(
          selectedItems.map((id) => axios.delete(`${API_BASE_URL}/users/${id}`))
        );
        fetchUsers();
        setSelectedItems([]);
      } catch (error) {
        console.error(
          "Error deleting selected users:",
          error.response?.data || error.message
        );
        alert("Failed to delete users. Please check console for details.");
      }
    }
  };

  return (
    <s.StyledBox>
      <s.Container>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
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
                placeholder="Search user..."
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
                    selectedItems.length < users.length
                  }
                  checked={selectedItems.length === users.length}
                  onChange={handleSelectAll}
                />
              </s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Name</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Email</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Gender</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Verified</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Actions</s.StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <s.StyledTableRow key={user._id}>
                <s.StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.includes(user._id)}
                    onChange={() => handleSelectItem(user._id)}
                  />
                </s.StyledTableCell>
                <s.StyledTableCell>{user.name}</s.StyledTableCell>
                <s.StyledTableCell>{user.email}</s.StyledTableCell>
                <s.StyledTableCell>
                  {user.personalInfo?.gender || "N/A"}
                </s.StyledTableCell>
                <s.StyledTableCell>
                  {user.verified ? "Yes" : "No"}
                </s.StyledTableCell>
                <s.StyledTableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, user._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenuId === user._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleDelete(user._id);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </s.StyledTableCell>
              </s.StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </s.StyledTableContainer>
    </s.StyledBox>
  );
};

export default User;
