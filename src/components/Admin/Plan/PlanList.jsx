import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlanForm from './PlanForm';
import * as s from "./PlanList.styles";

const API_BASE_URL = "http://localhost:5000";

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`${API_BASE_URL}/plans/${id}`);
        fetchPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const handleSave = () => {
    fetchPlans();
    setIsModalOpen(false);
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
        <Table>
          <TableHead>
            <TableRow>
              <s.StyledTableHeaderCell>Title</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Subtitle</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Duration</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Is Pro</s.StyledTableHeaderCell>
              <s.StyledTableHeaderCell>Actions</s.StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <s.StyledTableRow key={plan._id}>
                <s.StyledTableCell>{plan.title}</s.StyledTableCell>
                <s.StyledTableCell>{plan.subtitle}</s.StyledTableCell>
                <s.StyledTableCell>{`${plan.duration.weeks} weeks, ${plan.duration.daysPerWeek} days/week`}</s.StyledTableCell>
                <s.StyledTableCell>{plan.isPro ? 'Yes' : 'No'}</s.StyledTableCell>
                <s.StyledTableCell>
                  <IconButton onClick={() => handleEdit(plan)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plan._id)}>
                    <DeleteIcon />
                  </IconButton>
                </s.StyledTableCell>
              </s.StyledTableRow>
            ))}
          </TableBody>
        </Table>
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