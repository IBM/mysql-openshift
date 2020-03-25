import React from 'react'
import app from '../App'
import './contacts'



const Details = ({ details }) => {
    
  return (
    
<div>
<header>
        <a href="">Home</a>
    </header>
<div class="card-header">
		            <h1>Customer Details</h1>
                    <br></br>
                    <hr></hr>
</div>
<div class="gaadiex-list-item"><img class="gaadiex-list-item-img" src="http://www.free-icons-download.net/images/commercial-male-user-icon-32765.png" alt="List user"></img>
<div class="gaadiex-list-item-text">
<dl class="row">
        <dt class="col-sm-2">
            Customer ID
        </dt>
        <dd class="col-sm-10">
            {details.id}
        </dd>
        <dt class="col-sm-2">
            Customer Name
        </dt>
        <dd class="col-sm-10">
            {details.customerName}
        </dd>
        <dt class="col-sm-2">
            Description
        </dt>
        <dd class="col-sm-10">
            {details.description}
        </dd>
        <dt class="col-sm-2">
            Effective Date
        </dt>
        <dd class="col-sm-10">
            {details.effectiveDate}
        </dd>
        <dt class="col-sm-2">
            Status
        </dt>
        <dd class="col-sm-10">
            {details.status}
        </dd>
    </dl>
    </div>
    </div>
    </div>



  )
};

export default Details