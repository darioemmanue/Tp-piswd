import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
	const data = await request.formData();
	const file = data.get("archivo"); // el nombre del campo input

	if (!file) {
		return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });
	}

	// Obtener contenido del archivo
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	// Crear carpeta destino si no existe
	const uploadPath = path.join(process.cwd(), "uploads");
	const filePath = path.join(uploadPath, `${Date.now()}-${file.name}`);

	// Guardar archivo
	await writeFile(filePath, buffer);

	return NextResponse.json({
		mensaje: "Archivo subido correctamente",
		nombre: file.name,
	});
}
