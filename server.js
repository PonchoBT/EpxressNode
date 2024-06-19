const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { CONNREFUSED } = require('dns');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/pizzas', (req, res) => {
    const pizzasToAdd = [
        {
            "id": 1,
            "name": "Margherita 🍕",
            "toppings": ["salsa de tomate", "queso mozzarella", "albahaca fresca"],
            "price": 9.99
        },
        {
            "id": 2,
            "name": "Pepperoni 🍕",
            "toppings": ["salsa de tomate", "queso mozzarella", "pepperoni"],
            "price": 10.99
        },
        {
            "id": 3,
            "name": "Vegetariana 🍕",
            "toppings": ["salsa de tomate", "queso mozzarella", "pimientos", "cebolla", "champiñones"],
            "price": 11.99
        }
    ];
    fs.readFile('pizzas.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const pizzas = JSON.parse(data);
        const existingPizzaIds = pizzas.map(pizza => pizza.id);
        const newPizzaIds = pizzasToAdd.map(pizza => pizza.id);
        const shouldAddPizzas = newPizzaIds.some(id => !existingPizzaIds.includes(id));
        if (shouldAddPizzas) {
            pizzasToAdd.forEach(newPizza => {
                pizzas.push(newPizza);
            });
            fs.writeFile('pizzas.json', JSON.stringify(pizzas), (err) => {
                if (err) {
                    console.error('Error writing to JSON file:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.status(201).json(pizzasToAdd);
            });
        } else {
            res.status(200).json({ message: "" });
        }
    });
});

app.get('/pizzas', (req, res) => {
    fs.readFile('pizzas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const pizzas = JSON.parse(data);
        res.json(pizzas);
    });
});

app.get('/pizzas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('pizzas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const pizzas = JSON.parse(data);
        if (id < 1 || id > pizzas.length) {
            return res.status(404).json({ message: "Pizzas not found" });
        }
        const pizza = pizzas[id - 1];
        res.json(pizza);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});


// https://pizzamexico-30c141ccf491.herokuapp.com/pizzas

// C: CREATE - Creates a new record.

// r: READ - Reads information from a record.

// U: UPDATE - Updates the record data.

// D: DELETE - Deletes a record.