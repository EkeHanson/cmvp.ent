import React from 'react';
import Video from '../assets/Img/video.mp4';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import LinkIcon from '@mui/icons-material/Link'; 
import CategoryIcon from '@mui/icons-material/Category'; 
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import SettingsIcon from '@mui/icons-material/Settings'; 

function HowItWorks() {
  return (
    <div className='How_Page'>
          <div className="TThero-Blam">
                <div className="site-container">
                    <h2 className="big-text">How CMVP Works</h2>
                    <p>The video below explains how our system functions and provides guidance on navigating it effectively.</p>
                    </div>
                </div>
                
   <div className='site-container'>
    <div className='How_Seccoo'>

    <div className='How_Seccoo_Vid'>
        {/* <video src={Video} controls></video> */}
    </div>

    </div>


    <div className="Plan_SUmmry">
                    <ul>
                        <li>
                            <p>Generate unique certificate verification URL link</p>
                        </li>
                        <li>
                            <p>Create multiple certificate categories</p>
                        </li>
                        <li>
                            <p>Upload certificate details for verification</p>
                        </li>
                        <li>
                            <p>Customize your verification page</p>
                        </li>
                    </ul>
                </div>


   </div>

   </div>
  )
}

export default HowItWorks
