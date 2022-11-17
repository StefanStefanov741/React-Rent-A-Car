import React from "react";
import { useState, useEffect } from 'react';
import editImg from "../../../images/editIcon.png";
import delImg from "../../../images/deleteIcon.png";
import imgImg from "../../../images/imageIcon.png";
import {Link} from 'react-router-dom';
import { getCars, getRented } from "../../../dbRequest";
import { deleteCarFromDB } from "../../../dbRequest";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const CarsTab = () => {
  const [cars, setCars] = useState([]);

  const deleteCarAlert = (carID,carModel) => {
    confirmAlert({
      title: 'Delete car',
      message: 'Are you sure you want to delete '+carModel+'?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteCar(carID)
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const cantDeleteCarAlert = () => {
    confirmAlert({
      title: 'Can\'t delete car!',
      message: 'The car you are trying to delete has already been rented. In order to delete the car you must first erase all car rent history!',
      buttons: [
        {
          label: 'Ok'
        }
      ]
    });
  };

  const deleteCar = (carID) => {
    getRented().then((response)=>{
      let canDelete=true;
      for(let i =0;i<response.data.length;i++){
        if(response.data[i].car===carID){
          canDelete=false;
          break;
        }
      }
      if(canDelete){
        deleteCarFromDB(carID);
        window.location.reload(false);
      }else{
        cantDeleteCarAlert();
      }
     });
  };

  useEffect(()=>{
    getCars().then((response)=>{
        setCars(response.data);
    });
  },[]);

  return (
    <div className="CarsTab">
      <div className="carsTable">
            <Link className="MyBtn" to="/add_car">Add new Car</Link>
            <div className="carsScrollContainer">
                {cars.length>0?
                <table>
                  <tbody>
                    <tr>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Year</th>
                      <th>Type</th>
                      <th>Price per day</th>
                      <th>Available Vehicles</th>
                      <th>Seats</th>
                      <th>Fuel</th>
                      <th className="borderRight">Picture</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                    {cars.map((car, key) => {
                    return (
                        <tr key={key}>
                        <td>{car.brand}</td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td>{car.type}</td>
                        <td>{car.price_per_day}</td>
                        <td>{car.count}</td>
                        <td>{car.seats}</td>
                        <td>{car.fuel}</td>
                        <td className="borderRight"><a href={car.picture} target="_blank"><img className="ControlButton" src={imgImg} alt="Picture"/></a></td>
                        <td><Link to='/edit_car' state={{car}}><img className="ControlButton" src={editImg} alt="Edit"/></Link></td>
                        <td><button href="deletePage" style={{ border: 'none', backgroundColor : 'transparent'}} onClick={event => deleteCarAlert(car.id,car.model)}><img className="ControlButton" src={delImg} alt="Edit"/></button></td>
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
export default CarsTab;