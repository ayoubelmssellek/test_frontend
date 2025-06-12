import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../Sidebar/Sidebar';
import { FaTrash, FaEye, FaEdit, FaSearch, FaTimes } from 'react-icons/fa';
import { LuChevronsUpDown } from "react-icons/lu";
import UpdateSelectedProduct from '../Up/UpdateSelectedProduct';
import Navbar from '../../Navbar/Navbar';
import AddProduct from '../AddProduct/AddProduct';
import ViewMore from '../ViewMore/ViewMore';
import Modal from '../../Modal/Modal';
import { TiPlus } from 'react-icons/ti';
import { GoMultiSelect } from "react-icons/go";
import styles from './Products.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchingProducts } from '../../../Api/fetchingData/FetchProducts';
import { fetchingDeleteProduct } from '../../../Api/fetchingData/FetchDeleteProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingUpdateProductStatus } from '../../../Api/fetchingData/FetchUpdateProductStatu';
import { fetchingUser } from '../../../Api/fetchingData/FetchUserData';

const Products = () => {
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: fetchingProducts,
        staleTime: 10000,
    })
    

      const { data: parsedUser } = useQuery({
        queryKey: ['user'],
        queryFn: fetchingUser,
        staleTime: 10000,
    })
    const queryClient = useQueryClient();

         

    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem('sidebarState');
        return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
    });

    useEffect(() => {
        localStorage.setItem('sidebarState', JSON.stringify(isOpen));
    }, [isOpen]);

    const [showUpComponent, setShowUpComponent] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showViewComponent, setShowViewComponent] = useState(false);
    const [showAddComponent, setShowAddComponent] = useState(false);
    const [searchByName, setSearchByName] = useState('');
    const [searchByCategory, setSearchByCategory] = useState('');
    const [searchByType, setSearchByType] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const types = useMemo(() => 
        [...new Set(products?.map(product => product?.type?.name).filter(Boolean))],
        [products]
    );
    const Category = useMemo(() =>
        [...new Set(products?.map(product => product?.category?.name).filter(Boolean))],
        [products]
    );
    const FiltringData = useMemo(() => 
        products?.filter((prods) => {
            const matchesName = prods?.name.toLowerCase().includes(searchByName.toLowerCase());
            const matchesCategory = prods?.category?.name?.toLowerCase().includes(searchByCategory.toLowerCase());
            const matchesType = prods?.type?.name?.toLowerCase().includes(searchByType.toLowerCase());
            return matchesName && matchesCategory && matchesType;
        }) || [],
        [products, searchByName, searchByCategory, searchByType]
    );

    // Pagination calculations
    const totalPages = Math.ceil(FiltringData.length / itemsPerPage);
    const currentData = FiltringData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchByName, searchByCategory, searchByType]);

    useEffect(() => {
        const newTotalPages = Math.ceil(FiltringData.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
            setCurrentPage(1);
        }
    }, [FiltringData, currentPage, itemsPerPage]);


    const handleSidebarStateChange = (newState) => setIsOpen(newState);
    const clearFilters = () => {
        setSearchByName('');
        setSearchByCategory('');
        setSearchByType('');
    };

    const handleAddClick = () => setShowAddComponent(true);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setShowUpComponent(true);
    };
    const handleViewClick = (product) => {
        setSelectedProduct(product);
        setShowViewComponent(true);
    };
    const handleCloseModal = () => {
        setShowUpComponent(false);
        setSelectedProduct(null);
    };
    const handleCloseViewModal = () => {
        setShowViewComponent(false);
        setSelectedProduct(null);
    };
    const handleCloseAddModal = () => setShowAddComponent(false);

    const handleDropdownToggle = (id) => {
        setOpenDropdownId((prev) => {
            if (prev == id) {
                return null;
            } else {
                return id;
            }
        });
    };


    
    
    

    useEffect(() => {
        const handleClickOutside = (e) => {
            // تحقق من أن النقر ليس داخل الـ dropdown أو الزر الذي يفتح الـ dropdown
            if (!e.target.closest(`.${styles.popup}`) && !e.target.closest(`.${styles.actionButton}`)) {
                setOpenDropdownId(null); // إغلاق الـ dropdown إذا تم النقر خارج العنصر
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    
    const updateStatuMutation = useMutation(
        {
            mutationFn:({ id, status })=> fetchingUpdateProductStatus(id, {status: status}),
            
            onSuccess: () => {
                queryClient.invalidateQueries(['products']);
            },
            
            onMutate: async (newStatus) => {
                await queryClient.cancelQueries(['products']);
                const previousData = queryClient.getQueryData(['products']);
                queryClient.setQueryData(['products'], (old = []) =>
                    old.map((item) =>
                        item.id === newStatus.id ? { ...item, status: newStatus.status } : item
                    )
                );                
                return { previousData };
            },
            onError: (error) => {
                console.error('Status update failed:', error);
            },
        }
    );

    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'avalaible' ? 'out of stock' : 'avalaible';
        
        updateStatuMutation.mutate({ id, status:newStatus });

        
    };

    const deleteMutation = useMutation({
        mutationFn: fetchingDeleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            console.error('Delete failed:', error);
            alert(t('errors.delete_product_failed'));
        },
    });
    const handleDeleteClick = (productId) => {
        if (window.confirm(t('products.confirm_delete'))) {
            deleteMutation.mutate(productId);
        }
    };

    if (isLoading) return <div>{t('loading')}</div>;
    if (isError) return <div>{t('error_loading')}</div>;

    return (
        <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'} >
            <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
            <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
                <Navbar pagePath={t('titles.Products')} />
                <div className={styles.pages}>
                    <div className={styles.productsContainer}>
                        <div className={styles.filtersContainer}>
                            <div className={styles.filterInput}>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={searchByCategory}
                                        onChange={(e) => setSearchByCategory(e.target.value)}
                                    >
                                        <option value="">{t('filters.select_category')}</option>
                                        {Category.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <LuChevronsUpDown className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterInput}>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={searchByType}
                                        onChange={(e) => setSearchByType(e.target.value)}
                                    >
                                        <option value="">{t('filters.select_type')}</option>
                                        {types.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                        ))}
                                    </select>
                                    <LuChevronsUpDown className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterInput}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder=" "
                                        value={searchByName}
                                        onChange={(e) => setSearchByName(e.target.value)}
                                    />
                                    <label>{t('filters.search_name')}</label>
                                    <FaSearch className={styles.inputIcon} />
                                </div>
                            </div>

                            <button onClick={clearFilters} className={styles.clearButton}>
                                <FaTimes /> {t('filters.clear')}
                            </button>
                        </div>

                    {
                            parsedUser?.role_id === 2 && parsedUser.role_name === 'admin'  && (
                                                        <div className={styles.addButton} onClick={handleAddClick}>
                                                            <TiPlus size={24} />
                                                            <span>{t('products.add_product')}</span>
                                                        </div>
                            )
                    }

                        <div className={styles.tableProductsContainer}>
                            {products?.length > 0 ? (
                                <>
                                    <table className={styles.productsTable}>
                                        <thead>
                                            <tr>
                                                <th>{t('tables.name')}</th>
                                                <th>{t('tables.category')}</th>
                                                <th>{t('tables.type')}</th>
                                                <th>{t('tables.price')}</th>
                                                <th>{t('tables.image')}</th>
                                                <th>{t('tables.status')}</th>
                                                {
                                                    parsedUser?.role_id === 2 && parsedUser.role_name === 'admin'  && (
                                                        <th>{t('tables.actions')}</th>
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.category.name}</td>
                                                    <td>{item.type.name}</td>
                                                    <td>{item.price}</td>
                                                    <td>
                                                        <img
                                                        className={styles.productImage}
                                                        src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.image_path}`}
                                                        alt={item.name}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={`${styles.statusButton} ${item.status === 'avalaible' ? styles.statusAvalaible : styles.statusOutOfStock}`}
                                                            onClick={() => handleStatusToggle(item.id, item.status)}
                                                        >
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    {
                                                        parsedUser?.role_id === 2 && parsedUser.role_name === 'admin'  && (
                                                                                                                <td>
                                                    <div className={styles.popup}>
                                                        <button
                                                        onClick={() => handleDropdownToggle(item.id)}
                                                        className={styles.burger}
                                                        >
                                                        <GoMultiSelect size={20} />
                                                        </button>
                                                        
                                                        {/* عند فتح الـ dropdown، أضف class "open" */}
                                                        {openDropdownId == item.id && (
                                                        <div className={`${styles.popupWindow} ${openDropdownId == item.id ? styles.open  : ''}`}>
                                                            <button onClick={() => handleViewClick(item)}
                                                             style={{color: '#235cff'}}
                                                            >
                                                            <FaEye /> {t('products.view')}
                                                            </button>
                                                            <button onClick={() => handleEditClick(item)}
                                                            style={{color: '#16a34a'}}    
                                                            >
                                                            <FaEdit /> {t('products.edit')}
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(item.id)}>
                                                            <FaTrash /> {t('products.delete')}
                                                            </button>
                                                        </div>
                                                        )}
                                                    </div>
                                                    </td>
                                                        )
                                                    }
                                             
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className={styles.pagination}>
                                        <button
                                            className={styles.paginationButton}
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        >
                                            Previous
                                        </button>
                                        <span>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            className={styles.paginationButton}
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div>{t('products.no_products')}</div>
                            )}
                        </div>
                    </div>

                    {showUpComponent && (
                        <Modal isOpen={showUpComponent} onClose={handleCloseModal}>
                            <UpdateSelectedProduct product={selectedProduct} onClose={handleCloseModal} />
                        </Modal>
                    )}

                    {showAddComponent && (
                    <Modal isOpen={showAddComponent} onClose={handleCloseAddModal}>
                        <AddProduct onClose={handleCloseAddModal} />
                    </Modal>
                    )}


                    {showViewComponent && (
                        <Modal onClose={handleCloseViewModal} isOpen={showViewComponent}>
                            <ViewMore product={selectedProduct} onClose={handleCloseViewModal} />
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
