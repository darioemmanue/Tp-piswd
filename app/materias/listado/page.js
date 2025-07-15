"use client";

import { useEffect, useState } from "react";

export default function ListadoMaterias() {
	const [materias, setMaterias] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function cargarMaterias() {
			try {
				const res = await fetch("/api/materias");
				if (!res.ok) throw new Error("Error al cargar materias");
				const data = await res.json();
				setMaterias(data.materias || []);
			} catch (err) {
				setError(err.message);
			} finally {
				setCargando(false);
			}
		}
		cargarMaterias();
	}, []);

	if (cargando)
		return (
			<p className="text-center text-gray-600 font-medium mt-4">
				Cargando materias...
			</p>
		);

	if (error)
		return (
			<p className="text-center text-red-600 font-medium mt-4">
				Error: {error}
			</p>
		);

	return (
		<>
			<h1 className="text-4xl font-bold text-white mb-6 rounded ms-6 mt-9 ">
				Listado De Materias
			</h1>
			<section className="max-w-4xl mx-auto px-4 py-6">
				<div className="overflow-x-auto rounded shadow">
					<table className="min-w-full table-auto border border-gray-300 text-black">
						<thead className="bg-gray-200 text-gray-700 text-sm uppercase">
							<tr>
								<th className="border border-gray-300 px-4 py-2">
									NRO DE MATERIA
								</th>
								<th className="border border-gray-300 px-4 py-2">
									NOMBRE DE MATERIA
								</th>
								<th className="border border-gray-300 px-4 py-2">AÑO</th>
								<th className="border border-gray-300 px-4 py-2">DIVISIÓN</th>
							</tr>
						</thead>
						<tbody>
							{materias.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="text-center text-gray-500 py-4 border border-gray-300">
										No hay materias disponibles
									</td>
								</tr>
							) : (
								materias.map(({ id, nombre, anio, division }, i) => (
									<tr
										key={id || i}
										className="text-center odd:bg-white even:bg-gray-50">
										<td className="border border-gray-300 px-4 py-2">
											{id || i + 1}
										</td>
										<td className="border border-gray-300 px-4 py-2">
											{nombre}
										</td>
										<td className="border border-gray-300 px-4 py-2">{anio}</td>
										<td className="border border-gray-300 px-4 py-2">
											{division}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<p className="mt-4 text-right text-white font-medium">
					Total de materias:{" "}
					<span className="text-white font-semibold">{materias.length}</span>
				</p>
			</section>
		</>
	);
}
