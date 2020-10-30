import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye, faTimes, faClosedCaptioning } from "@fortawesome/free-solid-svg-icons";
import ViewTradeRequestModal from "./modals/ViewTradeRequestModal";
import {getTradeRequestById} from "./apiTrade"
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

class TradeRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          redirectToHome: faClosedCaptioning,
          show: false,
          trade:{}
        };
      }
    
      componentDidUpdate(prevProps){
        if (this.props.id !== prevProps.id) {
         this.setState({id: this.props.id});
       }
     }

     showModal = e => {
  
      getTradeRequestById(e.currentTarget.id).then(data=> {
        console.log(data);
        this.setState({ show: !this.state.show, trade: data});
       });
      
    };
      
    render() {
        return (
         
         <div className="card" >  
         
{/*            
         <ViewTradeRequestModal
                  tradeData={this.state.trade}
                  onClose={this.showModal}
                  show={this.state.show}
            
                ></ViewTradeRequestModal> */}
            <div className="card-header">Waiting for Response</div>
            
        <div className="card-body">
        {this.props.trades.map(trade=>{
          console.log(trade);
                return (
                  <div key={trade._id}>
    <Button color="primary" id={"toggle".concat(trade._id)} className="col-12" style={{ marginBottom: '1rem' }}>
       <img className="float-left rounded-circle" src="https://picsum.photos/100" alt="displaypic"/>
               
                
     <div className="float-left pt-3 pl-3"><a className="font-weight-bold h5 text-white" href={'user/' + trade.tradeReceiver._id}>{trade.tradeReceiver.name} </a>
                    <br/>
                    <small>{trade.tradeWants.length} games</small></div>
<div className="float-right text-white">{new Date(trade.createdDate).toISOString().slice(0,10)}</div>

    </Button>
    <UncontrolledCollapse toggler={"#toggle".concat(trade._id)}>
      <Card>
        <CardBody>
          <div className="row">
          <div className='col'><h4>Wants:</h4>
          {trade.tradeWants.map(game=> <p key={game._id}>{game.name}</p>)}
          </div>
          <div className='col'><h4>Offer:</h4>
          {trade.tradeOffer.map(game=> <p key={game._id}>{game.name}</p>)}
          </div>
          
          </div>
          <div className="row">
            <div className="col">
              <h4>Notes:</h4>
            <p>{trade.notes}</p>
            </div>
            
          </div>
          <button type="button" onClick={()=> this.props.onClickDelete(trade._id)} className="btn btn-danger float-right"><FontAwesomeIcon icon={faTimes} /> Delete</button>
        </CardBody> 
      </Card>
     
    </UncontrolledCollapse>
  </div>

     
               
                
          

           
          );        
                })}
            
            <div className="card-footer text-center"><a href="/" className="btn btn-primary">Show More</a></div>
        </div>
        </div> )
                
                  
    }
  }
  export default TradeRequest;