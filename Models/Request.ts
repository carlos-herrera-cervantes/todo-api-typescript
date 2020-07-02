'use strict';

import { resolve, parse } from "path";

class Request {

    private queryParams: any;
    private queryFilter: any = {};

    constructor (queryParams: any) {
        this.queryParams = queryParams;
    }

    public setSort (): any {
        if ('sort' in this.queryParams) {
            const sort = this.queryParams.sort;
            const isAscending = sort.includes('-');
            const result = {};
            const property = isAscending ? sort.split('-').pop() : sort;
            result[property] = isAscending ? -1 : 1;
            this.queryFilter.sort = result;
            return this;
        }

        this.queryFilter.sort = {};
        return this;
    }

    public setPagination (): any {
        const isValidPaginate = 'paginate' in this.queryParams && 'page' in this.queryParams && 'pageSize' in this.queryParams;

        if (isValidPaginate) {
            const { page, pageSize } = this.queryParams;
            const parsePage = page == 1 ? 0 : page == 0 ? 0 : page -1;
            this.queryFilter.pagination = { page: parsePage * pageSize, pageSize };
            return this;
        }

        this.queryFilter.pagination = { page: 0, pageSize: 0 };
        return this;
    }

    public setCriteria (): any {
        if (Object.entries(this.queryParams).length === 0) {
            this.queryFilter.criteria = {};
            return this;
        }

        const isNotValidCriterias = [ 'sort', 'paginate', 'page', 'pageSize', 'relation' ];
        const result = {};
        Object.entries(this.queryParams).forEach(([ key, value ]) => {
            if (!isNotValidCriterias.includes(key)) {
                result[key] = value;
            }
        });

        this.queryFilter.criteria = result;
        return this;
    }

    public setRelation (): any {
        if ('relation' in this.queryParams) {
            this.queryFilter.relation = JSON.parse(this.queryParams.relation);
            return this;
        }

        this.queryFilter.relation = [];
        return this;
    }
}

export { Request };