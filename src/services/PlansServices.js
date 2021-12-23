import { HttpClient } from "./HttpClient";

const baseURL = '/plans';
class PlansService {
    async get() {
        return HttpClient.get(`${baseURL}`)
    }
}

export default new PlansService();