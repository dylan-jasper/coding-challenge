import { useQuery } from "@tanstack/react-query";
import { calculateCost } from "../utils/calculateBenefits";

const transformEmployeeCosts = (employees) => {
  return employees.map((employee) => {
    let cost = calculateCost(employee);
    employee.discount = employee.name.startsWith("A");
    employee.dependents.forEach((dependent) => {
      cost += calculateCost(dependent);
      dependent.discount = dependent.name.startsWith("A");
    });

    return { ...employee, cost };
  });
};

const fetchEmployees = async () => {
  const res = await fetch("http://localhost:3000/employees");
  const employees = await res.json();
  return employees;
};

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    select: transformEmployeeCosts,
  });
}
