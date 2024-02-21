module.exports = (query, paginationObject) => {

    if (query.page) {
        paginationObject.currentPage = parseInt(query.page)
    }
    
    paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limit

    paginationObject.totalPages = Math.ceil(paginationObject.totalRecords / paginationObject.limit)
    return paginationObject
}