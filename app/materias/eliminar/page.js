"use client";

import { useState, useEffect } from "react";

export default function Page() {
	const [materias, setMaterias] = useState([]);
	const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
	const [anio, setAnio] = useState("");
	const [division, setDivision] = useState("");
	const [mensaje, setMensaje] = useState("");

	useEffect(() => {
		fetch("/api/materias")
			.then((res) => res.json())
			.then((data) => setMaterias(data.materias))
			.catch(() => setMensaje("Error al cargar materias"));
	}, []);

	function handleChangeMateria(e) {
		const id = parseInt(e.target.value, 10);
		if (isNaN(id)) {
			setMateriaSeleccionada(null);
			setAnio("");
			setDivision("");
			setMensaje("");
			return;
		}
		const materia = materias.find((m) => m.id === id);
		if (materia) {
			setMateriaSeleccionada(materia);
			setAnio("");
			setDivision("");
			setMensaje("");
		} else {
			setMateriaSeleccionada(null);
			setAnio("");
			setDivision("");
		}
	}

	function resetForm() {
		setMateriaSeleccionada(null);
		setAnio("");
		setDivision("");
		setMensaje("");
	}

	async function darDeBaja() {
		if (!materiaSeleccionada) {
			setMensaje("Seleccione una materia primero");
			return;
		}
		if (!confirm("¿Seguro que desea eliminar?")) return;

		try {
			const res = await fetch("/api/materias", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: materiaSeleccionada.id }),
			});
			if (res.ok) {
				setMensaje("Materia dada de baja correctamente");
				setMaterias(materias.filter((m) => m.id !== materiaSeleccionada.id));
				resetForm();
			} else {
				const text = await res.text();
				setMensaje("Error: " + text);
			}
		} catch {
			setMensaje("Error al dar de baja");
		}
	}

	return (
		<>
			<h1 className="text-4xl font-semibold  text-gray-100 ms-6 mt-9">
				Eliminación de Materias
			</h1>
			<main className=" flex flex-col items-center justify-start p-6 ">
				<div className="ms-30 bg-opacity-100 p-8 w-full max-w-4xl flex gap-12 text-left">
					{/* Izquierda - formulario */}
					<div className="flex flex-col flex-1">
						<h2 className="text-1xl font-bold mb-6 text-start text-white">
							Datos de la materia
						</h2>

						<label
							htmlFor="selectMateria"
							className="block mb-2 font-semibold text-gray-300">
							Seleccione la materia
						</label>
						<select
							id="selectMateria"
							className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={materiaSeleccionada ? materiaSeleccionada.id : ""}
							onChange={handleChangeMateria}>
							<option value="" className="text-black">
								-- Seleccione --
							</option>
							{materias.map((m) => (
								<option key={m.id} value={m.id} className="text-black">
									{m.id} - {m.nombre}
								</option>
							))}
						</select>

						<label className="block mb-1 font-semibold text-gray-300">
							Nombre de la materia
						</label>
						<div className="mb-5 min-h-[1.5rem] text-gray-200 font-semibold">
							{materiaSeleccionada ? materiaSeleccionada.nombre : "-"}
						</div>

						<label
							htmlFor="anio"
							className="block mb-1 font-semibold text-gray-300">
							Año
						</label>
						<input
							id="anio"
							type="text"
							value={materiaSeleccionada ? materiaSeleccionada.anio : "-"}
							onChange={(e) => setAnio(e.target.value)}
							placeholder="Ingrese año"
							className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<label
							htmlFor="division"
							className="block mb-1 font-semibold text-gray-300">
							División
						</label>
						<input
							id="division"
							type="text"
							value={materiaSeleccionada ? materiaSeleccionada.division : "-"}
							onChange={(e) => setDivision(e.target.value)}
							placeholder="Ingrese división"
							className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Derecha - imagen + mensaje */}
					<div className="flex flex-col items-center justify-between flex-shrink-0 w-44">
						{materiaSeleccionada && (
							<img
								src={materiaSeleccionada.logo}
								alt={`${materiaSeleccionada.nombre} logo`}
								className="mb-6 w-28 h-28 object-contain rounded"
								onError={(e) => {
									e.currentTarget.src = "/globe.svg";
								}}
							/>
						)}

						{mensaje && (
							<p className="mt-6 text-center text-red-500 text-sm font-semibold">
								{mensaje}
							</p>
						)}
					</div>
				</div>

				{/* Botones */}
				<div className="flex mt-6 gap-6 w-full max-w-4xl justify-center">
					<button
						onClick={darDeBaja}
						className="bg-red-600 text-white px-6 py-3 rounded shadow-lg hover:bg-red-700 transition font-semibold">
						Dar de Baja
					</button>
					<button
						onClick={resetForm}
						className="bg-gray-500 text-white px-6 py-3 rounded shadow-lg hover:bg-gray-600 transition font-semibold">
						Borrar datos
					</button>
				</div>
			</main>
		</>
	);
}
