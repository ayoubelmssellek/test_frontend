import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { BsPersonFillAdd } from "react-icons/bs";
import { Link } from 'react-router-dom';
import AddEmployees from '../AddEmployee/AddEmployee';
import UpdateEmployees from '../UpdateEmployee/UpdateEmployees';
import Modal from '../../Modal/Modal';
import { LuChevronsUpDown } from "react-icons/lu";
import styles from './Employees.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchingEmployees } from '../../../Api/fetchingData/FechGetEmployees';

const Employees = () => {
    const { data: Empls , isLoading , error } = useQuery({
        queryKey: ['employees'],
        queryFn: fetchingEmployees 
    });

    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem('sidebarState');
        return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
    });

    useEffect(() => {
        localStorage.setItem('sidebarState', JSON.stringify(isOpen));
    }, [isOpen]);

    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchByName, setSearchByName] = useState('');
    const [searchByRole, setSearchByRole] = useState('');
    const [counts, setCounts] = useState({});

    const uniqueNames = [...new Set(Empls?.map(emp => emp.name))];
    const uniqueRoles = [...new Set(Empls?.map(emp => emp.role))];

    const FiltringEmpls = Empls?.filter((emp) => {
        const matchesName = searchByName ? emp.name === searchByName : true;
        const matchesRole = searchByRole ? emp.role === searchByRole : true;
        return matchesName && matchesRole;
    });

    const handleSidebarStateChange = (newState) => setIsOpen(newState);

    const handleDelete = (id) => {
        if (window.confirm(t('employees.delete_confirm'))) {
            // هنا يمكنك استدعاء دالة حذف مباشرة من API أو من useMutation مثلا
            alert(`Delete employee with id ${id} - Please implement actual delete logic`);
        }
    };

    const clearFilters = () => {
        setSearchByName('');
        setSearchByRole('');
    };

    const increment = (id) => {
        setCounts(prev => ({
            ...prev,
            [id]: (prev[id] || 0) < 4 ? (prev[id] || 0) + 1 : prev[id],
        }));
    };

    const decrement = (id) => {
        setCounts(prev => ({
            ...prev,
            [id]: (prev[id] || 0) > 0 ? (prev[id] || 0) - 1 : prev[id],
        }));
    };

    const handleAddClick = () => setShowAddModal(true);
    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setShowUpdateModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedEmployee(null);
    };

    if (isLoading) return <div>{t('loading')}</div>;
    if (error) return <div>{t('error_loading')}</div>;

    return (
        <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
            <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
            <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
                <Navbar pagePath={t('titles.Employees')} />
                <div className={styles.pages}>
                    <div className={styles.listEmployees}>
                        <div className={styles.filtersContainer}>
                            <div className={styles.filterInput}>
                                <select
                                    value={searchByName}
                                    onChange={(e) => setSearchByName(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">{t('filters.all_names')}</option>
                                    {uniqueNames.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                                <LuChevronsUpDown className={styles.selectIcon} />
                            </div>

                            <div className={styles.filterInput}>
                                <select
                                    value={searchByRole}
                                    onChange={(e) => setSearchByRole(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">{t('filters.all_roles')}</option>
                                    {uniqueRoles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                <LuChevronsUpDown className={styles.selectIcon} />
                            </div>

                            <button onClick={clearFilters} className={styles.clearButton}>
                                <FaTimes /> {t('filters.clear')}
                            </button>
                        </div>

                        <div className={styles.addEmployeeIcon}>
                            <Link onClick={handleAddClick}>
                                <BsPersonFillAdd size={30} color='var(--accent-color)' />
                            </Link>
                        </div>

                        {Empls.length !== 0 ? (
                            <table className={styles.productsTable}>
                                <thead>
                                    <tr>
                                        <th>{t('tables.name')}</th>
                                        <th>{t('tables.role')}</th>
                                        <th>{t('tables.salary')}</th>
                                        <th>{t('tables.total_advance')}</th>
                                        <th>{t('tables.num_reports')}</th>
                                        <th>{t('tables.current_salary')}</th>
                                        <th>{t('tables.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FiltringEmpls.map((employee, idx) => (
                                        <tr key={idx}>
                                            <td>{employee.name}</td>
                                            <td>{employee.role}</td>
                                            <td>{employee.salary} DH</td>
                                            <td>{employee.total_advance ?? 0} DH</td>
                                            <td>
                                                <div className={styles.countContainer}>
                                                    <button
                                                        onClick={() => decrement(employee.id)}
                                                        disabled={(counts[employee.id] || 0) === 0}
                                                        className={`${styles.countButton} ${styles.decrement}`}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={styles.countValue}>
                                                        {counts[employee.id] || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => increment(employee.id)}
                                                        disabled={(counts[employee.id] || 0) === 4}
                                                        className={`${styles.countButton} ${styles.increment}`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                {(employee.salary || 0) - (employee.total_advance || 0) - ((counts[employee.id] || 0) * 100)} DH
                                            </td>
                                            <td>
                                                <div className={styles.menuActions}>
                                                    <Link onClick={() => handleDelete(employee.id)}>
                                                        <FaTrash size={20} color="var(--danger)" />
                                                    </Link>
                                                    <Link onClick={() => handleEditClick(employee)}>
                                                        <FaEdit size={20} color="var(--success-color)" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className={styles.emptyState}>
                                <h3>{t('empty_state.title')}</h3>
                                <p>{t('empty_state.message')}</p>
                            </div>
                        )}
                    </div>
                </div>

                <Modal isOpen={showAddModal} onClose={handleCloseAddModal}>
                    <AddEmployees onClose={handleCloseAddModal} />
                </Modal>
                <Modal isOpen={showUpdateModal} onClose={handleCloseUpdateModal}>
                    <UpdateEmployees 
                        Code={selectedEmployee?.id} 
                        employee={selectedEmployee} 
                        onClose={handleCloseUpdateModal} 
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Employees;
