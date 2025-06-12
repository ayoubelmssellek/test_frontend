import React from 'react'
import  Navbar  from '../../components/navbar/Navbar'
// import FoodDesplay from '../../components/FoodDesplay/FoodDesplay'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import Footer from '../../components/Footer/Footer'
 import MenuComponnent from '../../components/Menu/Menu'
import SearchOverlay from '../../components/SearchEngines/SearchEngines'
 const Menu = () => {
  return (
    <div style={{marginTop:'50px'}}>
      <Navbar/>
      <SearchOverlay/>
      <ExploreMenu/>
      <MenuComponnent/>
      <Footer/>
    </div>
  )
}
export default Menu

