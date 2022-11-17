import React from "react";
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { addClientToDB,getClients } from "../dbRequest";
import {Link} from 'react-router-dom';

const AddClient = () => {
    const [validations, setValidations] = useState("");
    const [newClient, setNewClient] = useState({});
    let navigate = useNavigate();
    const numbers = "+0123456789";

    const onFormControlChange = (event) =>{
        setNewClient((prevState)=>{
            return{
                ...prevState,
                [event.target.name]:event.target.value
            }
        });
      }

      const [clients, setClients] = useState([]);
      const onSubmit=(event)=>{
        event.preventDefault();
        setValidations("");
        //validate form
        var isValid = true;

        //Check if all fields were filled
        if(newClient.name===undefined||newClient.email===undefined||newClient.phone===undefined||newClient.name===""||newClient.email===""||newClient.phone===""){
            isValid=false;
            setValidations("All fields are required!");
        }
        //Check if email and phone number are valid inputs
        if(isValid === true){
            for (let i = 0; i < newClient.phone.length; i++) {
                if(!numbers.includes(newClient.phone[i])){
                    isValid=false;
                    setValidations("Invalid phone number!");
                    break;
                }
            }
            if(isValid===true){
                if(!newClient.email.toLowerCase() .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                    isValid=false;
                    setValidations("Invalid email!");
                }
            }
        }

        if(isValid === true){
            getClients().then((response)=>{
                setClients(response.data);
            });
        }
      }

    //check if client already exists in db
    useEffect(() => {
        var isValid=true;
        if(newClient.name===undefined||newClient.email===undefined||newClient.phone===undefined||newClient.name===""||newClient.email===""||newClient.phone===""){
            isValid=false;
        }
        if(isValid){
            for (let i = 0; i < clients.length; i++) {
                if(clients[i].email===newClient.email && clients[i].phone===newClient.phone){
                    setValidations("Email and Phone are already taken!");
                    isValid = false;
                }else{
                    if(clients[i].email===newClient.email){
                        setValidations("Email already taken!");
                        isValid = false;
                    }else if(clients[i].phone===newClient.phone){
                        setValidations("Phone already taken!");
                        isValid = false;
                    }
                }
            }

            //add to db
            if(isValid === true){
                addClientToDB(newClient).then(()=>{
                    navigate('/')
                });
            }
        }
        }, [clients]);

    return (
        <div>
            <div className="add-client-form">
                <h1 style={{width: '180px',margin: 'auto', 'marginBottom': '25px'}}>Client Info</h1>
                <Link className="MyBtn btn btn-primary" to="/">Back</Link>
                <form onSubmit={onSubmit}>
                    <label>Name:</label>
                    <input className="formInput" type="text" name="name" onChange={onFormControlChange} />
                    <label>Email:</label>
                    <input className="formInput" type="email" name="email" onChange={onFormControlChange} />
                    <label>Phone:</label>
                    <input className="formInput" type="tel" name="phone" onChange={onFormControlChange} />
                    <input id="addBtn" type="submit" className="MyBtn" value="Add" />
                </form>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div className="inputValidations">
                <p>{validations}</p>
            </div>
        </div>
    );
  };
  export default AddClient;