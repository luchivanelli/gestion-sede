import { useEffect, useState } from "react";
import { consults } from "../helpers/consults";
import eye from "../assets/eye.svg"
import { useNavigate } from "react-router-dom";

const Cards = () => {
    const navigate = useNavigate();
    const members = JSON.parse(localStorage.getItem("members") || "[]");
    const [cards, setCards] = useState([]);

    // cargar cards del servidor y guardar en redux
    useEffect(() => {
        const getCards = async () => {
            const cards = await consults("/cards", "GET");
            const cardsWithName = cards.map(card => {
                const cardHolder = members.find(member => member.nro_socio == card.nro_socio);
                return {
                    ...card,
                    nombre_completo: cardHolder ? cardHolder.nombre_completo : "Sin titular",
                };
            });
    
            setCards(cardsWithName);
            localStorage.removeItem("cards");
            localStorage.setItem("cards", JSON.stringify(cardsWithName));
        };
        getCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTypeCard = (type)=> {
        switch (type) {
            case "vd": 
                return "Visa débito"
            case "vc": 
                return "Visa crédito"
            case "mc": 
                return "Mastercard crédito"
            default:
                return "Tarjeta no reconocida"
        }
    }

    return (
        <div className="p-3 text-sm md:text-base lg:px-0 mx-auto max-w-[1000px]">
            <h2 className='text-center p-3 pt-0 text-dark font-bold text-xl'>Gestionar tarjetas</h2>
            <div className="max-h-[400px] overflow-y-auto bg-dark">
                <table className='table-auto border-separate border-spacing-0 w-full text-light'>
                    <thead className="bg-dark sticky top-0 z-10">
                        <tr className="text-center bg-dark">
                            <td className="p-1">Titular</td>
                            <td className="p-1">Tipo de tarjeta</td>
                            <td className="p-1">Nro de tarjeta</td>
                            <td className="p-1"></td>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {cards.map(card => (
                            <tr key={card.id_tarjeta} className={`text-center ${members.find(member => member.nro_socio == card.nro_socio).id_forma_pago == 3 ? 'bg-primary' : 'line-through bg-[#0b0f3cab]'}`}>
                                <td className="p-1">{card.nombre_completo}</td>
                                <td className="p-1">{handleTypeCard(card.tipo_tarjeta)}</td>
                                <td className="p-1">{`... ${(card.nro_tarjeta).slice(12)}`}</td>
                                <td className="p-1">
                                    <div className="flex justify-center">
                                        <img src={eye} title='Ver información' className='min-w-5 w-5 md:w-6 cursor-pointer' onClick={()=> navigate(`/cards/edit-card/${card.nro_socio}`)}/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center my-3">
                <button type="button" onClick={()=> navigate("/cards/add-card")} className="w-[200px] mx-auto py-1 bg-dark text-light rounded">+ Añadir nueva tarjeta</button>
            </div>
            <p className='mb-3 text-dark'>*Cuando una tarjeta posee diseño de tachado, significa que actualmente el socio cuenta con otro medio de pago <b>distinto a débito automático</b></p>
        </div>
    );
};


export default Cards