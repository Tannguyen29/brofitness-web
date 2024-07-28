import { styled } from '@mui/material/styles';
import { Box, TableContainer, TableCell, TableRow, Button } from '@mui/material';

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
  borderRadius: '10px'
}));

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
  
  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: 'white'
  }));
  
  export const ActionButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(1),
  }));