import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { motion } from "framer-motion";

export default function Materias() {
	const [materias, setMaterias] = useState([]);
	const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
	const [archivos, setArchivos] = useState({}); // { tipo: [{ nombre, data }] }
	const [archivo, setArchivo] = useState({ nombre: "", tipo: "", file: null });

	// Cargar materias y archivos desde localStorage
	useEffect(() => {
		const almacenadas = localStorage.getItem("materias");
		if (almacenadas) {
			const parsed = JSON.parse(almacenadas);
			setMaterias(parsed);
			setMateriaSeleccionada(parsed[0]);
		} else {
			fetch("/BaseDeDatos/base.json")
				.then((res) => {
					if (!res.ok) throw new Error("No se pudo cargar el archivo");
					return res.json();
				})
				.then((data) => {
					if (data.materias) {
						localStorage.setItem("materias", JSON.stringify(data.materias));
						setMaterias(data.materias);
						setMateriaSeleccionada(data.materias[0]);
					}
				})
				.catch((err) => console.error("Error al cargar materias:", err));
		}

		// Cargar archivos guardados
		const archivosGuardados = localStorage.getItem("archivos");
		if (archivosGuardados) {
			setArchivos(JSON.parse(archivosGuardados));
		}
	}, []);

	const handleSeleccion = (id) => {
		const materia = materias.find((m) => m.id === parseInt(id));
		setMateriaSeleccionada(materia);
	};

	// Manejar selección de archivo y lectura
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			setArchivo({
				...archivo,
				nombre: file.name,
				file: reader.result, // Base64 con data URL
			});
		};
		reader.readAsDataURL(file);
	};

	// Guardar archivo en estado y localStorage
	const handleArchivoSubmit = (e) => {
		e.preventDefault();
		if (!archivo.nombre || !archivo.tipo || !archivo.file)
			return alert("Completa todos los campos y selecciona un archivo");

		setArchivos((prev) => {
			const updated = { ...prev };
			if (!updated[archivo.tipo]) updated[archivo.tipo] = [];
			updated[archivo.tipo].push({
				nombre: archivo.nombre,
				data: archivo.file,
			});
			// Guardar en localStorage actualizado
			localStorage.setItem("archivos", JSON.stringify(updated));
			return updated;
		});

		setArchivo({ nombre: "", tipo: "", file: null });
		// Limpiar input file manualmente si quieres:
		e.target.reset?.();
	};

	return (
		<Layout>
			<div className="max-w-6xl mx-auto p-6 space-y-12 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white rounded-lg shadow-xl">
				<motion.h1
					className="text-4xl font-extrabold text-center text-purple-400 tracking-widest"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					SECCIÓN DE MATERIAS
				</motion.h1>

				{/* Selector */}
				<motion.div
					className="flex flex-col md:flex-row justify-center items-center gap-4 bg-gray-800 p-6 rounded-xl shadow-md"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}>
					<label
						htmlFor="materia"
						className="text-lg font-semibold text-gray-300">
						Materia:
					</label>
					<select
						id="materia"
						onChange={(e) => handleSeleccion(e.target.value)}
						className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-purple-500">
						{materias.map((m) => (
							<option key={m.id} value={m.id}>
								{m.nombre}
							</option>
						))}
					</select>
				</motion.div>

				{/* Info */}
				{materiaSeleccionada && (
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 p-6 rounded-xl shadow-lg"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}>
						<div className="space-y-4 text-center">
							<h2 className="text-purple-300 text-2xl font-bold">
								{materiaSeleccionada.nombre}
							</h2>
							<img
								src={materiaSeleccionada.logo}
								alt={materiaSeleccionada.nombre}
								className="mx-auto w-32 h-32 rounded-full shadow-lg"
							/>
							<p className="tracking-wider text-gray-300 text-sm">
								{materiaSeleccionada.descripcion}
							</p>
						</div>
						<div>
							<label className="block font-semibold mb-2 text-gray-300">
								Contenidos:
							</label>
							<textarea
								value={materiaSeleccionada.contenidos}
								readOnly
								className="w-full h-48 border border-gray-700 bg-gray-800 text-white p-4 rounded resize-none focus:outline-none"></textarea>
						</div>
					</motion.div>
				)}

				{/* Archivos */}
				<motion.form
					onSubmit={handleArchivoSubmit}
					className="bg-gray-900 p-6 rounded-xl shadow-md space-y-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}>
					<h3 className="text-xl font-semibold text-purple-400">
						Agregar Archivo
					</h3>

					{/* Input tipo file para seleccionar archivo */}
					<input
						type="file"
						onChange={handleFileChange}
						className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>

					<select
						value={archivo.tipo}
						onChange={(e) => setArchivo({ ...archivo, tipo: e.target.value })}
						className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500">
						<option value="">Tipo de Archivo</option>
						<option value="PROGRAMA">PROGRAMA</option>
						<option value="TEORIA">TEORIA</option>
						<option value="TRABAJO PRÁCTICO">TRABAJO PRÁCTICO</option>
						<option value="NOTAS">NOTAS</option>
						<option value="ENLACE">ENLACE</option>
					</select>

					<button
						type="submit"
						className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-all duration-300 ease-in-out">
						Subir
					</button>
				</motion.form>

				<hr className="border-t-2 border-purple-600" />

				{/* Tabla */}
				<motion.div
					className="overflow-x-auto bg-white p-4 rounded-xl shadow"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}>
					<table className="w-full table-auto border border-gray-800 text-sm text-center text-black">
						<thead className="bg-white text-black">
							<tr>
								<th>PROGRAMA</th>
								<th>TEORÍA</th>
								<th>TRABAJOS PRÁCTICOS</th>
								<th>NOTAS</th>
								<th>ENLACES RELACIONADOS</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								{[
									"PROGRAMA",
									"TEORIA",
									"TRABAJO PRÁCTICO",
									"NOTAS",
									"ENLACE",
								].map((tipo) => (
									<td key={tipo} className="border border-gray-700 px-2 py-2">
										{archivos[tipo]?.length > 0 ? (
											archivos[tipo].map((f, idx) => (
												<div key={idx}>
													{/* Mostrar como link para abrir/descargar */}
													<a
														href={f.data}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-400 hover:underline cursor-pointer">
														{f.nombre}
													</a>
												</div>
											))
										) : (
											<span className="text-gray-600">-</span>
										)}
									</td>
								))}
							</tr>
						</tbody>
					</table>
				</motion.div>
			</div>
		</Layout>
	);
}
