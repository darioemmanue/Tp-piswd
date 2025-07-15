import {
	writeFile,
	mkdir,
	readFile,
	writeFile as writeFileFS,
} from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public", "Archivos");
const jsonPath = path.join(process.cwd(), "BaseDeDatos", "archivos.json");

async function ensureDir(dir) {
	if (!fs.existsSync(dir)) {
		await mkdir(dir, { recursive: true });
	}
}

export async function POST(req) {
	try {
		const formData = await req.formData();
		const archivo = formData.get("archivo");
		const nombre = formData.get("nombre");
		const tipo = formData.get("tipo");
		const materiaId = parseInt(formData.get("materiaId"), 10);

		if (!archivo || !archivo.name || !materiaId) {
			return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
		}

		await ensureDir(uploadDir);

		const bytes = await archivo.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const nombreReal = `${Date.now()}-${archivo.name}`;
		const filePath = path.join(uploadDir, nombreReal);

		await writeFile(filePath, buffer);

		const nuevoArchivo = {
			nombre,
			tipo,
			nombreReal,
			materiaId,
		};

		// Leer el JSON actual
		let archivos = [];
		if (fs.existsSync(jsonPath)) {
			const data = await readFile(jsonPath, "utf-8");
			archivos = JSON.parse(data);
		}

		// Agregar nuevo archivo
		archivos.push(nuevoArchivo);

		// Guardar JSON actualizado
		await writeFileFS(jsonPath, JSON.stringify(archivos, null, 2));

		return NextResponse.json(nuevoArchivo, { status: 200 });
	} catch (error) {
		console.error("Error al subir archivo:", error);
		return NextResponse.json(
			{ error: "Error en el servidor" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		if (!fs.existsSync(jsonPath)) {
			return NextResponse.json([]);
		}

		const data = await readFile(jsonPath, "utf-8");
		const archivos = JSON.parse(data);
		return NextResponse.json(archivos);
	} catch (error) {
		console.error("Error al obtener archivos:", error);
		return NextResponse.json(
			{ error: "Error al obtener archivos" },
			{ status: 500 }
		);
	}
}
