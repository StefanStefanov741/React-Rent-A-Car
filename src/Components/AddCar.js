import React from "react";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { addCarToDB,getCars } from "../dbRequest";
import {Link} from 'react-router-dom';

const AddCar = () => {
    const [validations, setValidations] = useState("");
    const [newCar, setNewCar] = useState({});
    const [car, setEditCar] = useState(null);
    const [cars, setCars] = useState([]);
    let navigate = useNavigate();

    const onFormControlChange = (event) =>{
        setNewCar((prevState)=>{
            return{
                ...prevState,
                [event.target.name]:event.target.value
            }
        });
      }

      const onSubmit=(event)=>{
        event.preventDefault();
        setValidations("");
        setEditCar(null);
        //validate form
        var isValid = true;
        if(newCar.brand===undefined||newCar.model===undefined||newCar.type===undefined||newCar.year===undefined||newCar.fuel===undefined||newCar.price_per_day===undefined||newCar.seats===undefined||newCar.count===undefined||newCar.picture===undefined || newCar.brand===""||newCar.model===""||newCar.type===""||newCar.year===""||newCar.fuel===""||newCar.price_per_day===""||newCar.seats===""||newCar.count===""||newCar.picture===""){
            isValid=false;
            setValidations("All fields are required!");
        }
        if(isValid === true){
            getCars().then((response)=>{
                setCars(response.data);
            });
        }
      }

      //check if car already exists in db and add it if it doesnt
      useEffect(() => {
        var isValid=true;
        if(newCar.brand===undefined||newCar.model===undefined||newCar.type===undefined||newCar.year===undefined||newCar.fuel===undefined||newCar.price_per_day===undefined||newCar.seats===undefined||newCar.count===undefined||newCar.picture===undefined || newCar.brand===""||newCar.model===""||newCar.type===""||newCar.year===""||newCar.fuel===""||newCar.price_per_day===""||newCar.seats===""||newCar.count===""||newCar.picture===""){
            isValid=false;
        }
        if(isValid){
            for (let i = 0; i < cars.length; i++) {
                if(cars[i].brand==newCar.brand && cars[i].model==newCar.model && cars[i].year==newCar.year && cars[i].fuel==newCar.fuel && cars[i].price_per_day==newCar.price_per_day && cars[i].seats==newCar.seats){
                    isValid=false;
                    setValidations("Car already exists in the database. You can edit it and increase the amount of available vehicles from ");
                    setEditCar(cars[i]);
                }
            }
            //add to db
            if(isValid === true){
                addCarToDB(newCar).then(()=>{
                    navigate('/',{state:"Cars"})
                });
            }
        }
     }, [cars]);
    return (
        <div>
            <div className="add-car-form">
                <h1 style={{width: '140px',margin: 'auto', 'marginBottom': '25px'}}>Car Info</h1>
                <Link className="MyBtn btn btn-primary" to="/" state={"Cars"}>Back</Link>
                <form onSubmit={onSubmit}>
                    <div className="carFormLeftHalf">
                        <div className="inputPair">
                            <label className="carLabelsLeft">Brand:</label>
                            <input className="formInput2" style={{'marginRight':"70px"}} type="text" name="brand" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsLeft">Model:</label>
                            <input className="formInput2" style={{'marginRight':"70px"}} type="text" name="model" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsLeft">Year:</label>
                            <input className="formInput2" style={{'marginRight':"70px"}} type="number" min={1940} name="year" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsLeft">Type:</label>
                            <select className="formInput2" style={{'marginRight':"70px"}} name="type" id="typeSelect" onChange={onFormControlChange}>
                                <option value=""></option>
                                <option value="economy">Economy</option>
                                <option value="estate">Estate</option>
                                <option value="luxury">Luxury</option>
                                <option value="SUV">SUV</option>
                                <option value="cargo">Cargo</option>
                            </select>
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsLeft">Fuel:</label>
                            <select className="formInput2" style={{'marginRight':"70px"}} name="fuel" id="fuelSelect" onChange={onFormControlChange}>
                                <option value=""></option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="electric">Electric</option>
                            </select>
                        </div>
                    </div>
                    <div className="carFormRightHalf">
                        <div className="inputPair">
                            <label className="carLabelsRight">Seats:</label>
                            <input className="formInput2" type="number" min="1" name="seats" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsRight">Price per day:</label>
                            <input className="formInput2" type="number" min="1" name="price_per_day" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsRight">Count (Available Vehicles):</label>
                            <input className="formInput2" type="number" min="0" name="count" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <label className="carLabelsRight">Picture (link):</label>
                            <input className="formInput2" type="text" name="picture" onChange={onFormControlChange} />
                        </div>
                        <div className="inputPair">
                            <input id="addBtn2" type="submit" className="MyBtn" value="Add" />
                        </div>
                    </div>
                </form>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div className="inputValidations">
                <p>{validations}{car!=undefined && car!=null?<Link to="/edit_car" state={{car}}>here</Link>:""}</p>
            </div>
        </div>
    );
  };
  export default AddCar;