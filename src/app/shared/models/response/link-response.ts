export class LinkResponse {
    url: string;
    label: string;
    active: boolean;

    constructor() {
        this.url = "";
        this.label = "";
        this.active = false;
    }
}
