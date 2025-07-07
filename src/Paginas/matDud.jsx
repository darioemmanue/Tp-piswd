import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "materias";

const cargarMaterias = () => {
	const almacenadas = localStorage.getItem(STORAGE_KEY);
	return almacenadas ? JSON.parse(almacenadas) : [];
};

const guardarMaterias = (materias) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
};

export default function ListadoMaterias() {
	const [materias, setMaterias] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		setMaterias(cargarMaterias());
	}, []);

	const eliminarMateria = (id) => {
		if (!window.confirm("¿Estás seguro que quieres eliminar esta materia?"))
			return;
		const nuevasMaterias = materias.filter((m) => m.id !== id);
		guardarMaterias(nuevasMaterias);
		setMaterias(nuevasMaterias);
	};

	return (
		<Layout>
			<div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border">
				<h1 className="text-3xl font-bold text-center mb-6">
					Listado de Materias
				</h1>

				{materias.length === 0 ? (
					<p className="text-center text-gray-600">No hay materias cargadas.</p>
				) : (
					<table className="w-full border-collapse text-black">
						<thead>
							<tr className="border-b">
								<th className="text-left py-2 px-4">Logo</th>
								<th className="text-left py-2 px-4">Nombre</th>
								<th className="text-left py-2 px-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{materias.map(({ id, nombre, logo }) => (
								<tr key={id} className="border-b hover:bg-gray-100">
									<td className="py-2 px-4">
										<img
											src={logo}
											alt={nombre}
											className="w-16 h-16 object-cover rounded"
											onError={(e) => (e.target.src = "/Imagenes/default.jpg")}
										/>
									</td>
									<td className="py-2 px-4">{nombre}</td>
									<td className="py-2 px-4 space-x-2">
										<button
											onClick={() => navigate(`/modificar-materia/${id}`)}
											className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">
											Modificar
										</button>
										<button
											onClick={() => eliminarMateria(id)}
											className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
											Eliminar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</Layout>
	);
}
