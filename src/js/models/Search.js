import axios from 'axios';
import { proxy, apiUrl } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const url = `${apiUrl}/search?&q=${this.query}`;
        try {
            const response = await axios(`${proxy}${url}`);
            this.result = response.data.recipes;
        } catch (error) {
            console.log(error);
        }
    }
}
