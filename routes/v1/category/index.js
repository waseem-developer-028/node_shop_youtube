const { Router } = require('express')
const { getAllCategories } = require('../../../controllers/category/category.controller')
const router = Router()

router.get('/',getAllCategories)

module.exports = router;
