// {
// 	defaultCurrency: "USD",
// 	assets: {
// 		stocks: { AAPL: { reinvestDividends: true } },
// 		cash: {
// 			names: ["First Bank", "Access Bank"],
// 		},
// 		fixed: {
// 			names: ["PiggyVest"],
// 		},
// 		crypto: {},
// 	},
// }

export type Settings = {
    assets?: {
        stocks: any;
        fixed: any;
        cash: any;
        crypto: any;
    };
};
