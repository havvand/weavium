
//Maybe implment sidebar later
 import {useState} from "react";

export function Sidebar () {

    const navStyle = {
        background: '#15171c',
        width: '250px',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        transition: 305,
        zIndex: 1000,
        left: ({ sidebar }) => (sidebar ? "0" : "-100%")
    }

     const Sidebar = () => {
         const [sidebar, setSidebar] = useState(false);

         const showSidebar = () => setSidebar(!sidebar);
     }


    return (
        <nav style={navStyle} >

        </nav>

    );
}

