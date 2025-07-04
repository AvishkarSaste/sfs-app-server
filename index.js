const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const con = mysql2.createConnection({
	host: "sql12.freesqldatabase.com",
	user: "sql12788277",
	password: "8dUZk8Dybr",
	database: "sql12788277"
});

//set up multer for the file uploads 

const storage = multer.diskStorage({
	destination:(req, file, cb) => {
		cb(null, 'uploads/'); 			//destination for folders
	},
	
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));		//Unique name
	},
});

const upload = multer({storage});

//Serve uploaded files staticaly 
app.use('/uploads',express.static('uploads'));

app.post("/ss", upload.single('file'), (req, res) => {
	let sql = "insert into student values(?,?,?,?)";
	let data = [req.body.rno, req.body.name, req.body.marks, req.file.filename];
	con.query(sql, data,(error, result) => {
		if(error)	res.send(error);
		else		res.send(result);
	});
});

app.get("/gs", (req, res) => {
	let sql = "select * from student";
	con.query(sql, (err, result) => {
		if(err)		res.send(err);
		else		res.send(result);
	});
});

app.delete("/ds", (req,res) => {
	let data = [req.body.rno];
	fs.unlink("./uploads/" + req.body.image, () => {});
	let sql = "delete from student where rno = ?";
	con.query(sql, data, (err, result) => {
		if(err)		res.send(err);
		else		res.send(result);
	});
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
	console.log(`ready to serve @${PORT}`);
});
