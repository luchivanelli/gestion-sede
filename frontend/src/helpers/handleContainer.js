export const handleContainer = (id, iconId) => {
    const container = document.getElementById(id);
    const icon = document.getElementById(iconId)

    // const isHidden = container.classList.contains("hidden");
    container.classList.toggle("hidden");

    if (id == "menu-mobile") {
        container.classList.toggle("flex");
    }

    window.addEventListener("click", (e)=> {
        if (e.target != container && e.target != icon) {
            container.classList.add("hidden")
            container.classList.remove("flex")
        }
    })
};

// Solo agregar el listener si lo vamos a mostrar
// if (isHidden) {
//     const handleClickOutside = (e) => {
//         if (!container.contains(e.target)) {
//             container.classList.add("hidden");
//             if (id == "menu-mobile") {
//                 container.classList.remove("flex");
//             }
//             document.removeEventListener("click", handleClickOutside);
//         }
//     };

//     // Timeout evita que el click que abre lo cierre instantáneamente
//     setTimeout(() => {
//         document.addEventListener("click", handleClickOutside);
//     }, 0);
// }