import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { deactivateMember, setMembers } from '../store/features/membersSlice';
import { toast, Toaster } from 'sonner'
import { consults } from '../helpers/consults';
import { handleContainer } from '../helpers/handleContainer';
import eye from "../assets/eye.svg"
import trash from "../assets/trash.svg"
import check from "../assets/check.svg"

//Funcion para parsear el token
const parseJwt = (token) => {
    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    return null;
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const members = useSelector(state => state.members);
  const payments = useSelector(state => state.payments)
  const [membersSearch, setMembersSearch] = useState(members);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState("socio");
  const [searchTerm, setSearchTerm] = useState("");

  // Carga inicial y autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const parsed = parseJwt(token);

      if (parsed && parsed.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        const members = await consults("/", "GET");
        localStorage.removeItem("members");
        localStorage.setItem("members", JSON.stringify(members));
        dispatch(setMembers(members))

        const payments = await consults("/payments", "GET");
        localStorage.removeItem("payments");
        localStorage.setItem("payments", JSON.stringify(payments))
      } else {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, dispatch]);

  // filtro + búsqueda + ordenamiento
  useEffect(() => {
    let filtered = [...members];

    // Filtro
    if (selectedFilter === "active") {
      filtered = filtered.filter(m => m.estado === 1);
    } else if (selectedFilter === "inactive") {
      filtered = filtered.filter(m => m.estado === 0);
    }

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.nombre_completo.toLowerCase().includes(searchTerm) ||
        m.dni.toString().includes(searchTerm)
      );
    }

    // Ordenamiento
    if (selectedOrder === "abc") {
      filtered.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
    } else if (selectedOrder === "socio") {
      filtered.sort((a, b) => a.nro_socio - b.nro_socio);
    }

    setMembersSearch(filtered);
  }, [members, selectedFilter, searchTerm, selectedOrder]);

  // Activar/desactivar socios
  const handleState = async (member) => {
    await consults(`/${member.nro_socio}`, "PUT", { estado: !member.estado });
    dispatch(deactivateMember({ nro_socio: member.nro_socio, estado: !member.estado }));

    const members = await consults("/", "GET");
    localStorage.setItem("members", JSON.stringify(members));

    toast.success(member.estado ? "Socio desactivado correctamente" : "Socio activado correctamente", {
      style: { backgroundColor: "#0b0f3c", color: "#e0e0e0", fontSize: "14px" }
    });
  };

  const handleFilters = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePayments = (member) => {
    if (payments && member.estado) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const formatted = `${year}-${month}`
      const paymentMember = payments.filter(payment => payment.nro_socio == member.nro_socio)
      if (paymentMember.find(p => p.fecha == formatted)) {
        return "Al día"
      } else {
        return "En deuda"
      }
    }
  }

  const confirmToast = (member, action) =>
    toast.custom((t) => (
      <div className="bg-[#0b0f3c] text-[#e0e0e0] w-full text-xs md:text-[13px] px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-sm">
        <div>
          <p className="font-medium text-[13px] md:text-sm">
            ¿Está seguro de {action === "activar" ? "activar" : "desactivar"} al socio/a "{member.nombre_completo}"?
          </p>
        </div>
        <div className="ml-4 flex flex-col gap-2 w-[140px]">
          <button
            className="bg-[#e0e0e0] text-[#0b0f3c] px-3 py-1 rounded-md font-semibold hover:bg-[#d5d5d5] transition"
            onClick={() => {
              handleState(member);
              toast.dismiss(t.id);
            }}
          >
            Confirmar
          </button>
          <button
            className="text-[#e0e0e0] border border-[#e0e0e0] px-3 py-1 rounded-md font-semibold hover:bg-[#1b1f4c] transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </div>
  ));

  return (
    <>
      {isAuthenticated ? (
        <main className='p-3 text-sm md:text-base lg:px-0 mx-auto max-w-[1000px]'>
          <h2 className='text-center p-3 pt-0 text-dark font-bold text-xl border-b-1'>Listado de socios</h2>
          <div className='flex justify-between items-center w-full relative pt-3'>
            <button id='icon-filter' onClick={() => handleContainer("filters-container", "icon-filter")} className='rounded bg-primary text-light !text-xs md:!text-sm py-1 px-2'>Filtros</button>
            <div className='space-x-2'>
              <label htmlFor="search" className="mb-1 font-medium text-dark">Buscar:</label>
              <input type="text" name='search' onChange={handleSearch} className='w-[200px] px-2 py-1 border rounded' />
            </div>
            <div id='filters-container' className="absolute hidden top-7 p-4 bg-white border-1 border-[#0b0f3cc7] rounded shadow">
              <div className="flex flex-col gap-2 text-[13px]">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="filtros" value="active" onChange={handleFilters} className="accent-[#0b0f3cc7]" />
                  <span className='pl-1 text-dark'>Socios activos</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="filtros" value="inactive" onChange={handleFilters} className="accent-[#0b0f3cc7]" />
                  <span className='pl-1 text-dark'>Socios inactivos</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="filtros" value="all" onChange={handleFilters} className="accent-[#0b0f3cc7]" />
                  <span className='pl-1 text-dark'>Todos</span>
                </label>
              </div>
            </div>
          </div>

          <div className='flex py-2 gap-2 items-center justify-end text-dark'>
            <p>Ordenar por:</p>
            <button className={`border-1 border-[#0b0f3c] !text-xs md:!text-sm py-1 px-2 rounded ${selectedOrder === "socio" ? "bg-[#0b0f3cc7] text-light" : ""}`} onClick={() => setSelectedOrder("socio")}>Nro socio</button>
            <button className={`border-1 border-[#0b0f3c] !text-xs md:!text-sm py-1 px-2 rounded ${selectedOrder === "abc" ? "bg-[#0b0f3cc7] text-light" : ""}`} onClick={() => setSelectedOrder("abc")}>Abc</button>
          </div>

          <div className="max-h-[400px] overflow-y-auto bg-dark">
            <table className='table-auto border-separate border-spacing-0 w-full text-light'>
              <thead className="bg-dark sticky top-0 z-10">
                <tr className="text-center">
                  <th className="p-1">Socio</th>
                  <th className="p-1">Nombre</th>
                  <th className="p-1">DNI</th>
                  <th className="p-1">Estado</th>
                  <th className="p-1"></th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {membersSearch.map(member => (
                  <tr
                    key={member.nro_socio}
                    className={`text-center ${member.estado ? 'bg-primary' : 'line-through bg-[#0b0f3cab]'}`}
                  >
                    <td className="p-1">{member.nro_socio}</td>
                    <td className="p-1">{member.nombre_completo}</td>
                    <td className="p-1">{member.dni}</td>
                    <td className="p-1">{member && handlePayments(member)}</td>
                    <td className="p-1">
                      <div className="flex justify-center items-center gap-2">
                        <Link to={`/edit-member/${member.nro_socio}`}>
                          <img src={eye} title='Ver información' className='min-w-5 w-5 md:w-6' />
                        </Link>
                        <img
                          src={trash}
                          title='Desactivar socio'
                          className={`min-w-5 w-5 md:w-6 cursor-pointer ${!member.estado ? "hidden" : ""}`}
                          onClick={() => confirmToast(member, "desactivar")}
                        />
                        <img
                          src={check}
                          title='Activar socio'
                          className={`min-w-5 w-5 md:w-6 cursor-pointer ${member.estado ? "hidden" : ""}`}
                          onClick={() => confirmToast(member, "activar")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className='my-3 text-dark'>*Cuando un socio posee diseño de tachado, significa que actualmente se encuentra <b>inactivo</b></p>
        </main>
      ) : null}
      <Toaster richColors />
    </>
  );
};

export default Home;
