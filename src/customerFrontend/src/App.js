
    import React, { Component } from 'react';
    import Contacts from './components/contacts';
    import axios from 'axios';
    import Details from './components/details';

    class App extends Component {
      constructor(props) {
        super(props);
    
        this.state = {
          contacts: [],
          id: "",
          showDetails: false,
          customer: {}
        };
    
      }

      componentDidMount() {
        axios.get(process.env.REACT_APP_CUSTOMER_LIST_URI)
      .then(res => {
        const persons = res.data;
        this.setState({ contacts: persons});
      })

      }

      getCustomer=(e)=>{
        
          axios.get(process.env.REACT_APP_CUSTOMER_URI + e.target.id)
          .then(res => {
            const response = res.data
            this.setState({ customer: response,showDetails: true});
          })
      }

      setDetails=()=>{
        this.setState({showDetails:false})
      }


      render() {
        return (
          <div>
            {this.state.showDetails ?
               <Details details={this.state.customer}/> :
               <Contacts contacts={this.state.contacts} getCustomer={this.getCustomer}/>
            }
          </div>
        );
      }
    }

    export default App;