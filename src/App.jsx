import React from "react";
import "./Estilos/App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import ListadoMaterias from "./Paginas/listadoMateria";
import Materias from "./Paginas/materias";
import AltaMateria from "./Paginas/altaMateria";
import ModificarMateria from "./Paginas/modMat";

import { useParams, useNavigate } from "react-router-dom";

function ModificarMateriaConId() {
	const { id } = useParams();
	const navigate = useNavigate();

	// Función para volver al listado
	const onCancelar = () => navigate("/materias");

	// Función para volver al listado tras modificar
	const onModificado = () => navigate("/materias");

	return (
		<ModificarMateria
			id={id}
			onCancelar={onCancelar}
			onModificado={onModificado}
		/>
	);
}

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Materias />} />
			<Route path="/materias" element={<ListadoMaterias />} />
			<Route path="/addMat" element={<AltaMateria />} />
			<Route path="/modMat/:id" element={<ModificarMateriaConId />} />
			<Route path="*" element={<Navigate to="/materias" replace />} />
		</Routes>
	);
}
