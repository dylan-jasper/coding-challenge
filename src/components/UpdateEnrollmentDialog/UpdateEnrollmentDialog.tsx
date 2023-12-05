import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { Dependent, Employee } from "../../types/Employee";
import DependentsTable from "../DependentsTable";
import InputLabel from "@mui/material/InputLabel";
import useUpdateEmployee from "../../hooks/useUpdateEmployee";
import Box from "@mui/material/Box";
import {
  calculateCost,
  PAYCHECKS_PER_YEAR,
} from "../../utils/calculateBenefits";

interface UpdateEnrollmentDialogProps {
  open: boolean;
  handleClose: () => void;
  selectedEmployee: Employee;
}

const placeholderDependent: Dependent = {
  name: "",
  isEmployee: false,
  discount: false,
};

export default function UpdateEnrollmentDialog({
  open,
  handleClose,
  selectedEmployee,
}: UpdateEnrollmentDialogProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee | null>(null);
  const [newDependent, setNewDependent] = useState(placeholderDependent);
  const [showAlert, setShowAlert] = useState(false);
  const [costPreview, setCostPreview] = useState(0);

  const updateEmployeeMutation = useUpdateEmployee();

  const handleUpdate = () => {
    updateEmployeeMutation.mutate(updatedEmployee, {
      onSuccess: () => {
        handleClose();
        setNewDependent(placeholderDependent);
        setShowAlert(false);
      },
    });
  };

  const handleDeleteDependent = (id: number) => {
    setUpdatedEmployee((prevState) => {
      const updatedDependents = prevState.dependents?.filter(
        (dep) => dep.id !== id
      );
      const updatedState = { ...prevState, dependents: updatedDependents };
      calculateCostPreview(updatedState);
      return updatedState;
    });
  };

  const handleAddDependent = () => {
    if (newDependent.name.trim() !== "") {
      const newDependentWithId = {
        ...newDependent,
        id: updatedEmployee.dependents.length + 1 || 1,
      };

      const updatedDependents = updatedEmployee?.dependents
        ? [...updatedEmployee.dependents, newDependentWithId]
        : [newDependentWithId];

      const updatedEmployeeState = {
        ...updatedEmployee,
        dependents: updatedDependents,
      };

      setUpdatedEmployee(updatedEmployeeState);
      calculateCostPreview(updatedEmployeeState);
      setShowAlert(true);
    }
  };

  const handleEnrollmentChange = (e) => {
    setUpdatedEmployee({ ...updatedEmployee, isEnrolled: e.target.checked });
    setShowAlert(true);
  };

  const calculateCostPreview = (updatedEmployee: Employee) => {
    let cost = 0;
    if (updatedEmployee?.isEnrolled) {
      cost += calculateCost(updatedEmployee);
    }
    cost += (updatedEmployee.dependents || []).reduce(
      (total, dependent) => total + calculateCost(dependent),
      0
    );
    cost /= PAYCHECKS_PER_YEAR;
    setCostPreview(Number(cost.toFixed(2)));
  };

  useEffect(() => {
    setEmployee(selectedEmployee);
    setUpdatedEmployee(selectedEmployee);
  }, [selectedEmployee]);

  useEffect(() => {
    if (updatedEmployee) {
      calculateCostPreview(updatedEmployee);
    }
  }, [updatedEmployee]);

  const { name, dependents } = employee || {};

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Benefits Election</DialogTitle>
        {showAlert && (
          <Alert severity="info">Press "Save Changes" to finalize.</Alert>
        )}
        <DialogContent>
          <Box mb={2}>
            <DialogContentText>
              Update the benefits election choices for the employee and their
              dependents.
            </DialogContentText>
          </Box>
          <Box mb={2}>
            <Typography variant="body1" component="div">
              Employee: {name}
            </Typography>
          </Box>
          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={updatedEmployee?.isEnrolled || false}
                  onChange={handleEnrollmentChange}
                />
              }
              label="Employee Enrollment"
            />
          </Box>
          {dependents?.length > 0 && (
            <Box mb={2}>
              <DependentsTable
                handleDeleteDependent={handleDeleteDependent}
                dependents={dependents}
              />
            </Box>
          )}
          <Box mb={2}>
            <InputLabel htmlFor="dependent-name"> Dependent Name </InputLabel>
            <TextField
              id="dependent-name"
              value={newDependent.name}
              onChange={(e) =>
                setNewDependent({ ...newDependent, name: e.target.value })
              }
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDependent}
            >
              Add Dependent
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="body1" component="div">
              Total cost for employee: ${costPreview}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
