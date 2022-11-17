import axios from 'axios';

const clientsURL = "http://localhost:3500/clients";
const carsURL = "http://localhost:3500/cars";
const rentedURL = "http://localhost:3500/rented";

//Clients

export function getClients(){
    return axios.get(clientsURL);
}

export function addClientToDB(clientObj){
    return axios.post(clientsURL,clientObj);
}

export function deleteClientFromDB(clientID){
    axios.delete(clientsURL+"/"+clientID);
}

export function updateClient(clientObj){
    return axios.put(clientsURL+"/"+clientObj.id,clientObj);
}

//Cars

export function getCars(){
    return axios.get(carsURL);
}

export function addCarToDB(carObj){
    return axios.post(carsURL,carObj);
}

export function deleteCarFromDB(carID){
    axios.delete(carsURL+"/"+carID);
}

export function updateCar(carObj){
    return axios.put(carsURL+"/"+carObj.id,carObj);
}

export function update2Cars(carObj1,carObj2){
    axios.put(carsURL+"/"+carObj1.id,carObj1);
    return axios.put(carsURL+"/"+carObj2.id,carObj2);
}

//Rented

export function getRented(){
    return axios.get(rentedURL);
}

export function addRentedToDB(rentObj){
    return axios.post(rentedURL,rentObj);
}

export function deleteRentedFromDB(rentID){
    axios.delete(rentedURL+"/"+rentID);
}

export function updateRented(rentObj){
    return axios.put(rentedURL+"/"+rentObj.id,rentObj);
}