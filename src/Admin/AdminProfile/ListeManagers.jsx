import PropTypes from "prop-types";
import styles from "./ListeManagers.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingManagers } from "../../Api/fetchingData/FetchGetAllManagers";
import { MdCancel } from "react-icons/md";

import { fetchingDeleteManager } from "../../Api/fetchingData/FetchDeleteManager";

const ListeManagers = ({ onClose }) => {
  const queryClient = useQueryClient();

  // Fetch managers data
  const { 
    data: managers = [], 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: ['managers'],
    queryFn: fetchingManagers
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (managerId) => fetchingDeleteManager(managerId),
    onSuccess: () => {
      queryClient.invalidateQueries(["managers"]); // Fixed: should invalidate 'managers' not 'types'
      onClose();
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      // Consider adding user feedback here (toast/alert)
    },
  });

  const handleDeleteClick = (managerId) => {
    if (window.confirm("Are you sure you want to delete this manager?")) { // Fixed confirmation message
      deleteMutation.mutate(managerId);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading managers...</div>;
  if (isError) return <div className={styles.error}>Error loading managers: {error.message}</div>;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Managers List</h2>
        <button onClick={onClose}>
          <MdCancel size={30}/>
        </button>
      </div>
      {managers.length === 0 ? (
        <div className={styles.emptyMessage}>No managers found</div>
      ) : (
        <table className={styles.managersTable}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Phone</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id} className={styles.tr}>
                <td className={styles.td}>{manager.name}</td>
                <td className={styles.td}>{manager.phone}</td>
                <td className={styles.td}>
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => handleDeleteClick(manager.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

ListeManagers.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ListeManagers;