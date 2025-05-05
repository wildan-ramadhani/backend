const express = require('express');
const app = express();
const barangRoute = require('./routes/BarangB');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan pada server');
})

app.use(express.json());
app.use('/barang', barangRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
