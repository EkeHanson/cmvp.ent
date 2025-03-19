import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './Css/Dash.css';

import SubscriptionTable from './SubscriptionTable';


export default function Notification() {
    return(
        <div className="DDD-Seco">
                 <div className="Dash-Intro">
                    <h2>Notification</h2>
                </div>


                <div className="notif-main">

                <div className="notif-box">
                    <div className="instruc-profl-grid">
                    <div className="profl-dlts">
                        <h6>Subscriptions Notification</h6>
                        <span>10 minutes ago</span>
                    </div>
                    <div className="profl-dlts">
                        <p>Ndubuisi Prince Godson</p>
                    </div>
                    </div>
                    <div className="not-kja">
                    <p>Ndubuisi Prince Godson have successfully subscribed to pro plan for a duration of 3 months.</p>
                    </div>
                </div>


                <div className="notif-box">
                    <div className="instruc-profl-grid">
                    <div className="profl-dlts">
                        <h6>Subscriptions Notification</h6>
                        <span>10 minutes ago</span>
                    </div>
                    <div className="profl-dlts">
                        <p>Ndubuisi Prince Godson</p>
                    </div>
                    </div>
                    <div className="not-kja">
                    <p>Ndubuisi Prince Godson have successfully subscribed to pro plan for a duration of 3 months.</p>
                    </div>
                </div>

</div>
                

      
        </div>
    )
}