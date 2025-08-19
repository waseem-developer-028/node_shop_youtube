const { Router } = require('express')
const {registerValidation, otpValidation, verifyotpValidation, loginValidation, socialLoginValidation, forgotPasswordValidation, refreshTokenValidation } = require('../../../validator/user')
const {register, resendOtp, verifyOtp, login, socialLogin, logout, forgotPassword,  refreshToken} = require('../../../controllers/user/user.controller')
const router = Router()

router.post('/register',registerValidation,register)
router.post('/sendotp',otpValidation,resendOtp)
router.post('/verifyotp',verifyotpValidation,verifyOtp)
router.post('/login',loginValidation,login)
router.post('/sociallogin',socialLoginValidation, socialLogin)
router.post('/logout',logout)
router.post('/forgotpassword', forgotPasswordValidation, forgotPassword)
router.post('/refreshtoken', refreshTokenValidation, refreshToken)


module.exports = router;
