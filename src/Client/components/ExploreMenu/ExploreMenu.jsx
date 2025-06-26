import React, { use } from 'react'
import styles from './ExploreMenu.module.css'
import { Link } from 'react-router-dom'
import { fetchingCategories } from '../../../Api/fetchingData/FetchCategories'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../../Helper/Loading/Loading'

const ExploreMenu = () => {
  const {data:menu_list =[], loading, error} = useQuery({
    queryKey: ['categories'],
    queryFn: fetchingCategories
  });
  
  const feltredcategoeis=menu_list?.filter(item=>item.name.toLowerCase() !== "extra" && item.name.toLowerCase() !== "jus")
  if (loading) return <Loading/>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  return (
    <div className={styles['explore-menu']}>
        <h1 className={styles.title}>اكتشف أقسامنا</h1>
        <div className={styles["menu-list"]}>
          {feltredcategoeis?.map((item, index) => (
            <Link 
              to={`/category/${item.name}`} 
              key={index}
              className={styles.menuItem}
            > 
              <div className={styles.itemContainer}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.image}`} 
                    alt={item.name}
                    className={styles.menuImage}
                  />
                </div>
                <p className={styles.menuName}>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default ExploreMenu