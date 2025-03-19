import React, { useState } from "react";
import './Css/Dash.css';


export default function DashFooter() {

    const currentYear = new Date().getFullYear(); // Get the current year

    return (
        <div className="Dashfooter">
                <p>© {currentYear} CMVP</p>
                {/* <p>Powered by Proliance LTD</p> */}
        </div>
    )

}