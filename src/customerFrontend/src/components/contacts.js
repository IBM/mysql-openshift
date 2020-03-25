import React from 'react'
import app from '../App'
import Details from './details'



const Contacts = ({ contacts, getCustomer }) => {


    
function handleClick(e) {
        getCustomer(e);  
        }
    
  return (

    <div class="col-md-6">
		    <div class="card">
		         <div class="card-header">
		            <h1>Customers List</h1>
                    <br></br>
                    <br></br>
		        </div>

                {contacts.map((contact) => (
		            <div class="gaadiex-list">
		              <div class="gaadiex-list-item border-b-1">
		                  <i class="fa fa-user"></i>
                      <div class="gaadiex-list-item-text">
                        <h3> {contact.customerName}</h3>
                        <h4>{"ID: " +contact.id}</h4>
                        <button type="button" class="btn btn-info" onClick={handleClick} id={contact.id}>Details</button>
                      </div>
                    </div>
                    <br></br>
                    <hr></hr>
                

                    </div>
                    		          
                    ))}


                    

		    </div>
		</div>
  )
};

export default Contacts