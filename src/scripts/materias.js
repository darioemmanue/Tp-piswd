const STORAGE_KEY = "materias";
const USUARIO_KEY = "usuario";

const usuarioInicial = {
	nombre: "Invitado",
	rol: "Usuario",
};

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
	fetch("/BaseDeDatos/base.json")
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

// -------------- FUNCIONES PARA USUARIO ------------------

export function obtenerUsuario() {
	const almacenado = localStorage.getItem(USUARIO_KEY);
	if (almacenado) {
		try {
			return JSON.parse(almacenado);
		} catch {
			return null;
		}
	}
	return null;
}

// Guardar usuario en localStorage
export function guardarUsuario(usuario) {
	localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

// Cargar usuario con id=1 desde archivo JSON base
export function cargarUsuarioDesdeArchivo() {
	fetch("/BaseDeDatos/base.json")
		.then((response) => {
			if (!response.ok) throw new Error("No se pudo cargar base.json");
			return response.json();
		})
		.then((data) => {
			if (data && Array.isArray(data.usuarios)) {
				const usuario = data.usuarios.find((u) => u.id === 1);
				if (usuario) {
					guardarUsuario(usuario);
				}
			}
		})
		.catch((error) => {
			console.error("Error cargando usuario desde archivo:", error);
		});
}
