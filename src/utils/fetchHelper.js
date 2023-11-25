import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

export default class WalletFetcher {

    constructor (wallet, proxy = null) {
        this.wallet = wallet;
        this.proxy = proxy;
        this.config = { timeout: 5000 };

        if (this.proxy) {
            this.config.httpsAgent = this.proxy.includes('http') ? new HttpsProxyAgent(this.proxy) :
                this.proxy.includes('socks') ? new SocksProxyAgent(this.proxy) : null;
        }
    };

    async fetchBalance () {
        const url = `https://www.zksyncpepe.com/resources/amounts/${this.wallet.toLowerCase()}.json`;
        try {
            const response = await axios.get(url, this.config);
            if (response.data[0] === '<'){
                return 0;
            } else {
                return response.data;
            }

        } catch (e) {
            console.log('Error fetching balance:', e.toString());
            return 0;
        }
    };
};
