import { useState } from "react";
import "./Estilos/App.css";
import Materias from "./Paginas/materias.jsx";
import AltaMateria from "./Paginas/altaMateria.jsx";
import { Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/materias" replace />} />
			<Route path="/materias" element={<Materias />} />
			<Route path="/modMat/:id" element={<AltaMateria />} />
			<Route path="/addMat" element={<AltaMateria />} />
			<Route path="/changeMat" element={<AltaMateria />} />
		</Routes>
	);
}

export default App;
