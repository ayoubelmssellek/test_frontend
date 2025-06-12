import { useState } from 'react';
// import { AddEmployee } from '../../Redux/Action';
import PropTypes from 'prop-types';
import styles from './AddEmployees.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingAddEmployee } from '../../../Api/fetchingData/FetchAddEmployee';

const AddEmployees = ({ onClose }) => {
  // const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const [Name_Employee, setName_Employee] = useState('');
  const [Role_employee, setRole_employee] = useState('');
  const [Salary_Employee, setSalary_Employee] = useState('');
  const [error, setError] = useState('');

  const isFormValid = Name_Employee && Role_employee && Salary_Employee;

  const addEmployeeMutation = useMutation({
    mutationFn: fetchingAddEmployee,
    onMutate: async (newEmployee) => {
      await queryClient.cancelQueries(['employees']);

      const previousEmployees = queryClient.getQueryData(['employees']);

      const tempEmployee = {
        id: Date.now(), // مؤقتاً لتعريف العنصر مؤقتاً
        ...newEmployee,
      };

      queryClient.setQueryData(['employees'], (oldData) => {
        return oldData ? [...oldData, tempEmployee] : [tempEmployee];
      });

      return { previousEmployees };
    },
    onError: (err, newEmployee, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
      setError('Failed to add employee. Please try again.');
    },
    onSuccess: (newEmployeeFromServer, _variables, context) => {
      queryClient.setQueryData(['employees'], (oldData) => {
        // استبدال العنصر المؤقت بالعنصر الحقيقي من السيرفر
        return oldData.map((emp) =>
          emp.id === context.previousEmployees.length ? newEmployeeFromServer : emp
        );
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please fill all fields');
      return;
    }

    const newEmployee = {
      name: Name_Employee,
      role: Role_employee,
      salary: parseFloat(Salary_Employee),
    };

    addEmployeeMutation.mutate(newEmployee);
    onClose();
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>Add New Employee</p>
        {error && <span className={styles.errorMessage}>{error}</span>}

        <div className={styles.formGroup}>
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={Name_Employee}
            onChange={(e) => setName_Employee(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <select
            value={Role_employee}
            onChange={(e) => setRole_employee(e.target.value)}
            className={styles.input}
            name="role"
          >
            <option value="">Select Role</option>
            <option value="manager">manager</option>
            <option value="chef">chef</option>
          </select>
        </div>

        <div className={styles.flex}>
          <div className={styles.formGroup}>
            <input
              type="number"
              placeholder="Salary"
              value={Salary_Employee}
              onChange={(e) => setSalary_Employee(e.target.value)}
              className={styles.input}
              name="salary"
              min="0"
            />
          </div>
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button className={styles.updateProductBtn} type="submit" disabled={addEmployeeMutation.isLoading}>
            {addEmployeeMutation.isLoading ? 'Adding...' : 'Add Employee'}
          </button>
          <button className={styles.cancelProductBtn} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

AddEmployees.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddEmployees;
