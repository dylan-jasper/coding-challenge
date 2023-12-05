export interface Employee {
  id?: number;
  name: string;
  dependents: Dependent[];
  isEnrolled: boolean;
  discount: boolean;
  cost?: number;
  isEmployee: boolean;
}

export interface Dependent
  extends Omit<Employee, "dependents" | "isEnrolled"> {}
