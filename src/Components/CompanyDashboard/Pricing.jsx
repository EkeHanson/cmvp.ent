import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './Css/Dash.css';
import config from "../../config.jsx";
import FlashMessage from "../FlashMessage/FlashMessage.jsx";
import Invoice from "../../assets/Invoice.jsx";

export default function Pricing() {
    const [flash, setFlash] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [filterRange, setFilterRange] = useState(""); // Default: All subscriptions

    const invoiceRef = useRef();

    const showMessage = (message, type) => {
        setFlash({ message, type });
    };

    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
            const authToken = sessionStorage.getItem("authToken");
            const authUserId = sessionStorage.getItem("authUserId");

            if (authToken && authUserId) {
                try {
                    const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/user-multiple-subscriptions/${authUserId}/`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${authToken}` },
                    });

                    if (!response.ok) {
                        if (response.status === 404) {
                            showMessage("You are not subscribed to any plan. Please subscribe to access the features.", "failure");
                            throw new Error("You are not subscribed to any plan.");
                        } else {
                            throw new Error("Failed to fetch subscription details");
                        }
                    }

                    const data = await response.json();
                    setSubscriptions(Array.isArray(data) ? data : [data]); // Ensure it's always an array
                    //localStorage.setItem("subscriptionDetails", JSON.stringify(data)); 
                    // console.log("data")
                    // console.log(data)
                    // console.log("data")
                } catch (error) {
                    console.error("Error fetching subscription details:", error);
                    setErrorMessage(error.message);
                }
            }
        };

        fetchSubscriptionDetails();
    }, []);

    // Handle Invoice Download
    const handleDownloadInvoice = async (sub) => {
        setInvoiceData({
            soldTo: { name: sub.subscribing_organization_name, address: sub.subscribed_organization_address, country: "Nigeria" },
            billTo: { name: sub.subscribing_organization_name, address: sub.subscribed_organization_address, country: "Nigeria" },

            invoiceSummary: {
                billingProfile: sub.subscribed_organization_address,
                invoiceNumber: `INV-${sub.id}`,
                invoiceDate: new Date(sub.start_date).toLocaleDateString(),
                totalAmount: `NGN ${(Number(sub.subscribed_amount) * 1.075).toFixed(2)}`,
            },
            billingPeriod: `${sub.start_date} - ${sub.end_date}`,
            billingDescription: "Subscription billing invoice for purchased plan.",
            billingSummary: {
                charges: Number(sub.subscribed_amount),
                credits: 0.00,
                subtotal: Number(sub.subscribed_amount),
                vat: (Number(sub.subscribed_amount) * 0.075).toFixed(2),
                total: `NGN ${(Number(sub.subscribed_amount) * 1.075).toFixed(2)}`,
            }
        });

        // Wait for invoice data to update
        setTimeout(() => {
            if (invoiceRef.current) {
                html2canvas(invoiceRef.current).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF("p", "mm", "a4");
                    const imgWidth = 210; // A4 width in mm
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                    pdf.save(`${sub.start_date} - ${sub.end_date}  ${sub.subscribing_organization_name} - CMVP subscription Invoice.pdf`);
                });
            }
        }, 500);
    };

    // Filter subscriptions based on the selected time range
    const filteredSubscriptions = subscriptions.filter((sub) => {
        if (!sub.start_date) return false;
        
        // If filterRange is an empty string, show all subscriptions
        if (filterRange === "") return true;
        
        const subDate = new Date(sub.start_date);
        const currentDate = new Date();
        const monthsAgo = new Date();
        monthsAgo.setMonth(currentDate.getMonth() - parseInt(filterRange, 10));

        return subDate >= monthsAgo;
    });

    return (
        <div className="Pricing_Sec">
            <div className="Pricing_top">
                {flash && (
                    <FlashMessage message={flash.message} type={flash.type} onClose={() => setFlash(null)} />
                )}
                <h2>Your Subscriptions and Billings</h2>
            </div>

            <div className="Table_Sec">
                <div className="Cart_select_Sec kkja-de">
                    <select value={filterRange} onChange={(e) => setFilterRange(e.target.value)}>
                        <option value="">All</option>                 
                        <option value="3">Last 3 months</option>                 
                        <option value="6">Last 6 months</option>
                        <option value="12">Last 12 months</option>
                    </select>
                </div>

                <table className="Upload_Table">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Date of Subscription</th>
                            <th>Subscription End Date</th>
                            <th>Plan</th>
                            <th>Duration</th>
                            <th>Amount</th>
                            <th>Vat (7.5%)</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubscriptions.map((sub, index) => (
                            <tr key={sub.id}>
                                <td>{index + 1}</td>
                                <td>{sub.start_date}</td>
                                <td>{sub.end_date}</td>
                                <td>{sub.subscriptionPlan_name}</td>
                                <td>{sub.subscribed_duration} {sub.subscribed_duration > 1 ? "months" : "month"}</td>
                                <td>{sub.subscribed_amount}</td>
                                <td>{(sub.subscribed_amount * 0.075).toFixed(2)}</td>
                                <td>{(Number(sub.subscribed_amount) * 1.075).toFixed(2)}</td>
                                <td className={sub.is_active ? "active-BGD" : "expired-BGD"}>{sub.is_active ? "Active" : "Inactive"}</td>
                                <td>
                                    <button className="down_Inv_LAbel" onClick={() => handleDownloadInvoice(sub)}>
                                        Download Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 

            {/* Hidden Invoice Component for PDF Generation */}
            <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                <div ref={invoiceRef}>
                    {invoiceData && <Invoice invoiceData={invoiceData} />}
                </div>
            </div>
        </div>
    );
}
