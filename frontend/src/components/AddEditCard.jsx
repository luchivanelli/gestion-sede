import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast, Toaster } from 'sonner'
import { useNavigate } from "react-router-dom"
import { consults } from "../helpers/consults"
import { useDispatch } from "react-redux"
import { editCard, addCard } from "../store/features/cardsSlice"
import InputSelect from "./InputSelect"

const AddEditCard = ()=> {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const cards = JSON.parse(localStorage.getItem("cards"))
    const members = JSON.parse(localStorage.getItem("members"))
    const [card, setCard] = useState({
        id_tarjeta: 0,
        nro_socio: 0,
        nombre_completo: "",
        tipo_tarjeta: "",
        nro_tarjeta: "",
        vencimiento: "",
        cod_seguridad: ""
    })
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            const card = cards.find(card => card.nro_socio == id);
            if (card) {
                setCard(card);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const membersOptions = members
        .filter(member => !cards.find(card => card.nro_socio == member.nro_socio))
        .map(member => ({
            value: member.nro_socio,
            label: member.nombre_completo
        }));

    const typeCardOptions = [
        {value: "vc", label:"Visa crédito"},
        {value: "vd", label:"Visa débito"},
        {value: "mc", label:"Mastercard crédito"}
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCard((prev) => ({
            ...prev,
            [name]: name === "nro_socio" || name === "cod_seguridad" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
            e.preventDefault();     
            const newErrors = {};
    
            // validacion de formatos
            const regexNumberCard = /^\d{16}$/;
            if (!regexNumberCard.test(card.nro_tarjeta)) newErrors.nro_tarjeta = "Formato incorrecto.";

            const regexExpiration = /^\d{2}\/\d{2}$/;
            if (!regexExpiration.test(card.vencimiento)) newErrors.vencimiento = "Formato incorrecto.";

            const regexCode = /^\d{4}$/;
            if (!regexCode.test(card.cod_seguridad)) newErrors.cod_seguridad = "Formato incorrecto.";

            // validacion de campos incompletos
            if (!card.nombre_completo) newErrors.nombre_completo = "El titular es obligatorio.";
            if (!card.tipo_tarjeta) newErrors.tipo_tarjeta = "El tipo de tarjeta es obligatorio.";
            if (!card.nro_tarjeta.trim()) newErrors.nro_tarjeta = "El número de tarjeta es obligatorio.";
            if (!card.vencimiento.trim()) newErrors.vencimiento = "El vencimiento es obligatorio.";
            if (!card.cod_seguridad) newErrors.cod_seguridad = "El código de seguridad es obligatorio.";
    
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            console.log(card)
    
            // si pasa la validación:
            setErrors({});
            if (id) {
                await consults(`/cards/edit-card/${card.id_tarjeta}`, "PATCH", card); // guardar en backend 
                dispatch(editCard(card)) // actualizar store local
                toast.success("Tarjeta actualizada correctamente. Redirigiendo a la sección 'Tarjetas'", {
                    style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
                })
            } else {
                await consults("/cards/add-card", "POST", card); // guardar en backend 
                dispatch(addCard(card)); // actualizar store local
                toast.success("Tarjeta agregada correctamente. Redirigiendo a la sección 'Tarjetas'", {
                    style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
                })
            }
            setTimeout(()=> {
                navigate("/cards")
            }, 4500)
        };

    return (
        <div className="text-sm md:text-base">
            <form onSubmit={handleSubmit} className="max-w-[1000px] lg:mx-auto bg-dark m-3 p-3 text-light rounded grid grid-cols-2 gap-2">
                <h2 className="text-base md:text-lg title font-medium text-secondary col-span-2">{id ? "Editar tarjeta" : "Agregar nueva tarjeta"}</h2>
                <div className={`col-span-2 ${id ? "" : "hidden"}`}>
                    <label htmlFor="nombre_completo" className="block mb-1 font-medium ">Titular <span className="text-secondary">*</span></label>
                    <input type="text" name="nombre_completo" value={card.nombre_completo} disabled onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.nombre_completo && (<p className="text-secondary text-xs mt-1">{errors.nombre_completo}</p>)}
                </div>
                <div className={`col-span-2 ${id ? "hidden" : ""}`}>
                    <label htmlFor="nombre_completo" className="block mb-1 font-medium ">Titular <span className="text-secondary">*</span></label>
                    <InputSelect options={membersOptions} value={membersOptions.find(opt => opt.value === card.nombre_completo)} onChange={handleChange} name="nombre_completo"/>
                    {errors.nombre_completo && (<p className="text-secondary text-xs mt-1">{errors.nombre_completo}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="tipo_tarjeta" className="block mb-1 font-medium ">Tipo de tarjeta <span className="text-secondary">*</span></label>
                    <InputSelect options={typeCardOptions} value={typeCardOptions.find(opt => opt.value === card.tipo_tarjeta)} onChange={handleChange} name="tipo_tarjeta"/>
                    {errors.tipo_tarjeta && (<p className="text-secondary text-xs mt-1">{errors.tipo_tarjeta}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="nro_tarjeta" className="block mb-1 font-medium ">Nro de tarjeta <span className="text-secondary">*</span></label>
                    <input type="number" name="nro_tarjeta" value={card.nro_tarjeta} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.nro_tarjeta && (<p className="text-secondary text-xs mt-1">{errors.nro_tarjeta}</p>)}
                </div>
                <div className="col-span-1">
                    <label htmlFor="vencimiento" className="block mb-1 font-medium ">Vencimiento <span className="text-secondary">*</span></label>
                    <input type="text" name="vencimiento" value={card.vencimiento} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.vencimiento && (<p className="text-secondary text-xs mt-1">{errors.vencimiento}</p>)}
                </div>
                <div className="col-span-1">
                    <label htmlFor="cod_seguridad" className="block mb-1 font-medium ">Código de seguridad <span className="text-secondary">*</span></label>
                    <input type="text" name="cod_seguridad" value={card.cod_seguridad} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.cod_seguridad && (<p className="text-secondary text-xs mt-1">{errors.cod_seguridad}</p>)}
                </div>
                <div className="col-span-2 flex w-full !mt-2 mb-1 gap-3">
                    <button type="button" className="text-center py-1 bg-[#e0e0e0] rounded text-dark font-bold w-full" onClick={()=> navigate("/cards")}>Cancelar</button>
                    <button type="submit" className="text-center py-1 bg-[#e0e0e0] rounded text-dark font-bold w-full">Guardar</button>
                </div>
            </form>
            <Toaster richColors/>
        </div>
    )
}

export default AddEditCard