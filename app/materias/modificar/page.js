"use client";

import { useState, useEffect } from "react";

export default function ModificaMateria() {
	const [form, setForm] = useState({
		id: "",
		nombre: "",
		logo: "",
	});

	const [mensaje, setMensaje] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));

		// Si cambia el ID, intentamos buscar la materia
		if (name === "id" && /^\d{1,3}$/.test(value)) {
			fetchMateriaPorId(value);
		}
	};

	const fetchMateriaPorId = async (id) => {
		try {
			const res = await fetch("/api/materias");
			if (!res.ok) throw new Error("Error al obtener materias");
			const data = await res.json();
			const materia = data.materias.find(
				(m) => m.id.toString() === id.toString()
			);

			if (materia) {
				setForm({
					id: materia.id.toString(),
					nombre: materia.nombre || "",
					logo: materia.logo || "",
				});
				setMensaje("Materia cargada");
			} else {
				setForm((prev) => ({ ...prev, nombre: "", logo: "" }));
				setMensaje("Materia no encontrada");
			}
		} catch (err) {
			setMensaje("Error al buscar la materia");
		}
	};

	const validar = () => {
		const { id, nombre } = form;
		const soloNumeros = /^\d{1,3}$/;
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{1,50}$/;

		if (!soloNumeros.test(id))
			return "El ID debe tener hasta 3 dígitos numéricos.";
		if (!soloLetras.test(nombre))
			return "El nombre debe tener solo letras (hasta 50).";
		return "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const error = validar();
		if (error) {
			setMensaje(error);
			return;
		}

		try {
			const res = await fetch("/api/materias", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) throw new Error("Error al modificar la materia");

			const data = await res.json();
			setMensaje(`Materia modificada: ${data.nombre}`);
		} catch (err) {
			setMensaje("Error al enviar los datos");
		}
	};

	const handleReset = () => {
		setForm({ id: "", nombre: "", logo: "" });
		setMensaje("");
	};

	return (
		<>
			<h1 className="text-4xl font-semibold text-white text-center mt-8">
				MODIFICACIÓN DE MATERIAS
			</h1>
			<div className="min-h-screen flex items-center justify-center p-4">
				<div className="w-full max-w-xl">
					<form onSubmit={handleSubmit} className="space-y-6 text-black">
						<fieldset className="border border-gray-300 p-4 rounded">
							<legend className="text-lg font-semibold text-white mb-2">
								Datos de la materia
							</legend>

							{/* Nro de materia */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-white mb-1">
									Número de Materia
								</label>
								<input
									type="text"
									name="id"
									maxLength={3}
									value={form.id}
									onChange={handleChange}
									className="w-full text-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
									required
								/>
							</div>

							{/* Nombre de materia */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-white mb-1">
									Nombre de Materia
								</label>
								<input
									type="text"
									name="nombre"
									maxLength={50}
									value={form.nombre}
									onChange={handleChange}
									className="w-full text-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
									required
								/>
							</div>

							{/* Logo */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-white mb-1">
									Logo de la Materia
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										name="logo"
										value={form.logo}
										onChange={handleChange}
										className="flex-1 text-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
									/>
									<button
										type="button"
										onClick={() =>
											alert("Aquí podrías abrir un selector de archivo.")
										}
										className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
										Seleccionar archivo
									</button>
								</div>
							</div>
						</fieldset>

						{/* Botones */}
						<div className="flex justify-between mt-4">
							<button
								type="submit"
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
								Modificar Datos
							</button>
							<button
								type="reset"
								onClick={handleReset}
								className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
								Borrar datos
							</button>
						</div>
					</form>

					{/* Mensaje */}
					{mensaje && (
						<p className="mt-4 text-center text-sm text-blue-600">{mensaje}</p>
					)}
				</div>
			</div>
		</>
	);
}
