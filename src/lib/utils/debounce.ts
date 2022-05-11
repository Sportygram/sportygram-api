const cache: Record<string, number> = {};
const epoch = () => new Date().getTime();

export const debounce = (f: (...args: any[]) => any, wait: number) => <
    T extends Parameters<typeof f>
>(
    key: string,
    ...args: T
): ReturnType<typeof f> => {
    if (cache[key] && epoch() < cache[key]) {
        throw new Error("Key Processed");
    }
    cache[key] = epoch() + wait;
    // console.log(f);
    return f.apply(args);
};

// TODO: Create debounce with a key resolver function and another with redis key resolver
