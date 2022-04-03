import React from 'react';
import InputWrapper from './InputWrapper';
import Image from './image';



export default function Header(props) {
    return (
        
        <header>
            <Image {...props}/>
            <h1>Things To Do</h1>
            <InputWrapper {...props}/>
           
          
        </header>
    );
}
