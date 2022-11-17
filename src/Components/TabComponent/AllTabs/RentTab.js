import React from "react";
import { useState, useEffect } from 'react';
import editImg from "../../../images/editIcon.png";
import delImg from "../../../images/deleteIcon.png";
import {Link} from 'react-router-dom';
import { getRented,getCars,getClients } from "../../../dbRequest";
import { deleteRentedFromDB } from "../../../dbRequest";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const RentTab = () => {
  const [rented_events, setRentedEvents] = useState([]);
  const [cars, setCars] = useState([]);
  const [clients, setClients] = useState([]);

  //load info
  useEffect(()=>{
    getClients().then((clientsResponse)=>{
      getCars().then((carsResponse)=>{
        getRented().then((rentedResponse)=>{
          setClients(clientsResponse.data);
          setCars(carsResponse.data);
          setRentedEvents(rentedResponse.data);
        });
      });
    });
  },[]);

  const deleteRentedAlert = (rentedID) => {
    confirmAlert({
      title: 'Delete rented event',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteRented(rentedID)
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const deleteRented = (rentedID) => {
    deleteRentedFromDB(rentedID);
    window.location.reload(false);
  };

  const findClient = (client) => {
    return clients.find(cln => {return cln.id === client;});
  };

  const findCar = (car) => {
    return cars.find(cr => {return cr.id === car;});
  };

  return (
    <div className="RentedTab">
        <div className="rentedTable">
            <Link className="MyBtn" to="/rent_car">Rent car</Link>
            <div className="rentedScrollContainer">
                {
                  rented_events.length>0?
                  <table>
                  <tbody>
                    <tr>
                      <th style={{maxWidth: "90px"}}>Start</th>
                      <th style={{maxWidth: "90px"}}>End</th>
                      <th style={{maxWidth: "90px"}} className="borderRight">Total Paid</th>
                      <th>Client Name</th>
                      <th className="borderRight">Client Phone</th>
                      <th>Car Brand</th>
                      <th>Car Model</th>
                      <th>Car Year</th>
                      <th className="borderRight">Car Price</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                    {rented_events.map((rent, key) => {
                    return (
                        <tr key={key}>
                        <td style={{maxWidth: "90px"}}>{rent.start}</td>
                        <td style={{maxWidth: "90px"}}>{rent.end}</td>
                        <td style={{maxWidth: "90px"}} className="borderRight">{rent.total_paid}</td>
                        <td>{findClient(rent.client).name}</td>
                        <td className="borderRight">{findClient(rent.client).phone}</td>
                        <td>{findCar(rent.car).brand}</td>
                        <td>{findCar(rent.car).model}</td>
                        <td>{findCar(rent.car).year}</td>
                        <td className="borderRight">{findCar(rent.car).price_per_day}</td>
                        <td><Link to='/edit_rent' state={{rent}}><img className="ControlButton" src={editImg} alt="Edit"/></Link></td>
                        <td><button href="deletePage" style={{ border: 'none', backgroundColor : 'transparent'}} onClick={event => deleteRentedAlert(rent.id)}><img className="ControlButton" src={delImg} alt="Edit"/></button></td>
                        </tr>
                    )
                    })}
                  </tbody>
                </table> 
                  :
                  <div style={{width: '340px', padding: '50px', margin:'auto'}}><h1>No data found!</h1></div>
                }
            </div>
        </div>
    </div>
  );
};
export default RentTab;