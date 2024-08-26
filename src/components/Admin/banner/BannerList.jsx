import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog,
  DialogContent,
  Typography,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BannerForm from './BannerForm';
import * as s from './BannerStyles';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedBanner(null);
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`http://localhost:5000/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(banners.map((banner) => banner._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected banners?`)) {
      try {
        await Promise.all(selectedItems.map(id => axios.delete(`http://localhost:5000/banners/${id}`)));
        fetchBanners();
        setSelectedItems([]);
      } catch (error) {
        console.error("Error deleting selected banners:", error);
      }
    }
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
    setSearchTerm(event.target.value);
  };

  return (
    <s.StyledBox>
      <s.Container>
        <Typography variant="h4" gutterBottom>
          Banner Management
        </Typography>
        <s.AddButton onClick={handleOpen}>Add New Banner</s.AddButton>
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
                placeholder="Search banner..."
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
                  indeterminate={selectedItems.length > 0 && selectedItems.length < banners.length}
                  checked={selectedItems.length === banners.length}
                  onChange={handleSelectAll}
                />
              </s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="name-column">Name</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="image-column">Image</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="expiry-column">Expiry Date</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell className="actions-column">Actions</s.StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((banner) => (
              <s.StyledTableRow key={banner._id}>
                <s.StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.includes(banner._id)}
                    onChange={() => handleSelectItem(banner._id)}
                  />
                </s.StyledTableCell>
                <s.StyledTableCell className="name-column">{banner.name}</s.StyledTableCell>
                <s.StyledTableCell className="image-column">
                  <img src={banner.imageUrl} alt={banner.name} style={{ width: 100, height: 'auto' }} />
                </s.StyledTableCell>
                <s.StyledTableCell className="expiry-column">{new Date(banner.expiryDate).toLocaleDateString()}</s.StyledTableCell>
                <s.StyledTableCell className="actions-column">
                  <IconButton onClick={(event) => handleMenuOpen(event, banner._id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenuId === banner._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => {
                      handleEdit(banner);
                      handleMenuClose();
                    }}>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleDelete(banner._id);
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={banners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </s.StyledTableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <BannerForm onClose={handleClose} banner={selectedBanner} onSave={fetchBanners} />
        </DialogContent>
      </Dialog>
    </s.StyledBox>
  );
};

export default BannerList;