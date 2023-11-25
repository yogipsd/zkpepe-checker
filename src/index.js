import FileHelper from "./utils/fileHelper.js";
import WalletFetcher from "./utils/fetchHelper.js";
import {text1, text2, text3, text4} from "./utils/other.js";


async function processBatch(wallets, proxies, batchIndex, batchSize) {
    const startIndex = batchIndex * batchSize;
    const endIndex = startIndex + batchSize;
    const batchWallets = wallets.slice(startIndex, endIndex);
    const results = [];

    for (const wallet of batchWallets) {
        const proxy = proxies[batchIndex % proxies.length];
        const fetcher = new WalletFetcher(wallet, proxy);
        const balance = await fetcher.fetchBalance();
        results.push({ wallet, balance });
    }

    return results;
}

async function main() {

    const text = [text1, text2, text3, text4];
    console.log(text[Math.floor(Math.random() * text.length)]);

    const values = await FileHelper.loadFileData({
        proxies: "./data/proxies.txt",
        addresses: "./data/addresses.txt"
    });

    const wallets = values.addresses;
    const proxies = values.proxies;

    FileHelper.checkError(wallets, proxies)

    const batchSize = 1;
    const batchCount = Math.ceil(wallets.length / batchSize);
    const allResults = [];

    for (let i = 0; i < batchCount; i++) {
        const batchResults = await processBatch(wallets, proxies, i, batchSize);
        allResults.push(...batchResults);
    }

    FileHelper.printResultsToConsole(allResults);
    FileHelper.createCSVFile(allResults, "./data/result.csv");
}

await main()