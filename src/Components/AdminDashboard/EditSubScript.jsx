import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Css/Dash.css';
import config from "../../config";

export default function EditSubScript() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price_per_month: '',
        storage: '',
        num_certificate_categories: '',
        num_daily_certificate_upload: '',
        access_deleted_certificates_files: '',
        // maximum_login_users: '',
        twentyFourSevenSupport: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const planData = {
            id: queryParams.get('id')?.trim(),
            name: queryParams.get('name')?.trim(),
            price_per_month: queryParams.get('price_per_month')?.trim(),
            storage: queryParams.get('storage')?.trim(),
            num_certificate_categories: queryParams.get('num_certificate_categories')?.trim(),
            num_daily_certificate_upload: queryParams.get('num_daily_certificate_upload')?.trim(),
            access_deleted_certificates_files: queryParams.get('access_deleted_certificates_files')?.trim(),
            //maximum_login_users: queryParams.get('maximum_login_users')?.trim(),
            twentyFourSevenSupport: queryParams.get('twentyFourSevenSupport')?.trim()
        };




        setFormData({
            id: planData.id || '',
            name: planData.name || '',
            price_per_month: planData.price_per_month || '',
            storage: planData.storage || '',
            num_certificate_categories: planData.num_certificate_categories || '',
            num_daily_certificate_upload: planData.num_daily_certificate_upload || '',
            access_deleted_certificates_files: planData.access_deleted_certificates_files || '',
           // maximum_login_users: planData.maximum_login_users || '',
            twentyFourSevenSupport: planData.twentyFourSevenSupport || ''
        });
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
    
        const payload = {
            name: formData.name,
            price_per_month: formData.price_per_month,
            features: {
                storage: formData.storage,
                num_certificate_categories: formData.num_certificate_categories,
                num_daily_certificate_upload: formData.num_daily_certificate_upload,
                access_deleted_certificates_files: formData.access_deleted_certificates_files,
                //maximum_login_users: formData.maximum_login_users,
                twentyFourSevenSupport: formData.twentyFourSevenSupport
            }
        };

        // console.log('Submitted payload:', payload);
        
    
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/subscription-plans/${formData.id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
                }
            );
    
            console.log('API response status:', response.status);
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse);
                throw new Error(`Failed to update subscription plan: ${response.statusText}`);
            }
    
            const updatedPlan = await response.json();
            console.log('Successfully updated plan:', updatedPlan);
            alert('Subscription plan updated successfully!');
        } catch (error) {
            console.error('Error updating subscription plan:', error);
            alert('Failed to update subscription plan. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };
    

    return (
        <div className="DDD-Seco hhga-uua">
            <div className="SSS-Nbahs">
                <div className="Dash-Intro">
                    <h2>Edit Subscription Plan</h2>
                </div>
                <form className="add-SUp-Form" onSubmit={handleSubmit}>
                    <div className="Supt-Input">
                        <label>What's the plan name?</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter plan name"
                            required
                        />
                    </div>

                    <div className="Supt-Input">
                        <label>Select currency</label>
                        <select>
                            <option>Naira (₦)</option>
                            <option>Dollar ($)</option>
                        </select>
                    </div>
                    
                    <div className="Supt-Input">
                        <label>What's the amount per month?</label>
                        <input
                            type="number"
                            name="price_per_month"
                            value={formData.price_per_month}
                            onChange={handleChange}
                            placeholder="Enter amount per month"
                            required
                        />
                    </div>
                    <div className="Supt-Input">
                        <label>Access to portal</label>
                        <select
                            name="access_deleted_certificates_files"
                            value={formData.access_deleted_certificates_files}
                            onChange={handleChange}
                        >
                            <option value="">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>How many certificate categories can be added?</label>
                        <select
                            name="num_certificate_categories"
                            value={formData.num_certificate_categories}
                            onChange={handleChange}
                        >
                            <option value="">--Select--</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="UNLIMITED">UNLIMITED</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>How many certificates can be uploaded daily?</label>
                        <select
                            name="num_daily_certificate_upload"
                            value={formData.num_daily_certificate_upload}
                            onChange={handleChange}
                        >
                            <option value="">--Select--</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="UNLIMITED">UNLIMITED</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>Can files like PDF, JPEG, PNG be uploaded?</label>
                        <select
                            name="storage"
                            value={formData.storage}
                            onChange={handleChange}
                        >
                            <option value="">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>Access to deleted certificates and files</label>
                        <select
                            name="access_deleted_certificates_files"
                            value={formData.access_deleted_certificates_files}
                            onChange={handleChange}
                        >
                            <option value="">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>24/7 support</label>
                        <select
                            name="twentyFourSevenSupport"
                            value={formData.twentyFourSevenSupport}
                            onChange={handleChange}
                        >
                            <option value="">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                    <button type="submit" disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Save changes'}
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
