import React,{useEffect,useState} from 'react';
import faker from 'faker';
import axios from 'axios';

const KarixHome = () => {

    const [data,setData] = useState("test");
    const [smsflag,setSmsFlag] = useState(false);
    const [whatsappflag,setWhatsappFlag] = useState(false);
    const [template,setTemplate] = useState('');
    const [phonenumber,setPhonenumber] = useState('');
    const [recipients,setRecipients] = useState([]);
    const [whatsappnumber,setWhatsappnumber] = useState('');

    const handleChange = (e) =>{
        e.preventDefault();
        if(e.target.name==='template'){
            console.log(e.target.value);
            setTemplate(e.target.value);
        }
        if(e.target.name==='phonenumber'){
            console.log(e.target.value);
           setPhonenumber(e.target.value);
        }
        if(e.target.name==='whatsappnumber'){
            console.log(e.target.value);
            setWhatsappnumber(e.target.value);
        }
    }


    const generateSmsData=(e)=>{
            e.preventDefault();

    }

    const sendNotification=()=>{
        let dataobj = {}
        if(smsflag || whatsappflag){
            if(smsflag){
                dataobj["enablesms"]= true;
                dataobj["smsmobile"]= phonenumber === "" || phonenumber === 'Choose Recipient' ? alert("required phone number"):phonenumber;
                dataobj["body"] = data;
            }if(whatsappflag){
                dataobj["enablewhatsapp"]= true;
                dataobj["whatsappmobile"]=whatsappnumber === ""  || whatsappnumber === 'Choose Recipient' ? alert("required whatsapp number"):whatsappnumber;
                dataobj["whatsappbody"] = template === "" || template === 'Choose whatsapp template' ? alert('please select a template'):template;
                }
                console.log(`clicked sendnotification ${JSON.stringify(dataobj,null,2)}`);
                axios.post("http://localhost:6050/sendnotification",{dataobj}).then(response=>{
                    console.log(response.data);
                })
                .catch(err=>{
                    console.log(`error in sending data ${err}`)
                })
        }else{
            alert('please choose a channel')
        }


    }

    useEffect(() => {
        console.clear();
        // console.log(`smsflag ${smsflag} __ whatsappflag ${whatsappflag}`);
        if(smsflag){
            var randomText = faker.lorem.sentence();
            setData(randomText);
            console.log(`data is ${data}`)
        }
        }, [smsflag])

    return (
        <div className="main-hero" id="main-hero">
                <div className="row">
                    <div className="col-md-5 card" id='notification-settings'>
                           <div id="content">
                                <form onSubmit={ generateSmsData } className="form-inline">
                                    <div className="form-group mt-5 mr-3">
                                       <input type="text" className="form-control" id="data" name="data" hidden={!smsflag} disabled={!smsflag} value={data} />
                                    </div>
                                {/* <button type="submit" className="btn btn-outline-primary mt-5">Generate SMS Data</button> */}
                                </form>
                                <div className="col-md-4 input-group" id="choose-whatsapp-template">
                                    <select onChange={ handleChange } hidden={!whatsappflag} name="template" className="custom-select" id="inputGroupSelect01">
                                        <option defaultValue>Choose whatsapp template</option>
                                        <option value="OTP requested by you on 1 is 2345">OTP</option>
                                        <option value="Your order Nike has been dispatched. Please expect delivery by tomorrow">Order</option>
                                        <option value="Thank you for your payment of Rs 40000 on sept-12. Your transaction ID is 12345">Payment</option>
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
                                <div className="whatsapp-phone" id="whatsapp-phone">
                           <select onChange={ handleChange } hidden={!whatsappflag} name="whatsappnumber" className="custom-select" >
                                        <option defaultValue>Choose Recipient</option>
                                        <option value="+919894948839">Madhavan</option>
                                        <option value="+919677909923">Sankar</option>
                                        </select>
                            {/* <button id="add-sms-recipient" hidden={!smsflag} className="btn btn-success" onClick={ addSmsRecipient }>Add</button> */}
                           </div>
                           </div>
                           <div className="sms-phone" id="sms-phone">
                           <select onChange={ handleChange } hidden={!smsflag} name="phonenumber" className="custom-select" >
                                        <option defaultValue>Choose Recipient</option>
                                        <option value="9894948839">Madhavan</option>
                                        <option value="8610251005">Prasad</option>
                            </select>
                            {/* <button id="add-sms-recipient" hidden={!smsflag} className="btn btn-success" onClick={ addSmsRecipient }>Add</button> */}
                           </div>
                           <button
                           onClick={ sendNotification }
                           id="send-notification"
                           className="btn btn-outline-info">Send Notification</button>
                    </div>
                    <div className="col-md-5 card" id='notification-display'>
                           <div className="row" id="sms-pusher-div">
                                <span>
                                    <label>SMS</label>
                                    <span className="dot" style={{visibility:"hidden"}} id="sms-sent"></span>
                                    <label className="sms-sent-label">sent</label>
                                    <span className="dot" style={{visibility:"hidden"}} id="sms-delivered"></span>
                                    <label className="sms-delivered-label">delivered</label>
                                    {/* <span className="dot" style={{visibility:"hidden"}} id="sms-read"></span>
                                    <label className="sms-read-label">read</label> */}
                                    <span className="dot" style={{visibility:"hidden"}} id="sms-failed"></span>
                                    <label className="sms-failed-label">failed</label>
                                </span>
                           </div>
                           <div className="row" id="whatsapp-pusher-div">
                                <span>
                                    <label>Whatsapp</label>
                                    <span className="dot" style={{visibility:"hidden"}} id="whatsapp-sent"></span>
                                    <label className="whatsapp-sent-label">sent</label>
                                    <span className="dot" style={{visibility:"hidden"}} id="whatsapp-delivered"></span>
                                    <label className="whatsapp-delivered-label">delivered</label>
                                    <span className="dot" style={{visibility:"hidden"}} id="whatsapp-read"></span>
                                    <label className="whatsapp-read-label">read</label>
                                    <span className="dot" style={{visibility:"hidden"}} id="whatsapp-failed"></span>
                                    <label className="whatsapp-failed-label">failed</label>
                                </span>
                           </div>
                    </div>
                </div>
        </div>
    );
}

export default KarixHome;
