import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Dependent } from "../../types/Employee";
import TableCell from "@mui/material/TableCell";

interface DependentProps {
  dependent: Dependent;
  handleDeleteDependent: (id: number) => void;
}

export default function DependentTableItem({
  dependent,
  handleDeleteDependent,
}: DependentProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = (id: number) => {
    setIsSelected(!isSelected);
    handleDeleteDependent(id);
  };

  return (
    <TableCell scope="row">
      <Checkbox
        checked={isSelected}
        onChange={() => handleSelect(dependent.id)}
      />
      {dependent.name}
    </TableCell>
  );
}
