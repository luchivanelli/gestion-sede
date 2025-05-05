//Funcion para hacer consultas GET/POST/PUT/DELETE
export const consults = async (route, method = "GET", body = null) => {
    try {
        const token = localStorage.getItem("token");

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? token : ""
            }
        };
        
        // Solo agrega el body si el método lo permite y hay datos
        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }
    
        const response = await fetch(`http://localhost:5000${route}`, options);
    
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    
        const result = await response.json();
        return result;
    
    } catch (error) {
        console.error("Error en consults:", error);
        return null;
    }
};
  