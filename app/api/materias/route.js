import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filepath = path.join(process.cwd(), "BaseDeDatos", "base.json");

async function leer() {
	const file = await fs.readFile(filepath, "utf-8");
	return JSON.parse(file);
}

async function guardar(data) {
	await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
	try {
		const data = await leer();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error al leer el archivo:", error);
		return new Response("Error al leer datos", { status: 500 });
	}
}

export async function PATCH(request) {
	try {
		const body = await request.json();
		const data = await leer();

		const index = data.materias.findIndex((m) => m.id === Number(body.id));
		if (index === -1) {
			return new Response("Materia no encontrada", { status: 404 });
		}

		data.materias[index] = {
			...data.materias[index],
			...body,
			id: Number(body.id),
		};
		await guardar(data);

		return NextResponse.json(data.materias[index]);
	} catch (error) {
		console.error("Error al modificar materia:", error);
		return new Response("Error al modificar", { status: 500 });
	}
}

export async function DELETE(request) {
	try {
		const { id } = await request.json();
		const data = await leer();

		const materiaExistente = data.materias.find((m) => m.id === id);
		if (!materiaExistente) {
			return new Response("Materia no encontrada", { status: 404 });
		}

		data.materias = data.materias.filter((m) => m.id !== id);
		await guardar(data);

		return NextResponse.json({ mensaje: "Materia eliminada", id });
	} catch (error) {
		console.error("Error al eliminar materia:", error);
		return new Response("Error al eliminar", { status: 500 });
	}
}
