module.exports = (query, paginationObject) => {

    if (query.page && parseInt(query.page) > 0) {
        paginationObject.currentPage = parseInt(query.page)
    }

    if (query.limit && parseInt(query.limit) > 0) {
        paginationObject.limit = parseInt(query.limit)
    }
    
    paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limit

    paginationObject.totalPages = Math.ceil(paginationObject.totalRecords / paginationObject.limit)
    return paginationObject
}