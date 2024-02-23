const ApiError = require('../../middlewares/api-error.js')
const AccountService = require('../../services/admin/account.service.js')

// hash password with bcrypt
const bcrypt = require('bcrypt')

module.exports.login = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        
        const filter = {
            email: req.body.email,
            deleted: false
        }
        const account = await accountService.findOne(filter)
        
        // check if the account exists or not
        if (!account) {
            res.status(404).send("Email does not exist!")
            return
        }

        // check password
        const hashedPassword = account.password
        const plaintextPassword = req.body.password;
        const match = await bcrypt.compare(plaintextPassword, hashedPassword);
        if (!match) {
            res.status(404).send("Wrong password!")
            return
        }

        // check if the account is locked or not
        if (account.status === 'inactive') {
            res.status(404).send("Account is locked!")
            return
        }

        // remove password before returning data
        const { password, ...info } = account._doc
        res.status(200).json(info)

    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while logging in")
        )
    }
}