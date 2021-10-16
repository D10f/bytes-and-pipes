import { Router } from "express";
import { fileController } from "../controllers";

const router = Router();

router.post("/upload/:filename/:currentChunk", fileController.uploadFile);

router.put("/u/meta/:id", fileController.updateFileMetadata);

router.get("/download/:id", fileController.downloadFile);

router.get("/d/meta/:id", fileController.readFileMetadata);

export default router;
