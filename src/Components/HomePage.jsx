import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Typewriter from 'typewriter-effect';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HeroBanner from '../assets/Img/hero-banner.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import OHIMG from '../assets/Img/Oh-img.png';

import GGIMga from '../assets/Img/GGIMga.png';

import CheckCmvp from '../assets/Img/check-cmvp.svg';

function HomePage() {
    
    useEffect(() => {
        if (!sessionStorage.getItem("hasReloaded")) {
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
        }
    }, []);

    const [isVideoPopupVisible, setVideoPopupVisible] = useState(false);
    const videoRef = useRef(null);
  
    const handlePlayVideo = () => {
      setVideoPopupVisible(true);
      // Ensure the video plays when the popup becomes visible
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 0);
    };
  
    const handleCloseVideo = () => {
      setVideoPopupVisible(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset video to the beginning
      }
    };
  

  return (
   <div className='home-page'>
    <div className='hero-sec'>
        <div className='site-container'>
        <div className='hero-main'>
            <div className='hero-dlt'>
                <div>
                <h1 className='big-text'>Online Record and Certificate Management System
                </h1>
                <p>Experience secure and efficient digital certificate verification and management with our advanced and user-friendly online portal.</p>

                <div className='hero-btns'>
                    <Link to="/signup" className='HH_get_Std'>Get Started</Link>
                    <Link to="/how-it-works" className='HH_How_Tw'>How it works</Link>
                </div>
            </div>
            </div>
            <div className='hero-banner' data-aos="fade-up">
                <img src={HeroBanner}></img>
            </div>
            </div>
        </div>
    </div>
    <div className="Nwass-sec">
        <div className='site-container'>


        <div className="Nwass-Grid">

        <div className="Nwass_Cont" >
            <div>
            <h1 className='big-text'>Manage and create unique <span>certificate verification</span> link for:</h1>
            <div className="Nwass_Cont_btn">
                <button data-aos="fade-up" data-aos-delay="100">Inspection Certificates</button>
                <button data-aos="fade-up" data-aos-delay="200">Calibration Certificates</button>
                <button data-aos="fade-up" data-aos-delay="300">Training Certificates</button>
                <button data-aos="fade-up" data-aos-delay="400">Issued Licences</button>
                <button data-aos="fade-up" data-aos-delay="500">Results, etc.</button>
            </div>
            </div>
        </div>
        <div className="Nwass_Cont">
            <img src={GGIMga} data-aos="fade-up"></img>
        </div>
        </div>


        </div>

        <div className='Gena_SGGar'>

            <div className='site-container'>
                <div className='hag_Top' data-aos="fade-up">
                <div className='hag_Top_1'>
                    <img src={CheckCmvp}></img>
                </div>
                <div className='hag_Top_2'>
                    <h2 className='big-text'>Meet your records <span>management compliance</span> needs with <span>CMVP</span></h2>
                    <Link to="/about-cmvp">About CMVP</Link>
                </div>
                </div>
            </div>

    <div className='Bidd-secs'>
        <div className='site-container'>
             <div className='Bidd-Main'>
                <div className='Bidd-Dlt'>
                    <h2 className='big-text'>Manage your certificate records with ease</h2>
                    <p>Our system ensures proper management, traceability and verification of your certificate records.</p>
                    <ul>
                        <li>
                            <h3 className='big-text'>24/7</h3>
                            <h4>Support system</h4>
                        </li>
                        <li>
                            <h3 className='big-text'>100%</h3>
                            <h4>Efficient</h4>
                        </li>
                    </ul>
                </div>
                <div className='Bidd-banner' data-aos="fade-up">
                    <img src={OHIMG}></img>
                </div>
             </div>
        </div>
    </div>

    <div className='ggatsh-sec' data-aos="fade-up">
        <div className='site-container'>
        <div className='ggatsh-main'>
            <h2 className='big-text'>Say goodbye to forgery of your brand certificates</h2>
            <p>CMVP is developed to safeguard your records and help you build a trusted brand and reputation.</p>
            <div className='hero-btns'>
                    <Link to="/signup" className='HH_get_Std'>Get Started</Link>
                    <Link to="/how-it-works" className='HH_How_Tw'>How it works</Link>
                </div>
        </div>
        </div>
    </div>
    </div>

    </div>

   </div>
  )
}

export default HomePage
