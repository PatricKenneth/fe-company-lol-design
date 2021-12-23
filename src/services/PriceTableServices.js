import { HttpClient } from "./HttpClient";

const baseURL = '/price-table';
class PriceTableService {
    async get() {
        return HttpClient.get(`${baseURL}`)
    }
}

export default new PriceTableService();