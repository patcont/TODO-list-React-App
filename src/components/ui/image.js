import React from 'react';
import batman from './batman-thinking.gif'


function Image(){

    return(

        <div className="gif">
            <img src={batman} alt="batman" width="200px"/>
        </div>
    )
}


export default Image;