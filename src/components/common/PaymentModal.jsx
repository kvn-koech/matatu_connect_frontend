import React, { useState, useContext } from 'react';
// NOTE: If you are still using the Test App.jsx, import BookingContext from '../../App';
// Otherwise, use the standard path below:
import { BookingContext } from '../../context/BookingContext';
import Button from './Button';
import Input from './Input';

const PaymentModal = () => {
    // Access global state
    const { currentBooking, processPayment, loading } = useContext(BookingContext);
    
    // Local state for form fields
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    // Safety check: Don't render if no booking exists
    if (!currentBooking) return null;

    const handlePay = (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (!phone) {
            setError('Phone number is required');
            return;
        }
        // Check for Kenyan phone format (Simple Regex)
        // Accepts: 0722..., 0110..., 2547...
        const phoneRegex = /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(?:4[0-1]))[0-9]{6})$/;
        
        // Note: For this demo, we'll be lenient, but in production use strict regex
        if (phone.length < 10) {
            setError('Please enter a valid M-Pesa number');
            return;
        }

        // Trigger the payment function from Context
        processPayment(phone);
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            
            {/* Header Section */}
            <div className="bg-gray-800 p-6 border-b border-gray-700">
                <h3 className="text-xl text-white font-bold">Confirm Payment</h3>
                <p className="text-gray-400 text-sm mt-1">
                    Complete your booking for <span className="text-green-400 font-bold">{currentBooking.seat}</span>
                </p>
            </div>

            {/* Body Section */}
            <div className="p-6 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-black/40 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p>
                        <p className="text-2xl text-white font-bold tracking-tight">
                            KES {currentBooking.amount.toLocaleString()}
                        </p>
                    </div>
                    <div className="h-10 w-10 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/30">
                        {/* Simple Wallet Icon */}
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handlePay} className="space-y-5">
                    <Input 
                        label="M-Pesa Number"
                        placeholder="e.g. 0722 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={error}
                        type="tel"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="primary"
                            size="md"
                            isLoading={loading}
                        >
                            Pay with M-Pesa
                        </Button>
                        
                        {/* Helper Text */}
                        <p className="text-center text-gray-500 text-xs mt-3">
                            An STK Push will be sent to your phone.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;