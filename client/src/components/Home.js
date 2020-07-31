import React,{ useState } from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import axios from 'axios';
import SelectTransaction from '../components/SelectTransaction';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';


const Home = () => {


    const [fromDate,setFromDate] = useState(new Date());
    const [toDate,setToDate] = useState(new Date());
    const [initialdata,setInitialData] = useState([]);
    const [option,setOption] = useState('Choose');
    const [loader,setLoader] = useState(false);

    const handleFromDate=(date)=>{
        setFromDate(date);
    }

    const handleToDate=(date)=>{
        setToDate(date);
    }

const handleOption=(e)=>{
    e.preventDefault();
    setOption(e.target.value);
    setLoader(false);
}



const handleSubmit=()=>{

if(option ==='' || option ==='Choose'){
    // console.log('not allowed');
}else{
    axios.get(`http://localhost:5050/getrecondetails/${option}/${fromDate}/${toDate}`).then(response=>{
            setInitialData(response.data);
            setLoader(true)
         }).catch(err=>console.log(err));
        }
}

return (
        <div >
             <nav className="navbar" style={{background:"#283f59",color:"white"}}>
                <a className="navbar-brand" href="http://localhost:3000/create" target="_blank" style={{position:"relative",left:"80px",textDecoration:"none",color:"white"}} rel='noopener noreferrer'>Create</a>
                <a className="navbar-brand" href="http://localhost:3000/cancel" target="_blank" style={{position:"relative",left:"0px",textDecoration:"none",color:"white"}} rel='noopener noreferrer'>Cancel</a>
                <a className="navbar-brand" href="http://localhost:3000/createpayroll" target="_blank" style={{position:"relative",left:"-60px",textDecoration:"none",color:"white"}} rel='noopener noreferrer'>Create Payroll</a>
                <a className="navbar-brand" href="http://localhost:3000/disbursepayroll" target="_blank" style={{position:"relative",left:"-120px",textDecoration:"none",color:"white"}} rel='noopener noreferrer'>Disburse Payroll</a>
                <span><SelectTransaction onChange={handleOption} onClick={handleSubmit}/></span>
                <span style={{position:"relative",left:"0px",zIndex:"10"}}>
                <label style={{position:"relative",left:"-10px"}} >From</label>
                <DatePicker
                    selected={fromDate}
                    onChange={handleFromDate}
                />
                </span>
                <span style={{position:"relative",left:"-20px",zIndex:"10"}}>
                <label style={{position:"relative",left:"-20px",zIndex:"10"}}>To</label>
                <DatePicker
                   selected={toDate}
                    onChange={handleToDate}
                />
                </span>
            </nav>
            <div className="row container">
                <div className="col-md-6 card" style={{minHeight:'700px',position:"absolute",top:"120px",maxWidth:'840px',left:"40px",border:"1px solid grey"}}>
                    <GsApp response={initialdata} option={option} loader={loader}/>
                </div>
                <div className="col-md-6 card" style={{minHeight:'700px',position:"absolute",top:"120px",left:"900px",maxWidth:'840px',border:"1px solid grey"}}>
                <Tally response={initialdata} option={option} loader={loader}/>
                </div>
           </div>
        </div>
            );
}

export default Home;
