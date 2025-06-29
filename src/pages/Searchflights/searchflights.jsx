import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchflights.css';
import { useAuthContext } from '../../auth/useAuthContext';
//import { Info } from "../../Helper/helper";

const Searchflights = () => {
  const [ searchInf, setSearchInf ] = useState({
    startingCity: '',
    destinationCity: '',
    travelDate: '',
  });

  const handleChange = e => {
    setSearchInf({ ...searchInf, [e.target.name]: e.target.value });
  }

  const navigate = useNavigate();
  //const [search, setSearch] = useState(false);

  // if (search) {
  //   if (from && to && travellingdate) {
  //     return navigate('/flightdisplay');
  //   } else {
  //     alert("Please fill in all the details.");
  //   }
  // }

  const {isAuthenticated} = useAuthContext();
  const handleSubmit =async (e) => {
    e.preventDefault();
    if(isAuthenticated){
      navigate('/flightdisplay', {state: searchInf});
    }else{
      alert("Please Login to your account to continue booking!");
      navigate('/login');
    }
    
  };

  return (
    <div>
      <h1 className='heading'>Flight Bookings</h1>
      <div className='box'>
        <h5 className='one-way-title'>One-way</h5>
        <center>
          <form onSubmit={handleSubmit}>
            <div className='form-grp'>
              <label>From: 🛫</label><br />
              <select name='startingCity' value={searchInf.startingCity} onChange={handleChange} required>
                <option value='' disabled>Select departure city</option>
                <option value='Bangalore'>Bangalore</option>
                <option value='Mumbai'>Mumbai</option>
                <option value='Delhi'>Delhi</option>
                <option value='Chennai'>Chennai</option>
                <option value= 'Ahmedabad'>Ahmedabad</option>
                {/* Add more options as needed */}
              </select><br />
            </div>
            <div className='to-grp'>
              <label>To: 🛬</label><br />
              <select name='destinationCity' value={searchInf.destinationCity} onChange={handleChange} required>
                <option value='' disabled>Select destination city</option>
                <option value='Guwahati'>Guwahati</option>
                <option value='Kolkata'>Kolkata</option>
                <option value='Hyderabad'>Hyderabad</option>
                <option value='Pune'>Pune</option>
                <option value='Vishakapatnam'>Vishakapatnam</option>
                {/* Add more options as needed */}
              </select><br />
            </div>
            <div className='date-grp'>
              <label>Departure Date: 🕒</label><br />
              <input type='date' name='travelDate' value={searchInf.travelDate} onChange={handleChange} required/>
            </div>
            <div>
              {/* <button type='button' className='search-btn' onClick={() => setSearch(true)}>Search Flights🔍</button><br /> */}
              <button type='submit' className='search-btn'>Search Flights 🔍</button>
            </div>
          </form>
        </center>
      </div>
    </div>
  );
}

export default Searchflights;
