import { useState } from "react";
import InputSelect from "./InputSelect";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner'
import { consults } from "../helpers/consults";
import { useDispatch } from "react-redux";
import { addPayment } from "../store/features/paymentsSlice";

const AddPayment = ()=> {
    const members = JSON.parse(localStorage.getItem("members"))
    const payments = JSON.parse(localStorage.getItem("payments"))
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({});
    const [payment, setPayment] = useState({
        nombre_completo: "",
        fecha: "",
        monto: ""       
    })

    const membersOptions = members.map(member => ({
        value: member.nro_socio,
        label: member.nombre_completo
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({
            ...prev,
            [name]: name === "nombre_completo" || name === "cod_seguridad" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e)=> {
        e.preventDefault();     
        const newErrors = {};

        // validacion de campos incompletos
        if (!payment.nombre_completo) newErrors.nombre_completo = "El nombre es obligatorio.";
        if (!payment.fecha) newErrors.fecha = "La fecha es obligatoria.";
        if (!payment.monto.trim()) newErrors.monto = "El monto es obligatorio.";

        if (payments.find(p => p.fecha == payment.fecha && p.nro_socio == payment.nombre_completo)) newErrors.fecha = "El socio ya tiene registrado un pago en esta fecha."

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // si pasa la validación:
        setErrors({});
        await consults("/payments/add-payment", "POST", payment); // guardar en backend 
        dispatch(addPayment(payment)) // actualizar store local
        toast.success("Pago de cuota registrado correctamente. Redirigiendo a la sección 'Cuotas'", {
            style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
        })
        setTimeout(()=> {
            navigate(`/payments`)
        }, 4500)
    }

    return (
        <div className="text-sm md:text-base">
            <form onSubmit={handleSubmit} className="max-w-[1000px] lg:mx-auto bg-dark m-3 p-3 text-light rounded grid grid-cols-2 gap-2">
            <h2 className="text-base md:text-lg title font-medium text-secondary col-span-2">Registrar cuota</h2>
                <div className="col-span-2">
                    <label htmlFor="nombre_completo" className="block mb-1 font-medium ">Nombre completo <span className="text-secondary">*</span></label>
                    <InputSelect options={membersOptions} value={membersOptions.find(opt => opt.value === payment.nombre_completo)} onChange={handleChange} name="nombre_completo"/>
                    {errors.nombre_completo && (<p className="text-secondary text-xs mt-1">{errors.nombre_completo}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="fecha" className="block mb-1 font-medium ">Fecha <span className="text-secondary">*</span></label>
                    <input type="month" name="fecha" value={payment.fecha} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.fecha && (<p className="text-secondary text-xs mt-1">{errors.fecha}</p>)}
                </div>
                <div className="col-span-2">
                    <label htmlFor="monto" className="block mb-1 font-medium ">Monto <span className="text-secondary">*</span></label>
                    <input type="number" name="monto" value={payment.monto} onChange={handleChange} className="w-full px-2 py-1 border rounded h-[37px]"/>
                    {errors.monto && (<p className="text-secondary text-xs mt-1">{errors.monto}</p>)}
                </div>
                <div className="col-span-2 flex w-full !mt-2 mb-1 gap-3">
                    <button type="button" className="text-center py-1 bg-[#e0e0e0] rounded text-dark font-bold w-full" onClick={()=> navigate("/payments")}>Cancelar</button>
                    <button type="submit" className="text-center py-1 bg-[#e0e0e0] rounded text-dark font-bold w-full">Guardar</button>
                </div>
            </form>
            <Toaster richColors/>
        </div>
    )
}

export default AddPayment