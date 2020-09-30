module.exports = {
    type: 'object',
    required: ['state', 'payment', 'userId'],
    properties: {
        state: { type: 'string'},
        payment: { type: 'string' },
        userId: {type: 'integer'}
    }
};