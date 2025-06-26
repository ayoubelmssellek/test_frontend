import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from './UpdateEmployees.module.css';

const UpdateEmployees = ({ Code, employee, onClose }) => {
    const Empls = useSelector((state) => state.admin.Employees);

    const [formData, setFormData] = useState({
        Name_Employee: '',
        Role_employee: '',
        Salary_Employee: '',
        Total_Avence_Employee: ''
    });
    
    useEffect(() => {
        if (employee) {
            setFormData({
                Name_Employee: employee.Name_Employee || '',
                Role_employee: employee.Role_employee || '',
                Salary_Employee: employee.Salary_Employee || '',
                Total_Avence_Employee: employee.Total_Avence_Employee || ''
            });
        }
    }, [employee]);

    const Roles = [...new Set(Empls.map((emp) => emp.Role_employee))];
    const isFormValid = formData.Name_Employee && formData.Role_employee && formData.Salary_Employee;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedEmp = { ...employee, ...formData };
        // dispatch(EditEmployee(Code, updatedEmp));
        onClose();
    };

    return (
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <p className={styles.title}>Update Employee</p>

                <div className={styles.formGroup}>
                    <input
                        type="text"
                        name="Name_Employee"
                        placeholder="Employee Name"
                        value={formData.Name_Employee}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <select
                        name="Role_employee"
                        value={formData.Role_employee}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    >
                        <option value="">Select Role</option>
                        {Roles.map((role, index) => (
                            <option key={index} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.flex}>
                    <div className={styles.formGroup}>
                        <input
                            type="number"
                            name="Salary_Employee"
                            placeholder="Salary"
                            value={formData.Salary_Employee}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="number"
                            name="Total_Avence_Employee"
                            placeholder="Total Advance"
                            value={formData.Total_Avence_Employee}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.actionAndCancelBtn}>
                    <button 
                        className={styles.updateProductBtn} 
                        type="submit" 
                        disabled={!isFormValid}
                    >
                        Update Employee
                    </button>
                    <button 
                        className={styles.cancelProductBtn} 
                        type="button" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

UpdateEmployees.propTypes = {
    employee: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    Code: PropTypes.number.isRequired,
};

export default UpdateEmployees;