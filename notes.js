const express = require("express");
const app = express();

const fs = require("fs");
const PORT = 1000;

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    res.render("home", { notes: notes });
  });
});

app.post("/add", (req, res) => {
  const formData = req.body;

  if (formData.notes.trim() == "") {
    fs.readFile("./data/notes.json", (err, data) => {
      if (err) throw err;

      const notes = JSON.parse(data);

      res.render("home", { error: true, notes: notes });
    });
  } else {
    fs.readFile("./data/notes.json", (err, data) => {
      if (err) throw err;

      const notes = JSON.parse(data);

      const note = {
        id: id(),
        caption: formData.notes,
        done: false,
      };

      notes.push(note);

      fs.writeFile("./data/notes.json", JSON.stringify(notes), (err) => {
        if (err) throw err;

        fs.readFile("./data/notes.json", (err, data) => {
          if (err) throw err;

          const notes = JSON.parse(data);

          res.render("home", { success: true, notes: notes });
        });
      });
    });
  }
});

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    const filterednotes = notes.filter((note) => note.id != id);

    fs.writeFile("./data/notes.json", JSON.stringify(filterednotes), (err) => {
      if (err) throw err;

      res.render("home", { notes: filterednotes, delete: true });
    });
  });
});

app.get("/:id/update", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    const note = notes.filter((note) => note.id == id)[0];

    const noteIdx = notes.indexOf(note);
    const splicednote = notes.splice(noteIdx, 1)[0];

    splicednote.done = true;
    notes.push(splicednote);

    fs.writeFile("./data/notes.json", JSON.stringify(notes), (err) => {
      if (err) throw err;

      res.render("home", { notes: notes });
    });
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log("This application is running on port" + PORT);
});

function id() {
  return "_" + Math.random().toString(36).substring(2, 9);
}
