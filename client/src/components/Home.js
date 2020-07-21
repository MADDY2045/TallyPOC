import React,{useState,useEffect} from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import { parseString } from 'xml2js';
import axios from 'axios';
import SelectTransaction from '../components/SelectTransaction';

const Home = () => {

const [initialdata,setInitialData] = useState([]);
const [option,setOption] = useState('Choose');

const handleOption=(e)=>{
    e.preventDefault();
    setOption(e.target.value);
}

const handleSubmit=()=>{

if(option ==='' || option ==='Choose'){
    console.log('not allowed');
}else{
    console.log('allowed');
    axios.get(`http://localhost:5050/getrecondetails/${option}`).then(response=>{
        console.log(response.data);
        setInitialData(response.data);
    }).catch(err=>console.log(err));
}
}

return (
        <div >
           <SelectTransaction onChange={handleOption} onClick={handleSubmit}/>
           <div className="row container">
                <div className="col-md-6 card" style={{minHeight:'700px',position:"absolute",top:"80px",maxWidth:'840px',left:"40px"}}>
                    <GsApp/>
                </div>
                <div className="col-md-6 card" style={{minHeight:'700px',position:"absolute",top:"80px",left:"900px",maxWidth:'840px'}}>
                <Tally/>
                </div>
           </div>
        </div>
            );
}

export default Home;
