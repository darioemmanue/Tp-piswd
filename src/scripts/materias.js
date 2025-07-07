const STORAGE_KEY = "materias";

export function obtenerMaterias() {
	const almacenadas = localStorage.getItem(STORAGE_KEY);
	if (almacenadas) {
		try {
			return JSON.parse(almacenadas);
		} catch {
			return materiasIniciales;
		}
	}
	return materiasIniciales;
}

export function guardarMaterias(materias) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
}

export function cargarMateriasDesdeArchivo() {
	fetch("/BaseDeDatos/baseMaterias.json")
		.then((response) => {
			if (!response.ok) throw new Error("No se pudo cargar el archivo");
			return response.json();
		})
		.then((data) => {
			if (Array.isArray(data)) {
				guardarMaterias(data);
			}
		})
		.catch((error) => {
			console.error("Error al cargar materias desde archivo:", error);
		});
}
