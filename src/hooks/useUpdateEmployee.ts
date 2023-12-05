import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateEmployeeMutation = async (employee) => {
  const response = await fetch(
    `http://localhost:3000/employees/${employee.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    }
  );

  return response.json();
};

const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateEmployeeMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
  return mutation;
};

export default useUpdateEmployee;
