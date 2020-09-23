module.exports = {
    type: 'object',
    required: ['username', 'password', 'name', 'lastname', 'number', 'address'],
    properties: {
        username: { type: 'string', pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$" },
        password: { type: 'string' },
        name: { type: 'string' },
        lastname: { type: 'string' },
        number: { type: 'string' },
        address: { type: 'string' }
    }
};
