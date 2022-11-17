import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Tabs from "./Components/TabComponent/Tabs";
import AddClient from "./Components/AddClient";
import AddCar from "./Components/AddCar";
import EditClient from "./Components/EditClient";
import EditCar from "./Components/EditCar";
import RentCar from "./Components/RentCar";
import EditRent from "./Components/EditRentEvent";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/add_client" element={<AddClient/>}></Route>
          <Route exact path="/edit_client" element={<EditClient/>}></Route>
          <Route exact path="/add_car" element={<AddCar/>}></Route>
          <Route exact path="/edit_car" element={<EditCar/>}></Route>
          <Route exact path="/rent_car" element={<RentCar/>}></Route>
          <Route exact path="/edit_rent" element={<EditRent/>}></Route>
          <Route path="/" element={<Tabs/>}></Route>
        </Routes>
      </Router>
    </div>  
  );
}

export default App;
