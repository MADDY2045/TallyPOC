import React,{useEffect,useState} from 'react';

const KarixHome = () => {

    const [data,setData] = useState("test");
    const [smsflag,setSmsFlag] = useState(false);
    const [whatsappflag,setWhatsappFlag] = useState(false);
    const [template,setTemplate] = useState('');

    const handleChange = (e) =>{
        e.preventDefault();
        if(e.target.name==='template'){
            console.log(e.target.value);
            setTemplate(e.target.value);
        }
    }


    const generateSmsData=(e)=>{
            e.preventDefault();
            setData("maddy");
            console.log(`data is ${data}`)
    }

    useEffect(() => {
        console.clear();
        console.log(`smsflag ${smsflag} __ whatsappflag ${whatsappflag}`);
        }, [smsflag,whatsappflag])

    return (
        <div className="main-hero" id="main-hero">
                <div className="row">
                    <div className="col-md-5 card" id='notification-settings'>
                           <div id="content">
                                <form onSubmit={ generateSmsData } className="form-inline">
                                    <div className="form-group mt-5 mr-3">
                                       <input type="text" className="form-control" id="data" name="data" value={data} />
                                    </div>
                                <button type="submit" className="btn btn-outline-primary mt-5">Generate SMS Data</button>
                                </form>
                                <div className="col-md-4 input-group" id="choose-whatsapp-template">
                                    <select onChange={ handleChange } name="template" className="custom-select" id="inputGroupSelect01">
                                        <option defaultValue>Choose whatsapp template</option>
                                        <option value="OTP requested by you on 1 is 2345">OTP</option>
                                        <option value="Your order Nike has been dispatched.Please expect delivery by tomorrow">Order</option>
                                        <option value="Thank you for your payment of Rs 40000 on sept-12.Your transaction ID is 12345">Payment</option>
                                    </select>
                                </div>
                                <div className="enable-sms">
                                <label className="switch">
                                    <input type="checkbox"  checked={smsflag} onChange={()=>setSmsFlag(!smsflag)}/>
                                    <span className="slider round"></span>
                                </label>
                                <span id="enable-sms-label">SMS</span>
                                </div>
                                <div className="enable-whatsapp">
                                <label className="switch">
                                    <input type="checkbox" checked={whatsappflag} onChange={()=>setWhatsappFlag(!whatsappflag)}/>
                                    <span className="slider round"></span>
                                </label>
                                <span id="enable-whatsapp-label">Whatsapp</span>
                                </div>
                           </div>
                    </div>
                    <div className="col-md-5 card" id='notification-display'>
                            test2
                    </div>
                </div>
        </div>
    );
}

export default KarixHome;
