import React, { useEffect, useState } from 'react'
import  Navbar  from '../../components/navbar/Navbar';
import DisktopFoodSlider from '../../components/header/DisktopFoodSlider';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import Footer from '../../components/Footer/Footer';
import FoodDisplay from '../../components/FoodDesplay/FoodDesplay';
import Reviews from '../../components/Reviews/Reviews';
import LocationSection from '../../components/OurLocation/useUserLocation';
import MobileFoodSlider from '../../components/header/MobileFoodSlider/MobileFoodSlider';
import PopularDishes from '../../components/PopularDishes/PopularDishes';
import InstallAppPrompt from '../../../Helper/InstallAppPrompt/AddToHomePrompt';

const Home = () => { 
 const [isMobile,setIsMobile]=useState(window.innerWidth<=576)
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
    <div >
      <Navbar/> 
      {
        isMobile ? <InstallAppPrompt/> : null
      }

      {
        isMobile ? <MobileFoodSlider/> : <DisktopFoodSlider/>
      }
       <ExploreMenu/>
       <FoodDisplay/>
       <PopularDishes/>
       <LocationSection/>
       <Reviews/>
      <Footer/>
    </div>
  )
}

export default Home
