import React from 'react'
import FooterComponent from '../components/FooterComponent'
import { Outlet } from 'react-router-dom'
import Header from './H'

function Layout() {
  return (
    <>
        <Header/>
          <Outlet/>
        <FooterComponent/>
    </>
  )
}

export default Layout