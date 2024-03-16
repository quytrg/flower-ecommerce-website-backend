const ApiError = require('../../middlewares/api-error.js')
const AccountService = require('../../services/admin/account.service.js')

// helpers
const searchHelper = require('../../helpers/search.helper.js')
const paginationHelper = require('../../helpers/pagination.helper.js')

// hash password with bcrypt
const bcrypt = require('bcrypt')

// [GET] /accounts
module.exports.find = async (req, res, next) => {
    try {
        const accountService = new AccountService()

        const filter = { 
            deleted: false,
        }

        // filter by status
        if (req.query.status) {
            filter.status = req.query.status
        }

        // seach
        if (req.query.keyword) {
            const searchObj = searchHelper(req.query)
            filter.fullName = searchObj.regex
        }

        // pagination
        const initPagination = {
            currentPage: 1,
            limit: 6
        }
        
        initPagination.totalRecords = await accountService.count(filter)
        const paginationObject = paginationHelper(req.query, initPagination)

        const accounts = await accountService.find(filter, paginationObject)
        return res.json({
            accounts,
            totalPages: paginationObject.totalPages,
            limit: paginationObject.limit,
            skip: paginationObject.skip
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the accounts")
        )
    }
}

// [PATCH] /accounts/:id
module.exports.updateOne = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        // hash password
        if (req.body.password) {
            // check if password confirmation is match or not
            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({
                    message: 'Passwords do not match'
                })
            }
            const plainTextPassword = req.body.password;
            const saltRounds = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(plainTextPassword, saltRounds);
        }

        const filter = {
            _id: req.params.id
        }

        const accountService = new AccountService()
        const document = await accountService.updateOne(filter, req.body)
        
        if (!document) {
            return next(new ApiError(404, "Account not found"))
        }

        res.status(200).json({
            message: "Account was updated successfully",
            updatedDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `Error retrieving account with id: ${req.params.id}`)
        )
    }
}

// [POST] /accounts/create
module.exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        const accountService = new AccountService()

        // check if account already exists
        const { email } = req.body
        const filter = {
            email,
            deleted: false
        }
        const account = await accountService.findOne(filter)
        if (account) {
            res.status(409).send('Email already exists!')
            return
        }
        // check if password confirmation is match ot not
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            })
        }
        // hash password
        if (req.body.password) {
            const plainTextPassword = req.body.password;
            const saltRounds = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(plainTextPassword, saltRounds);
        }

        const document = await accountService.create(req.body)

        res.status(201).json({
            message: "Create a new account successfully",
            updatedDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `An error occurred while creating a new account`)
        )
    }
}

// [GET] /accounts/:id
module.exports.findOne = async (req, res, next) => {
    try {
        const { id } = req.params
        const filter = {
            _id: id,
            deleted: false,
        }
       
        const accountService = new AccountService()
        const account = await accountService.findOne(filter)
        return res.json(account)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the account")
        )
    }
}

// [DELETE] /accounts/:id
module.exports.deleteOne = async (req, res, next) => {
    try {
        const { id } = req.params

        const accountService = new AccountService()
        const document = await accountService.deleteOne(id)

        res.json({
            code: 200,
            message: `Delete account ${id} successfully`,
            updatedDocument: document
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while deleting the account")
        )
    }
}



