interface HTTPResponseModel {
    meta: {
        "page": number;
        "pageSize": number;
        "pages": number;
    };
    data: any[];
}