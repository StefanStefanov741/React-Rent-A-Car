import React from "react";
import {useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateClient,getClients } from "../dbRequest";
import {Link} from 'react-router-dom';

const EditClient = () => {
    const location = useLocation();
    var currentClient = location.state.client;
    const [submit,setSubmit] = useState(false);

    const [validations, setValidations] = useState("");
    const [newClient, setNewClient] = useState(currentClient);
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
        setSubmit(true);
        event.preventDefault();
        setValidations("");
        //validate form
        var isValid = true;

        //Check if all fields were filled
        if(newClient.name===undefined||newClient.name===""||newClient.email===undefined||newClient.email===""||newClient.phone===undefined||newClient.phone===""){
            isValid=false;
            setValidations("All fields are required!");
        }
        //Check if email and phone number are valid inputs
        if(isValid){
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

        if(isValid){
            getClients().then((response)=>{
                setClients(response.data);
            });
        }
      }

      //if the changes dont clash with another client info save the new client into the db
      useEffect(() => {
        if (!submit) {
            return;
        }
        var isValid=true;
        if(newClient.name===undefined||newClient.email===undefined||newClient.phone===undefined||newClient.name===""||newClient.email===""||newClient.phone===""){
            isValid=false;
        }
        if(isValid){
            for (let i = 0; i < clients.length; i++) {
                if(clients[i].id!=currentClient.id){
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
            }
        }

        //add to db
        if(isValid === true){
            newClient.id=currentClient.id;
            updateClient(newClient).then(()=>{
                navigate('/')
            });
        }
        }, [clients]);

    return (
        <div>
            <div className="add-client-form">
                <h1>Client Info</h1>
                <Link className="MyBtn btn btn-primary" to="/">Back</Link>
                <form onSubmit={onSubmit}>
                    <label>Name:</label>
                    <input className="formInput" type="text" name="name" defaultValue={currentClient.name} onChange={onFormControlChange} />
                    <label>Email:</label>
                    <input className="formInput" type="email" name="email" defaultValue={currentClient.email} onChange={onFormControlChange} />
                    <label>Phone:</label>
                    <input className="formInput" type="tel" name="phone" defaultValue={currentClient.phone} onChange={onFormControlChange} />
                    <input id="addClientBtn" type="submit" className="MyBtn" value="Save" />
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
  export default EditClient;