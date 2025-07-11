import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Layout from "./layout";

const STORAGE_KEY = "materias";

const cargarMaterias = () => {
	const almacenadas = localStorage.getItem(STORAGE_KEY);
	return almacenadas ? JSON.parse(almacenadas) : [];
};

const guardarMaterias = (materias) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
};

export default function ModificarMateria({ id, onCancelar, onModificado }) {
	const [materiaInicial, setMateriaInicial] = useState(null);

	useEffect(() => {
		const materias = cargarMaterias();
		const materia = materias.find((m) => m.id === Number(id));
		if (materia) {
			setMateriaInicial(materia);
		} else {
			alert("Materia no encontrada");
			onCancelar();
		}
	}, [id, onCancelar]);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			nombre: materiaInicial?.nombre || "",
			logo: materiaInicial?.logo || "",
			descripcion: materiaInicial?.descripcion || "",
			contenidos: materiaInicial?.contenidos || "",
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.max(100, "Máximo 100 caracteres")
				.required("Campo obligatorio"),
			logo: Yup.string().required("Ruta obligatoria"),
			descripcion: Yup.string().required("Descripción obligatoria"),
			contenidos: Yup.string().required("Contenidos obligatorios"),
		}),
		onSubmit: (values) => {
			const materias = cargarMaterias();
			const index = materias.findIndex((m) => m.id === Number(id));
			if (index !== -1) {
				materias[index] = { id: Number(id), ...values };
				guardarMaterias(materias);
				alert("Materia modificada correctamente");
				onModificado();
			} else {
				alert("Error: Materia no encontrada");
			}
		},
	});

	if (!materiaInicial) {
		return (
			<Layout>
				<div className="max-w-2xl mx-auto mt-10 p-8 text-center text-red-600">
					Cargando materia...
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border">
				<h1 className="text-3xl font-bold text-center text-black mb-6">
					MODIFICAR MATERIA
				</h1>

				<form onSubmit={formik.handleSubmit} className="space-y-5 text-black">
					<div>
						<label className="block font-medium">Nombre</label>
						<input
							type="text"
							name="nombre"
							className="border px-3 py-2 rounded w-full"
							{...formik.getFieldProps("nombre")}
						/>
						{formik.touched.nombre && formik.errors.nombre && (
							<div className="text-red-600 text-sm">{formik.errors.nombre}</div>
						)}
					</div>

					<div>
						<label className="block font-medium">Logo</label>
						<input
							type="text"
							name="logo"
							placeholder="/Imagenes/materia.jpg"
							className="border px-3 py-2 rounded w-full"
							{...formik.getFieldProps("logo")}
						/>
						{formik.touched.logo && formik.errors.logo && (
							<div className="text-red-600 text-sm">{formik.errors.logo}</div>
						)}
					</div>

					<div>
						<label className="block font-medium">Descripción</label>
						<textarea
							name="descripcion"
							rows={3}
							className="border px-3 py-2 rounded w-full"
							{...formik.getFieldProps("descripcion")}></textarea>
						{formik.touched.descripcion && formik.errors.descripcion && (
							<div className="text-red-600 text-sm">
								{formik.errors.descripcion}
							</div>
						)}
					</div>

					<div>
						<label className="block font-medium">Contenidos</label>
						<textarea
							name="contenidos"
							rows={3}
							className="border px-3 py-2 rounded w-full"
							{...formik.getFieldProps("contenidos")}></textarea>
						{formik.touched.contenidos && formik.errors.contenidos && (
							<div className="text-red-600 text-sm">
								{formik.errors.contenidos}
							</div>
						)}
					</div>

					<div className="flex justify-between mt-6">
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
							Modificar
						</button>
						<button
							type="button"
							onClick={formik.handleReset}
							className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
							Limpiar
						</button>
						<button
							type="button"
							onClick={onCancelar}
							className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
}
