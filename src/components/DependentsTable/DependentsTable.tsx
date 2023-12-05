import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DependentTableItem from "../DependentTableItem";
import { Dependent } from "../../types/Employee";

export default function DependentsTable({ dependents, handleDeleteDependent }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Delete Dependent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dependents.map((dependent: Dependent) => (
            <TableRow key={dependent.id}>
              <DependentTableItem
                key={dependent.id}
                dependent={dependent}
                handleDeleteDependent={handleDeleteDependent}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
