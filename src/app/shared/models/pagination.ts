export class Pagination {
    page: number;
    pageSize: number;
    totalCount: number;
    sizeOptions: number[];
    showAll: boolean;
    // showAll: number | boolean;

    constructor(page = 1, pageSize = 5, totalCount = 0) {
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.sizeOptions = [2, 5, 10, 25, 100, 250, 500, 1000];
        this.showAll = false;
    }

    public setValues(page: Pagination) {
        this.page = page.page ?? this.page;
        this.pageSize = page.pageSize ?? this.pageSize;
        this.totalCount = page.totalCount ?? this.totalCount;
        this.showAll = page.showAll ?? this.showAll;
    }

    public setShowAll() {
        this.showAll = !this.showAll;
    }
}
