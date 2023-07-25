import React from 'react';
// import style from './CustomButton.module.css'

type CustomButtonPropsType = {
    className: string
    onClick: () => void
}

export const CustomButton: React.FC<CustomButtonPropsType> = ({className, onClick}) => {
    return (
        <div>
            {/*<button className={style.someStyle}> CustomButton</button>*/}
            <button onClick={onClick} className={className}>Hi!</button>
        </div>
    );
};

