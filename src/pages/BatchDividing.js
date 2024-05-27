import React, { useEffect, useState } from "react";
import axios from "axios" //npm install axios --save 
import {Link} from 'react-router-dom';
import Admin from "./Admin";
import "./menu.css";
import './style.css'
export default function BatchDividing(){
  
    
     
    
    return (
    <div>
        
        <div className="batch-div">
            <div className="row h-100">
                <div className="col-12">
                   <center>
                    <p><Link to="/custom" className="btn btn-success">Custom batch dividing</Link> </p>
                    <br></br>
                    <p><Link to="/automate" className="btn btn-success">Automate batch dividing</Link> </p>
                   
                    </center>
                </div>
            </div>
        </div>
    </div>
  );
}
