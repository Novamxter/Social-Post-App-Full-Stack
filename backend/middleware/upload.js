import multer from "multer";

const storage = multer.diskStorage({}); // empty, temporary
export const uploadProfile = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadPost = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
