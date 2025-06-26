import React, { useEffect, useState } from 'react'
import ProductPage from '../../components/ProductPage/ProductPage'
import ProductPageDiskTopVersion from '../../components/ProductPageDiskTopVersion/ProductPageDiskTopVersion'
import Navbar from '../../components/navbar/Navbar'
 const SingleProPage = () => {
    const [IsMobile,setIsMobile]=useState(window.innerWidth<=576)
    useEffect(()=>{
  const handelResize=()=>{
    setIsMobile(window.innerWidth<=576)
  }
  window.addEventListener('resize',handelResize)

    
    return ()=>{
      window.removeEventListener('resize',handelResize)

    }
    },[])
  return (
    <>
   
     {
        IsMobile ?
        <>
         <ProductPage/> 
         </>
         :
      <>
         <Navbar/>
         < ProductPageDiskTopVersion/> 

      </>
     }
    </>
  )
}
export default SingleProPage

