import React from "react";
import {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateRented,getCars,getRented,getClients,update2Cars} from "../dbRequest";
import {Link} from 'react-router-dom';

const RentCar = () => {
    const [loaded,setLoaded] = useState(false);
    const location = useLocation();
    var currentRent = location.state.rent;
    const [validations, setValidations] = useState("");
    const [newRent, setNewRent] = useState(currentRent);
    const [rented, setRented] = useState({});
    const [cars, setCars] = useState([]);
    const [clients, setClients] = useState([]);
    let navigate = useNavigate();
    const [submit,setSubmit] = useState(false);

    //load cars and clients
    useEffect(() => {
        getCars().then((carsResponse)=>{
            getClients().then((clientsResponse)=>{
                let allCars = carsResponse.data;
                let availableCars = allCars.filter(cr => {return cr.count != "0";});
                setCars(availableCars);
                setClients(clientsResponse.data);
            });
        });
    }, []);
    


    let minEndDate =  new Date();
    minEndDate.setDate(new Date(currentRent.start).getDate() + 1)

    const [minEndDateString,setMinEndDateString] = useState(minEndDate.getFullYear()+"-"+(minEndDate.getUTCMonth()+1)+"-"+minEndDate.getDate()+"T"+minEndDate.getHours()+":"+minEndDate.getMinutes());

    const onFormControlChange = (event) =>{
        if(event.target.name=="start"){
            minEndDate.setDate(new Date(event.target.value).getDate()+1);
            setMinEndDateString(minEndDate.getFullYear()+"-"+(minEndDate.getUTCMonth()+1)+"-"+minEndDate.getDate()+"T"+minEndDate.getHours()+":"+minEndDate.getMinutes());
        }
        setNewRent((prevState)=>{
            return{
                ...prevState,
                [event.target.name]:event.target.value
            }
        });
      }

      const onSubmit=(event)=>{
        event.preventDefault();
        setSubmit(true);
        setValidations("");
        //validate form
        var isValid = true;
        if(newRent===null || newRent ===undefined || newRent.car===undefined || newRent.car===""|| newRent.client===undefined || newRent.client===""|| newRent.start===undefined|| newRent.end===undefined){
            isValid=false;
            setValidations("Some fields are invalid!");
        }

        if(isValid){
            if(new Date(newRent.end)<new Date(newRent.start).getDate()+1){
                isValid=false;
                setValidations("End date must be at least a day after start date!");
            }
        }

        if(isValid){
            getRented().then((response)=>{
                setRented(response.data);
            });
        }
      }

        useEffect(() => {
            if (!submit) {
                return;
            }
            var isValid = true;
            if(newRent===null || newRent ===undefined || newRent.car===undefined || newRent.car===""|| newRent.client===undefined || newRent.client===""|| newRent.start===undefined|| newRent.end===undefined){
                return;
            }
            var Sdate = newRent.start.substring(0, 10);
            var Edate = newRent.end.substring(0, 10);
            var Stime = newRent.start.substring(11);
            var Etime = newRent.end.substring(11);
            newRent.start=Sdate+" "+Stime;
            newRent.end=Edate+" "+Etime;

            newRent.car = parseInt(newRent.car);
            newRent.client = parseInt(newRent.client);
            //check if the same rent event already exists under a different id
            for (let i = 0; i < rented.length; i++) {
                if(rented[i].id!=currentRent.id && rented[i].car===newRent.car&&rented[i].client===newRent.client&&rented[i].start===newRent.start&&rented[i].end===newRent.end){
                    isValid=false;
                    setValidations("Another rent event is identical with this one!");
                }
            }
            //calculate final price
            let beginDate = new Date(newRent.start);
            let finalDate = new Date(newRent.end);
            //calc difference in time
            let Difference_In_Time = finalDate.getTime() - beginDate.getTime();
            //calc day diff
            let rentedPeriod = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
            let final_price = 0;
            let isVip =false;
            //check if customer has rented a vehicle more than 3 times the past 60 days and give him vip if he did
            let customerRents = rented.filter(rentEvent => {return rentEvent.client === newRent.client});
            let SixtyDaysAgo = new Date();
            SixtyDaysAgo.setDate(new Date().getDate()-60);

            let vipEventCounter = 0;
            for(let i = 0; i<customerRents.length;i++){
                if(new Date(customerRents[i].end)>SixtyDaysAgo){
                    vipEventCounter++;
                }
            }
            if(vipEventCounter>3){
                isVip=true;
            }
            if(!isVip){
                if(rentedPeriod<=3){
                    final_price=findCar(newRent.car).price_per_day*rentedPeriod;
                }else if(rentedPeriod>3&&rentedPeriod<=5){
                    final_price=findCar(newRent.car).price_per_day*rentedPeriod*0.95;
                }else if(rentedPeriod>5&&rentedPeriod<=10){
                    final_price=findCar(newRent.car).price_per_day*rentedPeriod*0.93;
                }else if(rentedPeriod>10){
                    final_price=findCar(newRent.car).price_per_day*rentedPeriod*0.90;
                }
            }else{
                final_price=findCar(newRent.car).price_per_day*rentedPeriod*0.85;
            }
            newRent.total_paid=final_price;
            //save to db
            if(isValid === true){
                newRent.id=currentRent.id;
                if(newRent.car!=currentRent.car){
                    //update car availability
                    let carToUpdate1 = findCar(newRent.car);
                    carToUpdate1.count = (parseInt(carToUpdate1.count)-1).toString()
                    let carToUpdate2 = findCar(currentRent.car);
                    carToUpdate2.count = (parseInt(carToUpdate2.count)+1).toString()
                    update2Cars(carToUpdate1,carToUpdate2).then(()=>{
                        navigate('/',{state:"Rent"})
                    });
                }
                updateRented(newRent).then(()=>{
                    navigate('/',{state:"Rent"})
                });
            }
        }, [rented]);

        useEffect(() => {
            if(cars.length>0 && clients.length>0){
                setLoaded(true);
            }
        }, [cars,clients]);

        const findCar = (car) => {
            return cars.find(cr => {return cr.id === car;});
        };
    if(loaded){
        return (
            <div>
                <div className="add-rent-form">
                    <h1 style={{width: '190px',margin: 'auto', 'marginBottom': '25px'}}>Rent a car</h1>
                    <Link className="MyBtn btn btn-primary" to="/" state={"Rent"}>Back</Link>
                    <form onSubmit={onSubmit}>
                        <div className="rentFormLeftHalf">
                            <div className="inputPair">
                                <label className="rentLabelsLeft">Start Date:</label>
                                <input className="formInput3" style={{'marginLeft':"11px", width:"40%", float:"left", 'paddingLeft':"10px", 'paddingRight':"10px"}} type="datetime-local" defaultValue={currentRent.start} name="start" onChange={onFormControlChange} />
                            </div>
                            <div className="inputPair">
                                <label className="rentLabelsLeft">Client:</label>
                                <select className="formInput3" style={{'marginRight':"20px"}} name="client" id="carSelect" defaultValue={currentRent.client} onChange={onFormControlChange}>
                                <option value="" key="none"></option>
                                {clients.map((client, key) => {
                                return (
                                    <option value={client.id} key={key}>{client.name}&nbsp;&nbsp;&nbsp;&nbsp; {client.phone}&nbsp;&nbsp;&nbsp;&nbsp; {client.email}</option>
                                )
                                })}
                                </select>
                            </div>
                        </div>
                        <div className="rentFormRightHalf">
                            <div className="inputPair">
                                <label className="rentLabelsRight">End Date:</label>
                                <input className="formInput3" style={{'marginLeft':"11px", width:"40%", float:"left", 'paddingLeft':"10px", 'paddingRight':"10px"}} type="datetime-local" min={minEndDateString} defaultValue={currentRent.end} name="end" onChange={onFormControlChange} />
                            </div>
                            <div className="inputPair">
                                <label className="rentLabelsRight">Car:</label>
                                <select className="formInput3" style={{'marginRight':"20px"}} name="car" id="carSelect" defaultValue={findCar(currentRent.car).id} onChange={onFormControlChange}>
                                <option value="" key="none"></option>
                                {cars.map((car, key) => {
                                return (
                                    <option value={car.id}  key={key}>{car.brand} {car.model} {car.year} {car.fuel} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;price-per-day: {car.price_per_day}</option>
                                )
                                })}
                                </select>
                            </div>
                        </div>
                        <div className="inputPair" style={{width:"60%", margin:"auto"}}>
                                <input id="addBtn2" type="submit" className="MyBtn" value="Save" />
                        </div>
                    </form>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className="inputValidations">
                    <p style={{textAlign:"center"}}>{validations}</p>
                </div>
            </div>
        );
    }else{
        return(
            <div style={{margin:"auto"}}>
                <h1 style={{color:"white"}}>Loading</h1>
            </div>
        );
    }
  };
  export default RentCar;