import React, { FC } from "react";

interface HeaderProps{
    title: string
}
const Header: FC<HeaderProps> = ({ title }) => {
    return(
        <div>
            <h1 className="text-5xl font-bold">{title}</h1>
        </div>
    )
}

export default Header