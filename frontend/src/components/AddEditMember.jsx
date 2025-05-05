import { addMember, editMember } from "../store/features/membersSlice.js"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import InputSelect from "./InputSelect.jsx"
import { useNavigate, useParams } from "react-router-dom"
import { consults } from "../helpers/consults.js"
import { toast, Toaster } from 'sonner'

const AddEditMember = ()=> {
    const members = useSelector(state => state.members)
    const memberNumber = members.length + 1
    const [member, setMember] = useState({
        nro_socio: memberNumber,
        nombre_completo: "",
        dni: "",
        direccion: "",
        ciudad: "",
        id_forma_pago: 0,
        estado: ""
    })
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch()
    const navigate = useNavigate();

    // verificamos si se está editando un socio
    const { id } = useParams()
    useEffect(() => {
        if (id) {
          const memberEdit = members.find(member => member.nro_socio == id);
          if (memberEdit) {
            setMember(memberEdit);
        }
    } else {
        setMember({
                nro_socio: memberNumber,
                nombre_completo: "",
                dni: "",
                direccion: "",
                ciudad: "",
                id_forma_pago: 0,
                estado: ""
            })
        }
    }, [id, members, memberNumber]);

    const cityOptions = [
        {value: "Arroyo Seco", label:"Arroyo Seco"},
        {value: "Fighiera", label:"Fighiera"},
        {value: "General Lagos", label:"General Lagos"},
        {value: "Pavón", label:"Pavón"},
        {value: "Empalme", label:"Empalme"},
        {value: "Villa Constitucion", label:"Villa Constitucion"},
        {value: "San Nicolás", label:"San Nicolás"},
        {value: "Pueblo Esther", label:"Pueblo Esther"},
        {value: "Alvear", label:"Alvear"},
        {value: "Villa Gobernador Gálvez", label:"Villa Gobernador Gálvez"},
        {value: "Rosario", label:"Rosario"}
    ]

    const paymentOptions = [
        {value: 1, label:"Efectivo"},
        {value: 2, label:"Tranferencia bancaria"},
        {value: 3, label:"Débito automático"}
    ]

    const stateOptions = [{value: 1, label: "Activo"}, {value: 0, label: "Inactivo"}]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember((prev) => ({
            ...prev,
            [name]: name === "nro_socio" || name === "dni" ? Number(value) : value
        }));
    };

    const handleCard = (nro_socio)=> {
        const cards = JSON.parse(localStorage.getItem("cards"))
        const validateCard = cards.find(cards => cards.nro_socio == nro_socio)
        if (validateCard) {
            navigate(`/cards/edit-card/${nro_socio}`)
        } else {
            toast.success("El socio no tiene una tarjeta registrada. Por favor, agregue una nueva.", {
                style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
            })
            setTimeout(()=> {
                navigate(`/cards/add-card`)
            }, 4500)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();     
        const newErrors = {};

        if (!id) {
            const validateDNI = members.find(m => member.dni == m.dni)
            if (validateDNI) newErrors.dni = "Socio existente.";
        }

        // validacion de formatos
        const regexDNI = /^\d{8}$/;
        if (!regexDNI.test(member.dni)) newErrors.dni = "Formato incorrecto.";

        // validacion de campos incompletos
        if (!member.nombre_completo.trim()) newErrors.nombre_completo = "El nombre es obligatorio.";
        if (!member.nro_socio) newErrors.nro_socio = "El número de socio es obligatorio.";
        if (!member.dni) newErrors.dni = "El DNI es obligatorio.";
        if (!member.direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
        if (!member.ciudad) newErrors.ciudad = "La ciudad es obligatoria.";
        if (!member.id_forma_pago) newErrors.id_forma_pago = "El método de pago es obligatorio.";
        if (member.estado === "") newErrors.estado = "El estado es obligatorio.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // si pasa la validación:
        setErrors({});
        if (id) {
            await consults(`/edit-member/${member.nro_socio}`, "PATCH", member); // guardar en backend 
            dispatch(editMember(member)) // actualizar store local
            toast.success("Socio actualizado correctamente. Redirigiendo a la página principal...", {
                style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
            })
        } else {
            await consults("/add-member", "POST", member); // guardar en backend 
            dispatch(addMember(member)); // actualizar store local
            toast.success("Socio agregado correctamente. Redirigiendo a la página principal...", {
                style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
            })
        }
        setTimeout(()=> {
            navigate("/")
        }, 4500)
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="max-w-[1000px] lg:mx-auto bg-dark m-3 p-3 text-light rounded text-sm md:text-base grid grid-cols-2 gap-2">
                <h2 className="text-base md:text-lg title font-medium text-secondary col-span-2">{id ? "Editar socio" : "Alta de socio"}</h2>
                <div className="col-span-2">
                    <label htmlFor="nombre_completo" className="block mb-1 font-medium ">Nombre completo <span className="text-secondary">*</span></label>
                    <input type="text" name="nombre_completo" value={member.nombre_completo} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.nombre_completo && (<p className="text-secondary text-xs mt-1">{errors.nombre_completo}</p>)}
                </div>
                <div className="col-span-1">
                    <label htmlFor="nro_socio" className="block mb-1 font-medium ">Nro socio <span className="text-secondary">*</span></label>
                    <input disabled type="number" name="nro_socio" value={memberNumber} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.nro_socio && (<p className="text-secondary text-xs mt-1">{errors.nro_socio}</p>)}
                </div>
                <div className="col-span-1">
                    <label htmlFor="dni" className="block mb-1 font-medium ">DNI <span className="text-secondary">*</span></label>
                    <input type="number" name="dni" value={member.dni} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.dni && (<p className="text-secondary text-xs mt-1">{errors.dni}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="direccion" className="block mb-1 font-medium ">Dirección <span className="text-secondary">*</span></label>
                    <input type="text" name="direccion" value={member.direccion} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.direccion && (<p className="text-secondary text-xs mt-1">{errors.direccion}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="ciudad" className="block mb-1 font-medium ">Ciudad <span className="text-secondary">*</span></label>
                    <InputSelect options={cityOptions} value={cityOptions.find(opt => opt.value === member.ciudad)} onChange={handleChange} name="ciudad"/>
                    {errors.ciudad && (<p className="text-secondary text-xs mt-1">{errors.ciudad}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="id_forma_pago" className="block mb-1 font-medium ">Método de pago <span className="text-secondary">*</span></label>
                    <InputSelect options={paymentOptions} value={paymentOptions.find(opt => opt.value === member.id_forma_pago)} onChange={handleChange} name="id_forma_pago"/>
                    {errors.id_forma_pago && (<p className="text-secondary text-xs mt-1">{errors.id_forma_pago}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="estado" className="block mb-1 font-medium ">Estado <span className="text-secondary">*</span></label>
                    <InputSelect options={stateOptions} value={stateOptions.find(opt => opt.value === member.estado)} onChange={handleChange} name="estado"/>
                    {errors.estado && (<p className="text-secondary text-xs mt-1">{errors.estado}</p>)}
                </div>
                <div className={`col-span-2 ${member.id_forma_pago == 3 ? "flex" : "hidden"} justify-end gap-3 text-xs md:text-sm !mt-1`}>
                    <button type="button" className="rounded bg-secondary font-bold py-1 px-2 text-dark !mt-1" onClick={()=> navigate(`/payments/${member.nombre_completo}`)}>Administrar cuotas</button>
                    <button type="button" className="rounded bg-secondary font-bold py-1 px-2 text-dark !mt-1" onClick={()=> handleCard(member.nro_socio)}>Administrar tarjeta de debito/credito</button>
                </div>
                <div className="col-span-2 flex w-full !mt-2 mb-1 gap-3">
                    <button type="button" className="text-center py-1 bg-[#e0e0e0] rounded text-dark font-bold w-full" onClick={()=> navigate("/")}>Cancelar</button>
                    <button type="submit" className="text-center py-1 bg-[#e0e0e0] rounded text-dark font-bold w-full">Guardar</button>
                </div>
            </form>
            <Toaster richColors/>
        </div>
    )
}

export default AddEditMember