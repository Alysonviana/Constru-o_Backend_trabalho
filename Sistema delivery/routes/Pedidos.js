const express = require('express')
const router = express.Router()

let pedidos = [];
let clientes = [];
let restaurantes = [];
let pratos = [];
let nextId = 1;

function getNextId() {
    return nextId++
}

router.get('/', (req, res) => res.json(pedidos));

router.post('/', (req, res) => {
    const { idCliente, idRestaurante, itens, status } = req.body;

    if (!idCliente || !idRestaurante || !Array.isArray(itens) || itens.length === 0 || !status) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando ou inválidos.' });
    }

    if (!clientes.find(c => c.id == idCliente)) {
        return res.status(400).json({ error: 'Cliente inválido.' });
    }

    if (!restaurantes.find(r => r.id == idRestaurante)) {
        return res.status(400).json({ error: 'Restaurante inválido.' });
    }

    for (const pratoId of itens) {
        const prato = pratos.find(p => p.id == pratoId);

        if (!prato || prato.idRestaurante != idRestaurante) {
            return res.status(400).json({ error: `Prato inválido ou não pertence ao restaurante: ${pratoId}` });
        }
    }

    const valorTotal = itens.reduce((acc, id) => {
        const prato = pratos.find(p => p.id == id);
        return acc + prato.preco;
    }, 0);

    const novo = {
        id: getNextId(), idCliente, idRestaurante, itens, valorTotal, status
    };
    pedidos.push(novo);
    res.status(201).json(novo);
});

router.get('/:id', (req, res) => {
    const p = pedidos.find(p => p.id == req.params.id);
    if (!p) return res.status(404).json({ error: 'Pedido não encontrado.' });
    res.json(p);
});

router.put('/:id', (req, res) => {
    const p = pedidos.find(p => p.id == req.params.id);

    if (!p) return res.status(404).json({ error: 'Pedido não encontrado.' });
    const { idCliente, idRestaurante, itens, status } = req.body;

    if (!idCliente || !idRestaurante || !Array.isArray(itens) || itens.length === 0 || !status) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando ou inválidos.' });
    }

    if (!clientes.find(c => c.id == idCliente)) {
        return res.status(400).json({ error: 'Cliente inválido.' });
    }

    if (!restaurantes.find(r => r.id == idRestaurante)) {
        return res.status(400).json({ error: 'Restaurante inválido.' });
    }

    for (const pratoId of itens) {
        const prato = pratos.find(p => p.id == pratoId);
        if (!prato || prato.idRestaurante != idRestaurante) {
            return res.status(400).json({ error: `Prato inválido ou não pertence ao restaurante: ${pratoId}` });
        }
    }

    const valorTotal = itens.reduce((acc, id) => {
        const prato = pratos.find(p => p.id == id);
        return acc + prato.preco;
    }, 0);
    p.idCliente = idCliente;
    p.idRestaurante = idRestaurante;
    p.itens = itens;
    p.valorTotal = valorTotal;
    p.status = status;
    res.json(p);
});

router.delete('/:id', (req, res) => {
    const idx = pedidos.findIndex(p => p.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Pedido não encontrado.' });
    pedidos.splice(idx, 1);
    res.sendStatus(204);
});

module.exports = router;