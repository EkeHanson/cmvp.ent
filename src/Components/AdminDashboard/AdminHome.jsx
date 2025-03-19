import React, { useState, useEffect } from "react";
import './Css/Dash.css';

import SubscriptionTable from './SubscriptionTable';

import SelectNavigationIcons from './SelectNavigationIcons';

import SearchIcon from './Img/searchicon.svg';

export default function AdminHome() {
    
    useEffect(() => {
        if (!sessionStorage.getItem("hasReloaded")) {
          sessionStorage.setItem("hasReloaded", "true");
          window.location.reload();
        }
      }, []);

    return(
        <div className="DDD-Seco">
            <div className="klka-Seco">
                 <div className="Dash-Intro">
                    <h2>Hi 👋 Admin</h2>
                    <p>Welcome to CMVP admin dashboard</p>
                </div>

                <SelectNavigationIcons />

                </div>

                {/* <div className="Search_Sec admin-Search_Sec">
                    <input type="text" placeholder="Search"></input>
                    <button className="mobile_Search_toggler" ><img src={SearchIcon} alt="Search Icon"></img></button>
                </div> */}

                <SubscriptionTable />
        </div>
    )
}