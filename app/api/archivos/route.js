import { NextResponse } from "next/server";
import path from "path";
import fsPromises from "fs/promises";
import { IncomingForm } from "formidable";
import { Readable } from "stream";

export const config = {
	api: {
		bodyParser: false,
	},
};

const ARCHIVOS_DIR = path.join(process.cwd(), "public", "Archivos");

// Convierte un Request Web a stream compatible Node
function bufferToStream(buffer) {
	const readable = new Readable();
	readable.push(buffer);
	readable.push(null);
	return readable;
}

export async function POST(request) {
	const form = new IncomingForm({
		uploadDir: ARCHIVOS_DIR,
		keepExtensions: true,
		maxFileSize: 50 * 1024 * 1024,
		multiples: false,
	});

	try {
		// Lee el body como ArrayBuffer y lo convierte a buffer
		const bodyBuffer = Buffer.from(await request.arrayBuffer());
		// Convierte el buffer a stream para formidable
		const stream = bufferToStream(bodyBuffer);

		// formidable usa callback, aquí lo "promisificamos"
		const data = await new Promise((resolve, reject) => {
			form.parse(stream, (err, fields, files) => {
				if (err) reject(err);
				else resolve({ fields, files });
			});
		});

		if (!data.files.archivo) {
			return NextResponse.json(
				{ error: "No se envió archivo" },
				{ status: 400 }
			);
		}

		const archivoSubido = data.files.archivo;
		const extension = path.extname(archivoSubido.originalFilename || "");
		const nuevoNombre = `${Date.now()}${extension}`;
		const nuevoPath = path.join(ARCHIVOS_DIR, nuevoNombre);

		await fsPromises.rename(archivoSubido.filepath, nuevoPath);

		return NextResponse.json({
			nombreReal: nuevoNombre,
			originalName: archivoSubido.originalFilename,
			size: archivoSubido.size,
		});
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET() {
	return NextResponse.json({
		message:
			"No es posible listar archivos sin mantener un registro de los mismos.",
	});
}
