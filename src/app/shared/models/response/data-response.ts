import { LinkResponse } from "./link-response";

export class DataResponse {
    current_page: number;
    data: Array<any>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<LinkResponse>;
    linnext_page_urlks: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;

    constructor() {
        this.current_page = 1;
        this.data = new Array<any>;
        this.first_page_url = "";
        this.from = 1;
        this.last_page = 1;
        this.last_page_url = "";
        this.links = new Array<LinkResponse>;
        this.linnext_page_urlks = "";
        this.path = "";
        this.per_page = 5;
        this.prev_page_url = "";
        this.to = 1;
        this.total = 1;
    }
}
