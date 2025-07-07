import React, { useState, useRef, useEffect } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { FiUser } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const sidebarRef = useRef(null);

	// Cerrar al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setCollapsed(true);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="flex min-h-screen">
			<AnimatePresence>
				<motion.aside
					ref={sidebarRef}
					key="sidebar"
					initial={{ width: collapsed ? 80 : 256 }}
					animate={{ width: collapsed ? 80 : 256 }}
					exit={{ width: 0, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="bg-gradient-to-b from-red-700 to-red-500 text-white p-4 shadow-lg relative z-10 overflow-hidden">
					{/* Botón toggle */}
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="text-white mb-6 focus:outline-none hover:text-gray-200 transition"
						title="Expandir / Contraer">
						<FaBars size={20} />
					</button>

					{/* Usuario */}
					<div className="flex items-center gap-2 mb-8 cursor-default">
						<FiUser size={24} />
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: collapsed ? 0 : 1 }}
							transition={{ duration: 0.3 }}
							className={`${
								collapsed ? "hidden" : "flex"
							} flex-col leading-tight`}>
							<span className="font-semibold text-md">Usuario</span>
							<span className="text-sm text-white/80">Admin</span>
						</motion.div>
					</div>

					{/* Operaciones */}
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
							{[
								{ path: "/materias", label: "Materias" },
								{ path: "/addMat", label: "Alta de Materia" },
								{ path: "/modMat", label: "Modificación de Materia" },
							].map(({ path, label }, idx) => (
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

			<main className="flex-1 bg-gradient-to-r from-black  to-gray-800 p-8 overflow-y-auto">
				{children}
			</main>
		</div>
	);
};

export default Layout;
