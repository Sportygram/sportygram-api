export interface Price {
    value: number;
    currency: string;
    vat: number;
    stringRepresentation: string;
}

export interface Product {
    name: string;
    description: string;
    longDescription: string;
    imageOne: string;
    imageTwo: string;
    imageThree: string;
    price: Price;
}

const getDefaults = (): Product => ({
    name: "mock name",
    description: "mock description",
    longDescription: "mock long description",
    imageOne: "mock imageOne src",
    imageTwo: "mock imageTwo src",
    imageThree: "mock imageThree src",
    price: getPriceMock(),
});

export const getProductMock = (p?: Partial<Product>): Product => ({
    ...getDefaults(),
    ...p,
});

const getPriceDefaults = (): Price => ({
    value: 1000,
    currency: "EUR",
    vat: 190,
    stringRepresentation: "1190 &euro;",
});

export const getPriceMock = (p?: Partial<Price>): Price => ({
    ...getPriceDefaults(),
    ...p,
});
