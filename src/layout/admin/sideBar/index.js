import React, { Fragment, useEffect } from "react";
import './sidebar.scss'
import { MENU } from '../../../services/constants';
import { NavLink } from 'react-router-dom';
import { CURRENT_USER } from '../../../services/constants'
import { getStorage } from '../../../services/helperFunctions'
export const Sidebar = () => {

const userData =JSON.parse(getStorage(CURRENT_USER))



  const handleSubmenuToggle = (id, subMenuIconId) => {
    let isSubMenu = document.getElementById(id);
    let subMenuIcon = document.getElementById(subMenuIconId);
    if (isSubMenu.style.display === "none") {
      isSubMenu.style.display = "block";
      subMenuIcon.style.transform = `rotate(180deg)`
    } else {
      isSubMenu.style.display = "none";
      subMenuIcon.style.transform = ''
    }
  }

  return (
    // <!-- /#sidebar-wrapper -->
    <div className="border-right shadow " id="sidebar-wrapper">

      <ul className="list-group main-menu list-group-flush">
        
        {MENU.map(({ menuItems = [], title = '' }, m) =>
       
      
          <Fragment key={m}>
            {title && <div className="sidebar-heading">{title}</div>}
            {menuItems.map(({ icon, text, url = '/', subMenu = [],userType }, i) =>
             userType.includes(  userData?.user_type) &&
              <li className="list-group-item list-group-item-action text-center  border-0" key={i}>
                {subMenu.length === 0 ? <NavLink to={url}> <i className={`${icon} me-2`} title={text} />  </NavLink> : <NavLink to={url} onClick={() => handleSubmenuToggle(`isSubMenu${i}`, `subMenuDropIcon${i}`)}> <i className={`${icon} me-2`} title={text} />   <i id={`subMenuDropIcon${i}`} className={`fa-solid float-end fa-angle-down sub-menuDropIcon`}></i></NavLink>}
                {subMenu.length > 0 && <ul className="list-group list-group-flush my-3 ms-2 sub-menu" style={{ display: "none" }} id={`isSubMenu${i}`}>
                  {subMenu?.map(({ icon, text, subMenu = [] }, s) =>
                    <li href="#" className="list-group-item border-0 list-group-item-action bg-transparent" key={s}>
                      <NavLink to={url} > {icon && <i className={icon} title={text} />}</NavLink>
                    </li>
                  )}
                </ul>}

              </li>
            )}

          </Fragment>
        )}

      </ul>
    </div>

  )


}