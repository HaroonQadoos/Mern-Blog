// const express = require("express");
// const multer = require("../config/multer"); // use your multer config
// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");

// const router = express.Router();

// router.post("/", multer.single("image"), async (req, res) => {
//   console.log("UPLOAD HIT", req.file);
// });
// // Helper to upload buffer to Cloudinary
// const streamUpload = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "blog-posts" },
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

// // POST /api/upload
// router.post("/", multer.single("image"), async (req, res) => {
//   console.log("REQ.BODY:", req.body);
//   console.log("REQ.FILE:", req.file);
//   try {
//     // 1️⃣ User provided an external URL
//     if (req.body.image && req.body.image.startsWith("http")) {
//       return res.status(200).json({ url: req.body.image });
//     }

//     // 2️⃣ User uploaded a file
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const result = await streamUpload(req.file.buffer);
//     res.status(200).json({ url: result.secure_url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// });

// module.exports = router;
// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");

// const router = express.Router();

// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const streamUpload = () =>
//       new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "blog-posts" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );

//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });

//     const result = await streamUpload();

//     res.json({ url: result.secure_url });
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

// module.exports = router;
// backend/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");

router.post("/", uploadImage);

module.exports = router;
