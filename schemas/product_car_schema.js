module.exports = {
    type: 'object',
    required: ['product', 'price', 'userId'],
    properties: {
        product: { type: 'string' },
        price: { type: 'string' },
        userId: {type: 'string'}
    }
};