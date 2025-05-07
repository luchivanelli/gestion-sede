import { useEffect, useState } from "react"
import { consults } from "../helpers/consults";
import trash from "../assets/trash.svg"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deletePayment } from "../store/features/paymentsSlice";
import { useDispatch } from "react-redux";
import { toast, Toaster } from 'sonner'

const Payments = ()=> {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const members = JSON.parse(localStorage.getItem("members"))
    const [paymentsSearch, setPaymentsSearch] = useState(members);
    const [payments, setPayments] = useState([])
    const [selectedOrder, setSelectedOrder] = useState("fecha");
    const [searchTerm, setSearchTerm] = useState("");

    // cargar cuotas del servidor y guardar en redux
    useEffect(() => {
        const getPayments = async () => {
            const payments = await consults("/payments", "GET");
            localStorage.removeItem("payments");
            localStorage.setItem("payments", JSON.stringify(payments))
            const paymentsWithName = payments.map(payment => {
                const paymentHolder = members.find(member => member.nro_socio == payment.nro_socio);
                return {
                    ...payment,
                    nombre_completo: paymentHolder ? paymentHolder.nombre_completo : "",
                };
            });
    
            setPayments(paymentsWithName);

            const name = id
            name && setSearchTerm(name.toLowerCase())
        };
        getPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // búsqueda + ordenamiento
    useEffect(() => {
        let filtered = [...payments];
        // Búsqueda
        if (searchTerm) {
        filtered = filtered.filter(m =>
            m.nombre_completo.toLowerCase().includes(searchTerm) ||
            m.fecha.includes(searchTerm)
        );
        }

        // Ordenamiento
        if (selectedOrder === "socio") {
            filtered.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
        } else if (selectedOrder === "fecha") {
            filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        }

        setPaymentsSearch(filtered);
    }, [payments, searchTerm, selectedOrder, id]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleDelete = async (payment)=> {
        consults(`/payments/${payment.id_cuota}`, "DELETE")
        dispatch(deletePayment(payment))

        setPayments(prev => prev.filter(p => p.id_cuota !== payment.id_cuota));

        toast.success("Cuota eliminada exitosamente", {
            style : {backgroundColor: "#0b0f3c", color : "#e0e0e0"}
        })
    }

    const confirmToast = (payment) =>
        toast.custom((t) => (
          <div className="bg-[#0b0f3c] text-[#e0e0e0] w-full text-xs md:text-[13px] px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-sm">
            <div>
              <p className="font-medium text-[13px] md:text-sm">
                ¿Está seguro de eliminar la cuota "{payment.fecha}" del socio {payment.nombre_completo}?
              </p>
            </div>
            <div className="ml-4 flex flex-col gap-2 w-[140px]">
              <button
                className="bg-[#e0e0e0] w-[85px] text-[#0b0f3c] px-3 py-1 rounded-md font-semibold hover:bg-[#d5d5d5] transition"
                onClick={() => {
                  handleDelete(payment)
                  toast.dismiss(t.id);
                }}
              >
                Confirmar
              </button>
              <button
                className="text-[#e0e0e0] w-[85px] border border-[#e0e0e0] px-3 py-1 rounded-md font-semibold hover:bg-[#1b1f4c] transition"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancelar
              </button>
            </div>
          </div>
    ));

    return (
        <div className="p-3 text-sm md:text-base lg:px-0 mx-auto max-w-[1000px]">
            <h2 className='text-center p-3 pt-0 text-dark font-bold text-xl border-b-1'>Gestionar cuotas</h2>
            <div className="flex flex-col justify-between items-center py-3 md:flex-row">
                <div className='flex py-2 gap-2 items-center justify-end text-dark'>
                    <p>Ordenar por:</p>
                    <button className={`border-1 border-[#0b0f3c] !text-xs md:!text-sm py-1 px-2 rounded ${selectedOrder === "socio" ? "bg-[#0b0f3cc7] text-light" : ""}`} onClick={() => setSelectedOrder("socio")}>Socio</button>
                    <button className={`border-1 border-[#0b0f3c] !text-xs md:!text-sm py-1 px-2 rounded ${selectedOrder === "fecha" ? "bg-[#0b0f3cc7] text-light" : ""}`} onClick={() => setSelectedOrder("fecha")}>Fecha</button>
                </div>
                <div className='space-x-2'>
                    <label htmlFor="search" className="mb-1 font-medium text-dark">Buscar:</label>
                    <input type="text" name='search' onChange={handleSearch} value={searchTerm} className='w-[200px] px-2 py-1 border rounded' />
                </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto bg-dark">
                <table className='table-auto border-separate border-spacing-0 w-full text-light'>
                    <thead className="bg-dark sticky top-0 z-10">
                        <tr className="text-center">
                            <td className="p-1">Nombre completo</td>
                            <td className="p-1">Fecha</td>
                            <td className="p-1">Monto</td>
                            <td className="p-1"></td>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {paymentsSearch.map(payment => (
                            <tr key={payment.id_cuota} className="text-center bg-primary">
                                <td className="p-1">{members.find(member => member.nro_socio == payment.nro_socio).nombre_completo}</td>
                                <td className="p-1">{payment.fecha}</td>
                                <td className="p-1">{`$${payment.monto}`}</td>
                                <td className="p-1">
                                    <div className="flex justify-center">
                                        <img src={trash} title='Ver información' className='min-w-5 w-5 md:w-6 cursor-pointer' onClick={()=> confirmToast(payment)}/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center my-3">
                <button type="button" onClick={()=> navigate("/payments/add-payment")} className="w-[200px] mx-auto py-1 bg-dark text-light rounded">+ Registrar cuota</button>
            </div>
            <Toaster richColors />
        </div>
    )
}

export default Payments