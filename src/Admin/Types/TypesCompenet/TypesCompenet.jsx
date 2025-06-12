import { useState } from "react";
import { TiPlus } from "react-icons/ti";
import { FaListUl, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";
import styles from "./TypesCompenet.module.css";
import { useTranslation } from "react-i18next";
import Modal from "../../Modal/Modal";
import AddType from "../AddType";
import UpdateType from "../TypesCompenet/UpdateSelectedType";
import { useQuery } from "@tanstack/react-query";
import { fetchingTypes } from "../../../Api/fetchingData/FetchingTypes";
import { fetchingDeleteType } from "../../../Api/fetchingData/FetchDeleteType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WarningAlert from "../../../Helper/AlertsMsg/WarningMsg";


const TypeCompenet = () => {
  const { data: types = [], error } = useQuery({
    queryKey: ["types"],
    queryFn: fetchingTypes,
  });
  const queryClient = useQueryClient();


  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
  });

  const [showAddTypeComponent, setShowAddTypesComponent] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleOpenAddModal = () => setShowAddTypesComponent(true);
  const handleCloseAddModal = () => setShowAddTypesComponent(false);

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };

  const handleEditClick = (type) => {
    setSelectedType(type);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedType(null);
  };

  const deleteMutation = useMutation({
    mutationFn: fetchingDeleteType,

    onSuccess: () => {
      queryClient.invalidateQueries(["types"]);
      
    },

    onError: (error) => {
      console.error("Delete failed:", error);
      alert(t("errors.delete_type_failed"));
    },
    });

  const handelDeleteClick = (typeId) => {
    if (window.confirm(t("types.confirm_delete"))) {
      deleteMutation.mutate(typeId);
    }
  };


  return (
    <div className={styles.content} dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />

      <div
        className={`${styles.typesContainer} ${
          isOpen ? styles.typesContainerPush : styles.typesContainerNoPush
        }`}
      >
        <Navbar pagePath={t("titles.Types")} />

        <div className={styles.pages}>
          <div className={styles.typesContent}>
              <WarningAlert message={t("msg.If you delete a type, all products belonging to that type will also be removed")} />
            
            <div className={styles.headerSection}>
              <div className={styles.headerLeft}>
                <div className={styles.typeCounter}>
                  <FaListUl className={styles.counterIcon} />
                  <span className={styles.counterNumber}>{types.length}</span>
                  <span className={styles.counterText}>{t("filters.Total Types")}</span>
                </div>
              </div>

              <button className={styles.addTypeBtn} onClick={handleOpenAddModal}>
                <TiPlus className={styles.plusIcon} />
                {t("filters.add_Type")}
              </button>
            </div>

            {error ? (
              <div className={styles.error}>Error: {error.message}</div>
            ) : (
              <div className={styles.typesGrid}>
                {types.map((type) => (
                  <div key={type.id} className={styles.typeCard}>
                    <div className={styles.cardContent}>
                      <h3 className={styles.typeTitle}>{type.name}</h3>
                      <p className={styles.typeStatus}>{t(`status.${type.status}`)}</p>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          title="Edit"
                          onClick={() => handleEditClick(type)}
                        >
                          <FaEdit />
                        </button>
                        <button className={styles.deleteBtn} title="Delete"
                         onClick={()=>handelDeleteClick(type.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Type Modal */}
        <Modal isOpen={showAddTypeComponent} onClose={handleCloseAddModal}>
          <AddType onClose={handleCloseAddModal} />
        </Modal>

        {/* Update Type Modal */}
        <Modal isOpen={showUpdateModal} onClose={handleCloseUpdateModal}>
          <UpdateType onClose={handleCloseUpdateModal} type={selectedType} />
        </Modal>
      </div>
    </div>
  );
};

export default TypeCompenet;
