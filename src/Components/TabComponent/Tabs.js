import React, { useState } from "react";
import ClientsTab from "./AllTabs/ClientsTab";
import CarsTab from "./AllTabs/CarsTab";
import RentTab from "./AllTabs/RentTab";
import { useLocation } from "react-router-dom";

const Tabs = () => {
  let ActiveTab = "Clients";
  const location = useLocation();

  if(localStorage.getItem("state")!=null){
    ActiveTab = localStorage.getItem("state");
  }else{
    if(location.state!=null){
      ActiveTab=location.state;
    }
  }

  const [activeTab, setActiveTab] = useState(ActiveTab);
  

  //  Functions to handle Tab Switching
  const handleClientsTab = () => {
    localStorage.setItem('state', "Clients");
    // update the state to clients tab
    location.state="Clients";
    setActiveTab("Clients");
  };
  const handleCarsTab = () => {
    localStorage.setItem('state', "Cars");
    //update the state to cars tab
    location.state="Cars";
    setActiveTab("Cars");
  };
  const handleRentTab = () => {
    localStorage.setItem('state', "Rent");
    // update the state to rent tab
    location.state="Rent";
    setActiveTab("Rent");
  };

  return (
    <div className="Tabs">
      {/* Tab nav */}
      <ul className="nav">
        <li className={activeTab === "Clients" ? "active" : ""} onClick={handleClientsTab}>Clients</li>
        <li className={activeTab === "Cars" ? "active" : ""} onClick={handleCarsTab}>Cars</li>
        <li className={activeTab === "Rent" ? "active" : ""} onClick={handleRentTab}>Rent</li>
      </ul>
      <div className="outlet">

        {/* Check which tab should be shown*/}

        {
          activeTab==="Clients" ? <ClientsTab />
        : activeTab==="Cars" ? <CarsTab /> 
        : activeTab==="Rent" ? <RentTab /> 
        : ""
        }
        
      </div>
    </div>
  );
};

export default Tabs;