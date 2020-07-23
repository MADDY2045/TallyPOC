import React,{useState} from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import axios from 'axios';
import SelectTransaction from '../components/SelectTransaction';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { Link } from 'react-router-dom';
const Home = () => {

const [initialdata,setInitialData] = useState([]);
const [option,setOption] = useState('Choose');
const [loader,setLoader] = useState(false);

const handleOption=(e)=>{
    e.preventDefault();
    setOption(e.target.value);
    setLoader(false);
}

const handleSubmit=()=>{

if(option ==='' || option ==='Choose'){
    // console.log('not allowed');
}else{
    // console.log('allowed');
    axios.get(`http://localhost:5050/getrecondetails/${option}`).then(response=>{
       setInitialData(response.data);
       setLoader(true)
    }).catch(err=>console.log(err));
}
}

return (
        <div >
            <Link className="btn btn-primary" to={`/cancel`} style={{position:"absolute",left:"1580px",top:"10px"}}>Cancel Flow</Link>
           <SelectTransaction onChange={handleOption} onClick={handleSubmit}/>
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
