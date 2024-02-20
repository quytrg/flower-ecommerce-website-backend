const ApiError = require('../../middlewares/api-error.js')
const AccountService = require('../../services/admin/account.service.js')
const searchHelper = require('../../helpers/search.helper.js')
const md5 = require('md5')

// [GET] /accounts
module.exports.find = async (req, res, next) => {
    try {
        const filter = { 
            deleted: false,
        }
        if (req.query.status) {
            filter.status = req.query.status
        }
        if (req.query.category) {
            filter.category = req.query.category
        }
        if (req.query.keyword) {
            const searchObj = searchHelper(req.query)
            filter.fullName = searchObj.regex
        }

        const accountService = new AccountService()
        const accounts = await accountService.find(filter)
        return res.send(accounts)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the accounts")
        )
    }
}

// [PATCH] /accounts/change-status/:id
module.exports.updateOne = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        const data = { ...req.body }
        data.password = md5(data.password)
        
        const accountService = new AccountService()
        const document = await accountService.updateOne(req.params.id, data)
        
        if (!document) {
            return next(new ApiError(404, "Account not found"))
        }

        res.send({
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

    const accountService = new AccountService()

    try {
        // const data = { ...req.body }
        // data.price = parseInt(req.body.price)
        // data.discountPercentage = parseInt(req.body.discountPercentage)
        // data.stock = parseInt(req.body.stock)

        // if (!req.body?.position) { 
        //     data.position = await productService.count() + 1
        // } 
        // else {
        //     data.position = parseInt(req.body.position)
        // }

        // if (!req.body?.category || req.body.category === '') {
        //     data.category = 'fresh-flowers'
        // }

        // if (req.file) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`
        // }

        const data = { ...req.body }

        data.password = md5(data.password)

        const document = await accountService.create(data)

        res.send({
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

// [PATCH] /accounts/change-multi
// module.exports.updateMany = async (req, res, next) => {
//     if (Object.keys(req.body).length === 0) {
//         return next(new ApiError(400, "Data update cannot be empty"))
//     }

//     try {
//         const productService = new ProductService()

//         const { idList, type } = req.body

//         let document = {}

//         switch (type) {
//             case 'active':
//             case 'inactive':
//                 document = await productService.updateMany(idList, { status: type })
//                 break 
//             case 'delete':
//                 document = await productService.updateMany(idList, {
//                     deleted: true,
//                     deletedAt: new Date()
//                 })
//                 break
//             // case 'position':
//             //     for(const item of idList) {
//             //         const [ id, position ] = item.split('-')
//             //         await productService.updateOne({ _id: id }, { position: position })
//             //     }
//             //     break
//             default:
//                 break
//         }

//         res.send({
//             message: "Change state of multiple product successfully",
//             updatedDocument: document
//         })
//     }
//     catch (err) {
//         return next(
//             new ApiError(500, `An error occurred while changing the state of multiple product`)
//         )
//     }
// }


// [GET] /accounts/:id
module.exports.findOne = async (req, res, next) => {
    try {
        const { id } = req.params
       
        const accountService = new AccountService()
        const account = await accountService.findById(id)
        return res.send(account)
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

        res.send({
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



