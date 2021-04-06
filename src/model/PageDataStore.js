export default class PageDataStore {
    constructor() {
        this.data = {};
    }

    addPage(page, data) {
        this.data[page] = data;
    }

    hasPage(page) {
        return Object.keys(this.data).includes(page.toString());
    }

    getPage(page) {
        if (this.hasPage(page)) {
            return this.data[page];
        } else {
            throw Error(`Page ${page} not saved to store`);
        }
    }
}