import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";

const RequestSent: React.FC = () => {
    const [redirect, setRedirect] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const timeout = setTimeout(() => setRedirect("/trades"), 2000);
        return () => clearTimeout(timeout);
    }, []);

    if (redirect) {
        return <Navigate to={redirect} />
    }
    
    return (
        <div className="container-fluid ">
            <h1 className="justify-content-center">Your Request has been Sent</h1>
            {(location.state as any)?.tradeId !== undefined ?
            <div>
                Reference: {(location.state as any).tradeId}
            </div> : null
            }
            
            <div>
                <span>Look forward to your response! :) </span>
            </div>
        </div>
    );
};

export default RequestSent;