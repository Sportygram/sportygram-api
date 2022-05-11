type nil = undefined | null;

const isNil = (x: any): x is nil => x === null || x === undefined;

export { nil, isNil };
