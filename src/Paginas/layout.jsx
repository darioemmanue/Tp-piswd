import React, { useState, useRef, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { GrDocumentConfig } from "react-icons/gr";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { obtenerUsuario, guardarUsuario } from "../scripts/materias.js";

const Layout = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const sidebarRef = useRef(null);

	const [usuario, setUsuario] = useState(null); // null mientras carga

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setCollapsed(true);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);

		async function cargarUsuario() {
			let user = obtenerUsuario();
			if (!user) {
				// Si no hay en localStorage, traemos de archivo
				try {
					const res = await fetch("/BaseDeDatos/base.json");
					if (!res.ok) throw new Error("Error cargando base.json");
					const data = await res.json();
					const usuario1 = data.usuarios.find((u) => u.id === 1);
					if (usuario1) {
						guardarUsuario(usuario1);
						setUsuario(usuario1);
						return;
					}
				} catch (e) {
					console.error(e);
				}
				setUsuario({ nombre: "Invitado", rol: "" });
			} else {
				setUsuario(user);
			}
		}

		cargarUsuario();

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const menuItems = [
		{ path: "/", label: "Materias" },
		{ path: "/materias", label: "Listado de Materias" },
		{ path: "/addMat", label: "Nueva Materia" },
	];

	if (!usuario) {
		// Mientras carga usuario
		return (
			<div className="flex min-h-screen justify-center items-center text-white bg-black">
				Cargando usuario...
			</div>
		);
	}

	return (
		<div className="flex min-h-screen">
			<AnimatePresence>
				<motion.aside
					ref={sidebarRef}
					key="sidebar"
					initial={{ width: collapsed ? 80 : 256 }}
					animate={{ width: collapsed ? 80 : 256 }}
					exit={{ width: 0, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="bg-gradient-to-b from-red-700 to-red-500 text-white p-4 shadow-lg relative z-10 overflow-hidden">
					{/* Botón toggle */}
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="text-white mb-6 focus:outline-none hover:text-gray-200 transition"
						aria-label="Expandir o contraer menú"
						title="Expandir / Contraer">
						<FaBars size={20} />
					</button>

					{/* Sección de Usuario */}
					<div className="flex items-center gap-2 mb-8 cursor-default">
						<FiUser size={24} />
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: collapsed ? 0 : 1 }}
							transition={{ duration: 0.3 }}
							className={`${
								collapsed ? "hidden" : "flex"
							} flex-col leading-tight`}>
							<span className="font-semibold text-md">{usuario.nombre}</span>
							<span className="text-sm text-white/80">{usuario.rol}</span>
						</motion.div>
					</div>

					{/* Menú de navegación */}
					<div>
						<div className="flex items-center gap-2 mb-4 cursor-default">
							<GrDocumentConfig size={22} />
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: collapsed ? 0 : 1 }}
								transition={{ duration: 0.3 }}
								className={`${
									collapsed ? "hidden" : "block"
								} text-lg font-semibold`}>
								Operaciones
							</motion.span>
						</div>

						<ul className="ml-1 space-y-3 text-sm">
							{menuItems.map(({ path, label }, idx) => (
								<li key={idx}>
									<Link
										to={path}
										className="flex items-center gap-2 hover:underline hover:text-white/90 transition">
										{!collapsed && (
											<motion.span
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.3 }}>
												{label}
											</motion.span>
										)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</motion.aside>
			</AnimatePresence>

			{/* Contenido principal */}
			<main className="flex-1 bg-gradient-to-r from-black to-gray-800 p-8 overflow-y-auto text-white">
				{children}
			</main>
		</div>
	);
};

export default Layout;
