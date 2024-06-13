import React from 'react'

interface HeaderProps {
    content : string;
    icon ?: React.ReactElement;
    center ?: boolean
}

const Header : React.FC<HeaderProps> = ({content,icon,center=false}) => {
  return (
    <div className={`w-full flex ${center && 'justify-center'} items-center gap-3`}>
            {icon ? icon  : null}
            <h1 className='h1-bold'>{content}</h1>
    </div>
  )
}

export default Header