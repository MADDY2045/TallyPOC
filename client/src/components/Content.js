import React from 'react'
import CreateNewTemplate from './CreateNewTemplate';
const Content=(props)=>{
    return (
        <div className="bg">
            <CreateNewTemplate canShow={props.createNew}/>
        </div>
    )
}

export default Content
