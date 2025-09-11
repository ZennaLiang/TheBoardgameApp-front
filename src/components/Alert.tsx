import React from "react";
import { Link } from "react-router-dom";

interface AlertProps {
  type: string;
  message: string;
  visible: boolean;
  redirectTo?: string;
  redirectTxt?: string;
  className?: string;
}

/**********************************************************************
This component have the following props for bootstrap Alert:

type={alertStatus} --> primary, danger, success, warning, etc
message={alertMsg} --> message for alert
visible={alertVisible} --> whether to display the msg (true/false)
redirectTo={alertRedirect} --> optional - link to redirect to "/pageLink"
redirectTxt={alertRedirectTxt} --> optional - link txt 

*************************************************************************
Can use hook or setState: 

const [alertStatus, setAlertStatus] = useState("");
const [alertMsg, setAlertMsg] = useState("");
const [alertVisible, setAlertVible] = useState(false);
const [alertRedirect, setAlertRedirect] = useState("");
const [alertRedirectTxt, setAlertRedirectTxt] = useState("");
**********************************************************************/
const Alert: React.FC<AlertProps> = ({ 
  type, 
  message, 
  visible, 
  redirectTo, 
  redirectTxt, 
  className 
}) => {
  if (visible === true) {
    return (
      <div className="row stickyAlert">
        <div className="container-fluid">
          <div
            className={
              "col-12 alert alert-" +
              type +
              (className ? " " + className : "")
            }
            role="alert"
          >
            {message}
            {redirectTo !== undefined &&
              redirectTxt !== undefined && (
                <Link to={redirectTo}>
                  {redirectTxt}.
                </Link>
              )}
          
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Alert;
