import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 5,
		},
	}).onUploadComplete(({ files }) => {
		console.log(
			"Uploaded files:",
			files.map((f) => f.url)
		);

		return {
			urls: files.map((file) => file.url),
		};
	}),
};
