import {useContext, useState} from "react";
import './selecttraveller.css';
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../../Helper/FlightContext";


const Selecttravaeller = () => {
    const [travellerInfo,setTravellerInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
    });
    
    const {setTraveller} = useContext(FlightContext);

    // const {firstName,lastName,dateOfBirth,email} = traveller ;

    const changeHandle = e => {
      //setAllInf({...allInf,[e.target.name]:e.target.value})
      setTravellerInfo({...travellerInfo,[e.target.name]: e.target.value})
    }
    const navigate = useNavigate()
    // const [seat,setSeat] = useState(false);
    // if(seat){
    //     if(firstname && lastname && dob && email){
    //         return navigate('/seatselection');
    //     }
    //     else{
    //         alert("Please fill in all the details.");
    //     }
        
    // }

    function handleClick(e){
        e.preventDefault();
        setTraveller(travellerInfo)
        if(travellerInfo.firstName && travellerInfo.lastName && travellerInfo.dateOfBirth && travellerInfo.email){
            navigate('/seatselection');
        }else{
            alert("Please fill all the details");
        }
    }

    return (
        <div className="tt">
            <div>
                <div>
                    <h3 className="add-traveller-title">Traveller Details<hr /></h3>
                </div>
                <div className="message-alert">
                    <p className="message-alert-para">
                        <span>
                            <img className="alert-emoji" src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/alert-triangle-orange-512.png" alt="alert-signal" />
                        </span>
                        please ensure that your name matches your govt. ID such as Aadhaar, Passport or Driver&apos;s License
                    </p>
                </div>
            </div>
            <div className="traveller-container">
                <div id="traveler-info-form">
                    {/* <div className="form-group gender-options">
                        <label>
                            <input type="radio" name="title" value="Male" required /> Male
                        </label>
                        <label>
                            <input type="radio" name="title" value="Female" required /> Female
                        </label>
                        <label>
                            <input type="radio" name="title" value="other" required /> other
                        </label>
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="first-name">First Name</label>
                        <input type="text" name="firstName" value={travellerInfo.firstName} onChange={changeHandle} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last-name">Last Name</label>
                        <input type="text" name="lastName" value={travellerInfo.lastName} onChange={changeHandle} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={travellerInfo.dateOfBirth} onChange={changeHandle} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" value={travellerInfo.email} onChange={changeHandle} className="form-control" required />
                    </div>
                    <div>
                      <button className="save-btn" id="bottom-button" onClick={handleClick}>Save</button>
                  </div>
                </div>
            </div>
        </div>
    );
}

export default Selecttravaeller;
