import { Link } from "react-router-dom"
import logo from "../assets/favicon-peña.png"
import logout from "../assets/logout.svg"
import menu from "../assets/menu.svg"
import { handleContainer } from "../helpers/handleContainer"

const Nav = ()=> {
    
    return (
        <nav className="p-4 bg-dark text-sm md:text-base">
            <div className="max-w-[1000px] flex items-center justify-between mx-auto relative">
                <img src={logo} alt="" className="w-10 md:w-12"/>
                <div className="flex gap-4 items-center">
                    <Link to="/" className="text-light hidden sm:inline">Inicio</Link>
                    <Link to="/add-member" className="text-light hidden sm:inline">Alta de socio</Link>
                    <Link to="/cards" className="text-light hidden sm:inline">Tarjetas</Link>
                    <Link to="/payments" className="text-light hidden sm:inline">Cuotas</Link>
                    <img id="icon-menu" src={menu} className="w-5 sm:hidden cursor-pointer" onClick={()=> handleContainer("menu-mobile", "icon-menu")}/>
                    <Link to="/logout" className="text-light"><img src={logout} className="w-5"/></Link>
                </div>
                <div id="menu-mobile" className="absolute sm:hidden hidden -right-4 -left-4 top-14 bg-[#0b0f3cf1] text-light p-2.5 justify-center gap-4 z-50">
                    <Link to="/">Inicio</Link>
                    <Link to="/add-member">Alta de socio</Link>
                    <Link to="/cards">Tarjetas</Link>
                    <Link to="/payments">Cuotas</Link>
                </div>
            </div>
        </nav>
    )
}

export default Nav