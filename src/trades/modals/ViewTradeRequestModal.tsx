import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate } from "react-router-dom";

interface ViewTradeRequestModalProps {
  show: boolean;
  onClose: () => void;
  tradeData: any;
}

const ViewTradeRequestModal: React.FC<ViewTradeRequestModalProps> = ({
  show,
  onClose,
  tradeData
}) => {
  const [notes, setNotes] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);
  const [tradeId, setTradeId] = useState<string | null>(null);

  useEffect(() => {
    //Required to use modal or else it has errors
    ReactModal.setAppElement('body');
  }, []);

  const handleClose = () => {
    onClose && onClose();
  };

  console.log(tradeData);
  
  const style = {
    content: {
      borderRadius: '4px',
      bottom: '100px',
      left: '15%',
      position: 'absolute' as const,
      right: '100px',
      top: '100px',
      width: '80%',
      height: '80%'
    }
  };

  if (redirect) {
    return (
      <Navigate 
        to={redirect}
        state={{ tradeId }}
      />
    );
  }

  return (
    <ReactModal isOpen={show} style={style} onRequestClose={handleClose}>
      <div className="container-fluid">
        <div>
          <h1>
            Confirm Request
            <button 
              type="button" 
              className="close float-right" 
              onClick={handleClose} 
              data-dismiss="modal" 
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h1>
        </div>
        <div className="row">
          <div className="col-12">
            {/* <h3>{tradeData.tradeSender?.name}</h3> */}
            {/* <ul>
              {tradeData.tradeOffer?.map(game => (
                <li key={game._id}>{game.name}</li>
              ))}
            </ul>
            <ul>
              {tradeData.tradeWants?.map(game => (
                <li key={game._id}>{game.name}</li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default ViewTradeRequestModal;
