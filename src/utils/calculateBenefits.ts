import { Dependent, Employee } from "../types/Employee";

const EMPLOYEE_BASE_COST = 1000;
const DEPENDENT_BASE_COST = 500;
export const PAYCHECKS_PER_YEAR = 26;
// 10% discount if name starts with 'A'
const DISCOUNT_RATE = 0.1;

export const benefitsCostPerPaycheck = (employee: Employee) => {
  const employeeCost = employee.discount
    ? EMPLOYEE_BASE_COST * (1 - DISCOUNT_RATE)
    : EMPLOYEE_BASE_COST;
  const dependentsCost = employee.dependents.reduce((total, dependent) => {
    const dependentCost = dependent.discount
      ? DEPENDENT_BASE_COST * (1 - DISCOUNT_RATE)
      : DEPENDENT_BASE_COST;
    return total + dependentCost;
  }, 0);
  const totalCostPerYear = employeeCost + dependentsCost;
  return totalCostPerYear / PAYCHECKS_PER_YEAR;
};

export const calculateCost = (person: Employee | Dependent) => {
  if ("isEnrolled" in person && !person.isEnrolled) {
    return 0;
  }
  let cost = person.isEmployee ? EMPLOYEE_BASE_COST : DEPENDENT_BASE_COST;
  if (person.name.startsWith("A")) {
    cost *= 1 - DISCOUNT_RATE;
  }
  return cost;
};
