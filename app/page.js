"use client";

import { useEffect, useState } from "react";

export default function Home() {
	const [materias, setMaterias] = useState([]);
	const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
	const [nombre, setNombre] = useState("");
	const [archivo, setArchivo] = useState(null);
	const [tipo, setTipo] = useState("PROGRAMA");
	const [archivos, setArchivos] = useState([]);

	useEffect(() => {
		fetch("/api/materias")
			.then((res) => res.json())
			.then((data) => {
				setMaterias(data.materias || []);
			})
			.catch((error) => {
				console.error("Error al cargar materias:", error);
			});
	}, []);

	const cargarArchivos = async (idSeleccionado) => {
		try {
			const res = await fetch("/api/archivos");
			if (!res.ok) throw new Error("Error al obtener archivos");
			const data = await res.json();
			const archivosArray = Array.isArray(data) ? data : [];

			const filtrados = archivosArray.filter(
				(a) => a.materiaId === idSeleccionado
			);
			setArchivos(filtrados);
		} catch (error) {
			console.error("Error al obtener archivos:", error);
			setArchivos([]);
		}
	};

	const handleSeleccion = (e) => {
		const idSeleccionado = parseInt(e.target.value);
		const materia = materias.find((m) => m.id === idSeleccionado);
		setMateriaSeleccionada(materia);
		cargarArchivos(idSeleccionado);
	};

	const handleSubir = async (e) => {
		e.preventDefault();
		if (!nombre || !archivo || !materiaSeleccionada) {
			alert("Completa los campos");
			return;
		}

		const formData = new FormData();
		formData.append("archivo", archivo);
		formData.append("nombre", nombre);
		formData.append("tipo", tipo);
		formData.append("materiaId", materiaSeleccionada.id);

		try {
			const res = await fetch("/api/archivos", {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				alert("Archivo subido correctamente");
				setNombre("");
				setArchivo(null);
				setTipo("PROGRAMA");
				const data = await res.json();
				setArchivos((prev) => [...prev, data]);
			} else {
				const err = await res.text();
				console.error("Error en POST:", err);
				alert("Error al subir archivo");
			}
		} catch (error) {
			console.error("Error en la subida:", error);
			alert("Falló la subida");
		}
	};

	return (
		<>
			<h1 className="text-4xl font-bold text-white rounded ms-6 mt-9">
				Bienvenido!
			</h1>
			<p className="ms-8">Selecciona una materia</p>

			<div className="max-w-4xl mx-auto p-6 text-white">
				<div className="flex justify-end">
					<select
						className="mb-6 py-2 border rounded text-black w-full max-w-md"
						onChange={handleSeleccion}
						defaultValue="">
						<option value="" disabled>
							Seleccione una materia
						</option>
						{materias.map((mat) => (
							<option key={mat.id} value={mat.id}>
								{mat.nombre}
							</option>
						))}
					</select>
					<h2 className="text-2xl font-bold mb-4 ms-2">Materia</h2>
				</div>

				{materiaSeleccionada && (
					<div className="p-6 rounded shadow-md bg-transparent">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<h3 className="text-green-400 text-xl font-bold break-words md:flex-1">
								{materiaSeleccionada.nombre}
							</h3>
							<div className="w-28 h-28 flex items-center justify-center">
								<img
									src={materiaSeleccionada.logo || "/logo-generico.png"}
									alt="Logo materia"
									className="w-full h-full object-contain"
								/>
							</div>
						</div>

						<p className="tracking-[3px] font-semibold mt-6">
							Descripción de la materia
						</p>
						<textarea
							value={materiaSeleccionada.descripcion}
							readOnly
							className="w-full h-32 border mt-2 rounded p-2 bg-transparent text-white resize-none"
						/>

						<form onSubmit={handleSubir} className="mt-6 border p-4 rounded">
							<h4 className="text-lg font-bold mb-4">Subir Archivo</h4>

							<div className="mb-3 flex flex-col md:flex-row md:items-center md:gap-4">
								<label className="w-full md:w-40 font-semibold mb-2 md:mb-0">
									Nombre de Archivo:
								</label>
								<input
									type="text"
									value={nombre}
									onChange={(e) => setNombre(e.target.value)}
									className="flex-1 border p-2 rounded text-black"
									placeholder="Ej: tema1"
								/>
							</div>

							<div className="mb-3 flex flex-col md:flex-row md:items-center md:gap-4">
								<label className="w-full md:w-40 font-semibold mb-2 md:mb-0">
									Seleccionar Archivo:
								</label>
								<input
									type="file"
									className="flex-1 border p-2 rounded text-black"
									onChange={(e) => setArchivo(e.target.files[0])}
								/>
							</div>

							<div className="mb-3 flex flex-col md:flex-row md:items-center md:gap-4">
								<label className="w-full md:w-40 font-semibold mb-2 md:mb-0">
									Tipo de Archivo:
								</label>
								<select
									className="border p-2 rounded flex-1 text-black"
									value={tipo}
									onChange={(e) => setTipo(e.target.value)}>
									<option>PROGRAMA</option>
									<option>TEORIA</option>
									<option>TRABAJO PRÁCTICO</option>
									<option>NOTAS</option>
									<option>ENLACE</option>
								</select>
							</div>

							<div className="text-end">
								<button className="bg-gradient-to-r from-red-800 to-red-400 text-white px-6 py-2 rounded hover:scale-105 transition-transform">
									Subir
								</button>
							</div>
						</form>

						<hr className="my-8 border-t-4 border-double border-gray-300" />

						<div className="overflow-auto">
							<table className="w-full border text-sm text-center border-collapse border-gray-300">
								<thead className="bg-[#722323] font-bold text-white">
									<tr>
										<th className="border p-2">Nombre</th>
										<th className="border p-2">Tipo</th>
										<th className="border p-2">Ver</th>
									</tr>
								</thead>
								<tbody>
									{archivos.map((a, idx) => (
										<tr key={idx}>
											<td className="border p-2">{a.nombre}</td>
											<td className="border p-2">{a.tipo}</td>
											<td className="border p-2">
												<a
													href={`/Archivos/${a.nombreReal}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500 underline">
													Abrir
												</a>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
