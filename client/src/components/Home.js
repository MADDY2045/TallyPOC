import React,{ useState,useEffect } from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import axios from 'axios';
import SelectTransaction from '../components/SelectTransaction';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const Home = () => {


    const [fromDate,setFromDate] = useState(new Date());
    const [toDate,setToDate] = useState(new Date());
    const [formatFromDate,setFormatFromDate]=useState('');
    const [formatToDate,setFormatToDate]=useState('');
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

// useEffect(() => {

//     if(toDate.getTime() > fromDate.getTime() || toDate.getTime() == fromDate.getTime()){
//         const fortmattedfromdate= dateFormat(fromDate, "yyyymmdd");
//         setFormatFromDate(fortmattedfromdate);
//         const fortmattedtodate= dateFormat(toDate, "yyyymmdd");
//         setFormatToDate(fortmattedtodate);

//     }

// }, [fromDate,toDate])

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
            <Link className="btn btn-primary" to={`/cancel`} style={{position:"absolute",left:"1580px",top:"10px"}}>Cancel</Link>
            <Link target="_blank"  className="btn btn-primary" to={`/create`} style={{position:"absolute",left:"1460px",top:"10px"}}>Create</Link>
           <SelectTransaction onChange={handleOption} onClick={handleSubmit}/>
           <div style={{position:"absolute",top:"40px",left:"900px",fontSize:"20px"}}>
           <label >From</label>
                <DatePicker
                    selected={fromDate}
                    onChange={handleFromDate}
                />
                <label>To</label>
                <DatePicker
                    style={{position:"relative",top:"40px",left:"900px",fontSize:"20px"}}
                    selected={toDate}
                    onChange={handleToDate}
                />
           </div>

           <div className="row container">
                <div className="col-md-6 card" style={{minHeight:'700px',position:"absolute",top:"80px",maxWidth:'840px',left:"40px",border:"1px solid grey"}}>
                    <GsApp response={initialdata} option={option} loader={loader}/>
                </div>
                <div className="col-md-6 card" style={{minHeight:'700px',position:"absolute",top:"80px",left:"900px",maxWidth:'840px',border:"1px solid grey"}}>
                <Tally response={initialdata} option={option} loader={loader}/>
                </div>
           </div>
        </div>
            );
}

export default Home;
