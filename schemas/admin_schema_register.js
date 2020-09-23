module.exports = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string', pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$" },
        password: { type: 'string' }
    }
};