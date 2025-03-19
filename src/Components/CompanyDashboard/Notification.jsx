import React, { useState, useEffect } from "react";
import './Css/Dash.css';
import NoticeImg from './Img/notice_Menu.svg';

export default function Notification() {
    const [active, setActive] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleActive = () => {
        if (isMobile) {
            setActive(!active);
        }
    };
    

    return (
        <div className="Notification_Page">
            <div className="Notification_Page_header">
                <div className="Large-container">
                    <button className="Toggle_Noti_BOx" onClick={toggleActive}>
                        <img src={NoticeImg} alt="Notification Icon" /> Notification
                    </button>
                    <span>200</span>
                </div>
            </div>
            <div className="Notification_Page_main">
                <div className="Large-container"> 
                    <div className="Notification_Grid">
                        <div className={active ? "Active_Noti_BoxS" : "Noti_BoxS"}>
                            
                            <div className="Noti_box Noti_box_active" onClick={toggleActive}>
                                <div className="Noti_box_top">
                                    <div className="Noti_box_top_1">
                                        <span>c</span>
                                    </div>
                                    <div className="Noti_box_top_2">
                                        <h3>CMVP (Admin 1) <span>8:20 AM</span></h3>
                                        <h4>Welcome Notice to our platform</h4>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>
                                </div>
                            </div> {/* Noti_box */}

                            <div className="Noti_box" onClick={toggleActive}>
                                <div className="Noti_box_top">
                                    <div className="Noti_box_top_1">
                                        <span>p</span>
                                    </div>
                                    <div className="Noti_box_top_2">
                                        <h3>Prince (Admin 2) <span>Jun 20</span></h3>
                                        <h4>Your subscription plan has been approved</h4>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>
                                </div>
                            </div> {/* Noti_box */}

                            <div className="Noti_box" onClick={toggleActive}>
                                <div className="Noti_box_top">
                                    <div className="Noti_box_top_1">
                                        <span>D</span>
                                    </div>
                                    <div className="Noti_box_top_2">
                                        <h3>David (Admin 3) <span>May 01</span></h3>
                                        <h4>Hello User we are updating</h4>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>
                                </div>
                            </div> {/* Noti_box */}
                        </div>
                        <div className="message_box_Sec">
                            <div className="message_box_Top">
                                <h3><span>Sender:</span> CMVP (Admin)</h3>
                                <h4><span>Subject:</span> Welcome Notice to our platform</h4>
                            </div>
                            <div className="main_Message">
                                <h3><span>8:20 AM</span></h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                            <div className="Message_foot">
                                <h3>Note:</h3>
                                <p>This is a no reply message go to our <a href="#">help and support</a> page if you need any help from us.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
