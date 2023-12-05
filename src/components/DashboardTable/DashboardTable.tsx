import { useState } from "react";
import UpdateEnrollmentDialog from "../UpdateEnrollmentDialog";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import { useEmployees } from "../../hooks/useEmployees";
import { Employee } from "../../types/Employee";
import { PAYCHECKS_PER_YEAR } from "../../utils/calculateBenefits";

const defaultEmployee: Employee = {
  id: 0,
  name: "",
  dependents: [],
  isEnrolled: false,
  discount: false,
  isEmployee: true,
};

export default function DashboardTable() {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(defaultEmployee);

  const { data: employees = [], isLoading } = useEmployees();

  const totalCostPerPaycheck = employees.reduce(
    (total, employee) => total + employee.cost / PAYCHECKS_PER_YEAR,
    0
  );

  const handleClickOpen = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Employee", width: 130 },
    {
      field: "isEnrolled",
      headerName: "Enrolled",
      type: "boolean",
      width: 170,
    },

    {
      field: "dependents",
      headerName: "Dependents",
      width: 290,
      valueGetter: (params) =>
        params.row.dependents.map((dependent) => dependent.name).join(", "),
    },
    {
      field: "discount",
      headerName: "Employee Discount Applied",
      type: "boolean",
      width: 230,
    },
    {
      field: "cost",
      headerName: "Benefit Cost Per Paycheck",
      type: "number",
      width: 225,
      valueGetter: (params) =>
        (params.row.cost / PAYCHECKS_PER_YEAR).toFixed(2),
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          label="Edit Enrollment"
          onClick={() => handleClickOpen(params.row)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Typography variant="h4" component="div" m={2}>
        Benefits Manager
      </Typography>
      <DataGrid
        loading={isLoading}
        rows={employees}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        autoHeight
      />
      <div style={{ textAlign: "right", paddingRight: "20px" }}>
        <p> Total Cost Per Paycheck: ${totalCostPerPaycheck.toFixed(2)}</p>
      </div>
      <UpdateEnrollmentDialog
        key={selectedEmployee.id}
        open={open}
        handleClose={handleClose}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}
