// src/components/BannerList.styles.jsx
import { styled } from '@mui/material/styles';
import { Box, TableContainer, TableCell, TableRow, Button, InputBase } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginRight: '100px',
}));

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  [theme.breakpoints.up('md')]: {
    gap: '500px',
  },
}));

export const FormContainer = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  }));
  
  export const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    backgroundColor: '#FD6300',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#FD6300'
    },
}));  

export const AddButton = styled('button')({
  color: 'white',
  backgroundColor: '#FD6300',
  border: 'none',
  width: '150px',
  height: '45px',
  borderRadius: '15px',
  cursor: "pointer",
});

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '10px',
  tableLayout: 'fixed',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: 'white',
  '&.name-column': {
    width: '200px',
    maxWidth: '200px',
    minWidth: '200px',
  },
  '&.image-column': {
    width: '150px',
    maxWidth: '150px',
    minWidth: '150px',
  },
  '&.expiry-column': {
    width: '150px',
    maxWidth: '150px',
    minWidth: '150px',
  },
  '&.actions-column': {
    width: '150px',
    maxWidth: '150px',
    minWidth: '150px',
  },
}));

export const TableHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: 'white',
});

export const SearchInput = styled(InputBase)({
  marginLeft: '8px',
  flex: 1,
  maxWidth: "300px",
});

export const FilterButton = styled(Button)({
  minWidth: 'unset',
  padding: '8px',
});

export const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: 'rgb(244, 246, 248)',
  color: '#666',
  border: 'none'
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));