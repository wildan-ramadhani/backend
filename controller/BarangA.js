const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/data.json');

// GET semua data
const getAll = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
};

// CREATE data baru
const create = (req, res) => {
  console.log("POST request body:", req.body); // Debugging log

  if (!req.body.namaBarang || !req.body.jumlahBarang || !req.body.terjual || req.body.sisa === undefined) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const data = JSON.parse(fs.readFileSync(dataPath));
  const newData = {
    id: Date.now(),
    ...req.body,
    updateAt: new Date().toISOString(),
  };
  data.push(newData);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.status(201).json(newData);
};

// UPDATE data berdasarkan ID
const update = (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(dataPath));
  const index = data.findIndex(item => item.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  data[index] = {
    ...data[index],
    ...req.body,
    updateAt: new Date().toISOString()
  };

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json(data[index]);
};

// DELETE data berdasarkan ID
const remove = (req, res) => {
  const { id } = req.params;
  let data = JSON.parse(fs.readFileSync(dataPath));
  data = data.filter(item => item.id != id);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json({ message: "Data berhasil dihapus" });
};

module.exports = { getAll, create, update, remove };
