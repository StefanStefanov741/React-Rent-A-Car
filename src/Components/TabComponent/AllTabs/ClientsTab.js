import React from "react";
import { useState, useEffect } from 'react';
import editImg from "../../../images/editIcon.png";
import delImg from "../../../images/deleteIcon.png";
import {Link} from 'react-router-dom';
import { getClients } from "../../../dbRequest";
import { deleteClientFromDB,getRented } from "../../../dbRequest";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ClientsTab = () => {
  const [clients, setClients] = useState([]);

  const deleteClientAlert = (clientID,clientName) => {
    confirmAlert({
      title: 'Delete client',
      message: 'Are you sure you want to delete '+clientName+'?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteClient(clientID)
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const cantDeleteClientAlert = () => {
    confirmAlert({
      title: 'Can\'t delete client!',
      message: 'The client you are trying to delete has already rented vehicles. In order to delete the client you must first erase all client rent history!',
      buttons: [
        {
          label: 'Ok'
        }
      ]
    });
  };

  const deleteClient = (clientID) => {
    getRented().then((response)=>{
      let canDelete=true;
      for(let i =0;i<response.data.length;i++){
        if(response.data[i].client===clientID){
          canDelete=false;
          break;
        }
      }
      if(canDelete){
        deleteClientFromDB(clientID);
        window.location.reload(false);
      }else{
        cantDeleteClientAlert();
      }
     });
  };

  useEffect(()=>{
    getClients().then((response)=>{
        setClients(response.data);
    });
  },[]);

  return (
    <div className="ClientsTab">
        <div className="clientsTable">
            <Link className="MyBtn" to="/add_client">Add new Client</Link>
            <div className="clientsScrollContainer">
                {
                  clients.length>0?
                  <table>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th className="borderRight">Phone</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                    {clients.map((client, key) => {
                    return (
                        <tr key={key}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td className="borderRight">{client.phone}</td>
                        <td><Link to='/edit_client' state={{client}}><img className="ControlButton" src={editImg} alt="Edit"/></Link></td>
                        <td><button href="deletePage" style={{ border: 'none', backgroundColor : 'transparent'}} onClick={event => deleteClientAlert(client.id,client.name)}><img className="ControlButton" src={delImg} alt="Edit"/></button></td>
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
export default ClientsTab;