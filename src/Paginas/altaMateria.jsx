// src/Paginas/AltaMateria.jsx
import React from "react";
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

export default function AltaMateria() {
	const formik = useFormik({
		initialValues: {
			nombre: "",
			logo: "",
			descripcion: "",
			contenidos: "",
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.max(100, "Máximo 100 caracteres")
				.required("Campo obligatorio"),
			logo: Yup.string().required("Ruta obligatoria"),
			descripcion: Yup.string().required("Descripción obligatoria"),
			contenidos: Yup.string().required("Contenidos obligatorios"),
		}),
		onSubmit: (values, { resetForm }) => {
			const materiasActuales = cargarMaterias();
			const nuevaMateria = {
				id: materiasActuales.length + 1,
				...values,
			};
			guardarMaterias([...materiasActuales, nuevaMateria]);
			alert("Materia registrada correctamente");
			resetForm();
		},
	});

	return (
		<Layout>
			<div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border">
				<h1 className="text-3xl font-bold text-center text-black mb-6">
					ALTA DE MATERIAS
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
							className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
							Guardar
						</button>
						<button
							type="button"
							onClick={formik.handleReset}
							className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">
							Limpiar
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
}
