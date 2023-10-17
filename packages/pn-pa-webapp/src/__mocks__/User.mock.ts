enum LinkType {
    INTERNAL = 'internal',
    EXTERNAL = 'external',
}

export const productsListDTO = [
    {
        id: '0',
        title: `Product 1`,
        urlBO: '',
    },
    {
        id: '1',
        title: `Product 2`,
        urlBO: 'https://www.product.com',
    },
];

export const partyListDTO = [
    {
        id: '0',
        description: `Party 1`,
        userProductRoles: ['Role 1']
    },
    {
        id: '1',
        description: `Party 2`,
        userProductRoles: ['Role 2']
    },
];