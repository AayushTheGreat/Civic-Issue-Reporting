// 1. Import Libraries
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// 2. Setup Server
const app = express();
const PORT = 8000;

// 3. Middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads",express.static("uploads"));

// 4. Multer file upload setup
const storage = multer.diskStorage({destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage});

// 5. Database setup 
const db = new sqlite3.Database("reports.db", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite Database.");
});

db.run(`
    CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name Text,
    description Text,
    location Text,
    photo_path Text,
    status TEXT DEFAULT 'Pending'
    )
`);

// 6. API Routes

// 6.1
app.post("/report",upload.single("photo"), (req, res) => {
    //Access text fields directly
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user_name = req.body.user_name || "Anonymous";
    const description = req.body.description || "";
    const location = req.body.location || "";

    //handle photo if uploaded
    const photo_path = req.file ? req.file.path : null;

    db.run(
        `INSERT INTO reports ( user_name, description, location, photo_path) VALUES (?, ?, ?, ?)`,
        [user_name, description, location, photo_path],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                message: " Report Submitted Successfully!",
                report_id: this.lastID,
            });
        }
    );
});

// 6.2 Admin fetches all reports

app.get("/reports", (req, res) => {
    db.all(`SELECT * FROM reports`, [], (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        
        const reports = rows.map(r => ({
            ...r,
            photo_url: r.photo_path ? `http://localhost:${PORT}/${r.photo_path}` : null
        }));
        res.json(reports);
    });
});


// 6.3 Admin updates report status

app.put("/report/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run(
        `UPDATE reports SET status = ? WHERE id = ?`,
        [status, id],
        function(err) {return res.status(500).json({ error: err.message });
        res.json({ message: "Status Updated Successfully!"});
        }
    );
});

// 7. Start Server

app.listen(PORT, () => {
    console.log(`Server running at http://locahost:${PORT}`);
});