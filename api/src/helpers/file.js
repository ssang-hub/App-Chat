import {v2 as cloudinary} from 'cloudinary'

export async function handleUpload(file) {
    const resp = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return resp;
}