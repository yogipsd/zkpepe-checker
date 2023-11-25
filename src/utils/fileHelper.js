import fs from 'fs';


export default class FileHelper {

    static async loadFileData (files) {
        try {
            const result = {};
            for (const [key, path] of Object.entries(files)) {
                result[key] = fs.readFileSync(path, 'utf8')
                    .split('\n')
                    .map(row => row.trim())
                    .filter(row => row !== '');
            }
            return result;
        } catch (err) {
            console.error(`Error while loading wallet data: ${err.message}`);
            throw err;
        }
    };

    static createCSVFile (data, filePath) {
        const headers = ['№', 'Wallet', 'Balance'];
        const writeStream = fs.createWriteStream(filePath);
        let totalBalance = 0;

        writeStream.write(headers.join(',') + '\n');

        for (let [index, item] of data.entries()) {
            const row = [index + 1, item.wallet, item.balance];
            totalBalance += Number(item.balance);
            writeStream.write(row.join(',') + '\n');
        }

        writeStream.end();
        console.log(`\x1b[32mData has been written to CSV file. Total - ${totalBalance}\x1b[0m`);
    };

    static checkError(wallets, proxies) {
        if (wallets.length === 0) {
            console.error("\x1b[31mNo addresses in ./data/addresses.txt\x1b[0m");
            process.exit(1);
        }

        if (proxies.length > 0 && (wallets.length !== proxies.length)) {
            console.error("\x1b[31mAmount of proxies and addresses doesn't match\x1b[0m");
            process.exit(1);
        }

        console.log("\x1b[32mData loaded successfully\x1b[0m");
    };

    static printResultsToConsole(data) {
        const tableData = data.map((item, index) => ({
            'Wallet': item.wallet,
            'Balance': item.balance
        }));

        console.table(tableData);
    };
};
