
import React, { useEffect, useState } from 'react'
import Navbar  from '../../components/navbar/Navbar'
import ShopingCart from '../../components/ShoupingCart/ShopingCart'
import Footer from '../../components/Footer/Footer'

const Shopingcartpage = () => {
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
    <div>
      
       <Navbar/>      
        <ShopingCart/>
     {/* <Footer/>  */}
    </div>
  )
}

export default Shopingcartpage
