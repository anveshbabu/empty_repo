import React from "react";
import './auth.scss'
// import logo from '../../assets/images/logo.png'
import {Outlet } from "react-router-dom";
export class AuthLayout extends React.Component {
  render() {
    return (
      <>
        <div className="row">
          <div className="col-md-6 auth-layout d-flex align-items-center text-center">
            {/* <img src={logo} alt="Logo" /> */}
            <img src={require('../../assets/images/logo_white.png')} alt="My 360" title="My 360"/> 
            {/* <h4>My 360</h4> */}
          </div>
          {/* <div className="col-md-6 d-flex align-items-center"> */}
          <div className="col-md-6 align-self-center">
          <Outlet />
          </div>
        </div>
      </>
    );
  }
}