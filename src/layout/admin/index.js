import React, { Fragment, useEffect, useState } from "react";
import './primary.scss';
import { Header } from './header'
import { Sidebar } from './sideBar'
import { CURRENT_USER } from '../../services/constants'
import { getStorage,isEmpty } from '../../services/helperFunctions'
import {Outlet } from "react-router-dom";
export const Adminlayout = ({ children }) => {

    const [isAuth,setIsAuth]=useState(false);

    useEffect(()=>{
        if(!!getStorage(CURRENT_USER)){
            let isAuth = !isEmpty(JSON.parse(getStorage(CURRENT_USER)));
            setIsAuth(isAuth)
        }

    },[])




    return (
        <Fragment>
              {isAuth && <Header />}
            
            <div className="d-flex" id="wrapper">
                {isAuth && <Sidebar />}
                
                <div id="page-content-wrapper">

                    <section className="container-fluid mt-4">
                        <Outlet />

                    </section>

                </div>
            </div>
        </Fragment>

    )


}