const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// TODO: Membro 1 - Importar e mapear
const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/restaurants', restaurantRoutes);


const pedidosRoute = require('./routes/Pedidos')
app.use('/Pedidos', pedidosRoute);


// TODO: Clientes - Importar e mapear
const clientesRoutes = require('./routes/cliente');
app.use(clientesRoutes);



const deliveryRoutes = require('./deliveryRoutes')

app.use(express.json())
app.use('/entregadores', deliveryRoutes)



app.listen(3000, () => {
console.log(`Servidor rodando em http://localhost:3000`);
})


