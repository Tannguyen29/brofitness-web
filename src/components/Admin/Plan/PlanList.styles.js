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
  '&.title-column': {
    width: '200px',
    maxWidth: '200px',
    minWidth: '200px',
  },
  '&.subtitle-column': {
    width: '250px',
    maxWidth: '250px',
    minWidth: '250px',
  },
  '&.duration-column': {
    width: '150px',
    maxWidth: '150px',
    minWidth: '150px',
  },
  '&.ispro-column': {
    width: '100px',
    maxWidth: '100px',
    minWidth: '100px',
  },'&.actions-column': {
    width: '100px',
    maxWidth: '100px',
    minWidth: '100px',
  },
  '&.image-column': {
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

export const ThumbnailImage = styled('img')({
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '4px',
});