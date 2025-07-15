"use client";

import { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { LuBookX } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import "./styles/globals.css";

export default function RootLayout({ children }) {
	const [usuario, setUsuario] = useState(null);

	useEffect(() => {
		fetch("/api/materias")
			.then((res) => res.json())
			.then((data) => {
				// Suponemos que usuarios es un array, tomamos el primero:
				if (data.usuarios && data.usuarios.length > 0) {
					setUsuario(data.usuarios[0]);
				}
			})
			.catch((error) => {
				console.error("Error al cargar usuarios:", error);
			});
	}, []);

	return (
		<html lang="en">
			<body className="antialiased bg-gray-50">
				{/* Sidebar fijo */}
				<aside className="fixed top-0 left-0 h-full w-56 bg-gray-100 border-r p-4 flex flex-col justify-between shadow z-50">
					<div>
						<h2 className="flex items-center text-lg font-semibold text-gray-800 mt-10">
							<FaUser className="mr-2" />
							{usuario ? usuario.nombre : ""}
						</h2>
						<p className="text-sm text-gray-500">
							Rol: {usuario ? usuario.rol : "-"}
						</p>
					</div>

					<nav className="mt-10 flex flex-col gap-2">
						<a
							href="/"
							className="flex items-center text-gray-700 hover:text-black transition-transform transform hover:scale-105">
							<FaBook className="mr-2" />
							Materia
						</a>
						<a
							href="/materias/listado"
							className="flex items-center text-gray-700 hover:text-black transition-transform transform hover:scale-105">
							<MdOutlineLibraryBooks className="mr-2" />
							Listado De Materias
						</a>
						<a
							href="/materias/modificar"
							className="flex items-center text-gray-700 hover:text-black transition-transform transform hover:scale-105">
							<LuNotebookPen className="mr-2" />
							Modificar Materia
						</a>
						<a
							href="/materias/eliminar"
							className="flex items-center text-gray-700 hover:text-black transition-transform transform hover:scale-105">
							<LuBookX className="mr-2" /> Eliminar Materia
						</a>
					</nav>
				</aside>

				{/* Contenido principal */}
				<div className="pl-56">{children}</div>
			</body>
		</html>
	);
}
