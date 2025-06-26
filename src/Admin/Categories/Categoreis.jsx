import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEye , FaTrash , FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import styles from "./Categories.module.css";
import { FaListUl } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link , useParams} from "react-router-dom";
import Modal from "../Modal/Modal";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import { useQuery } from "@tanstack/react-query";
import { fetchingCategories } from "../../Api/fetchingData/FetchCategories";
import { fetchingDeleteCategory } from "../../Api/fetchingData/FetchDeleteCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WarningAlert from "../../Helper/AlertsMsg/WarningMsg";
const Categories = () => {
  const {data,isLoading,error} = useQuery({
    queryKey: ['categories'],
    queryFn: fetchingCategories,
  })

  const queryClient = useQueryClient();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // RTL detection
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
  });
  const { role } = useParams();
  const [showAddCategoryComponent, setShowAddCategoryComponent] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedType] = useState(null);

  const handleEditClick = (category) => {
    setSelectedType(category);
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => setShowAddCategoryComponent(false);
  const handleOpenModal = () => setShowAddCategoryComponent(true); // ✅ Fix: Open Modal

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isOpen));
  }, [isOpen]);


  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };

  
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedType(null);
  };

  
  const deleteMutation = useMutation({
    mutationFn: fetchingDeleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },

    onError: (error) => {
      console.error("Delete failed:", error);
      alert(t("errors.delete_category_failed"));
    },
    });

  const handelDeleteClick = (CategoryId) => {
    if (window.confirm(t("category.confirm_delete"))) {
      deleteMutation.mutate(CategoryId);
    }
  };
  

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  isLoading&&<div className={styles.loading}>Loading...</div>
  error&&<div className={styles.error}>Error: {error.message}</div>

  return (
    <div className={styles.content} dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      
      <div className={`${styles.categoriesContainer} ${isOpen ? styles.categoriesContainerPush : styles.categoriesContainerNoPush}`}>
        <Navbar pagePath={t("titles.Categories")} />
        
        <div className={styles.pages}>
          <div className={styles.categoriesContent}>
            {/* Header Section */}
             <WarningAlert message={t("msg.If you delete a category, all products belonging to that category will also be removed")}/>
            <div className={styles.headerSection}>
              <div className={styles.headerLeft}>
                <div className={styles.categoryCounter}>
                  <FaListUl className={styles.counterIcon} />
                  <span className={styles.counterNumber}>{data?.length}</span>
                  <span className={styles.counterText}>{t("filters.Total Category")}</span>
                </div>
              </div>

              {/* ✅ Fix: Change Link to a button */}
              <button className={styles.addCategoryBtn} onClick={handleOpenModal}>
                <TiPlus className={styles.plusIcon} />
                {t("filters.add_Category")}
              </button>
            </div>

            {/* Categories Grid */}
            <motion.div
              className={styles.categoriesGrid}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {data?.map((cat) => (
                <motion.div
                  key={cat.menu_name}
                  className={styles.categoryCard}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.cardMedia}>
                    <img
                      src= {`${import.meta.env.VITE_API_IMG_BASE_URL}/${cat.image}?t=${Date.now()}`} 
                      alt={cat.menu_name}
                      className={styles.categoryImage}
                    />
                    <div className={styles.imageOverlay} />
                    <span className={styles.productCount}>
                      {cat.products_count}
                    </span>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.categoryTitle}>{cat.name}</h3>

                    <div className={styles.cardFooter}>
                      <div className={styles.UpAndDelete}>
                           <button onClick={()=>handleEditClick(cat)}>
                             <FaEdit size={20} color="#10b981"/>
                           </button>
                           <button onClick={()=>handelDeleteClick(cat.id)}>
                             <FaTrash size={20} color="#ef4444"/>
                           </button>
                      </div>
                      <Link to={`/Dashboard/${role}/ViewCategoryDetails/${cat.name}`} className={styles.viewButton} >
                        <FaEye className={styles.eyeIcon} />
                        <span>{t("actions.view_details")}</span>
                      </Link>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ✅ Fix: Show AddCategory inside the Modal */}
        <Modal isOpen={showAddCategoryComponent} onClose={handleCloseModal}>
          <AddCategory onClose={handleCloseModal} />
        </Modal>
        <Modal isOpen={showUpdateModal} onClose={handleCloseUpdateModal}>
          <UpdateCategory onClose={handleCloseUpdateModal} category={selectedCategory} />
        </Modal>
      </div>
    </div>
  );
};

export default Categories;
