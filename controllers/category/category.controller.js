/* global LOCALE */
const Product    = require('../../models/product')
const Category   = require('../../models/category')


const getAllCategories = async (req, res) => {
  try {
    
      //  let  cateIds = await Product.distinct('category') laravel pluck example
      
      //  //get all categories if has atleast one product
      //  const rows = await Category.find({_id: {$in: cateIds} }).sort({createdAt:-1}) 

       const rows = await Product.aggregate([       
        {
          $lookup:{
             from:'categories',
             localField:'category',
             foreignField:'_id',
             as:'cat'
          }
        },
        //use unwind to array to object conversion becasue mongodb alwayas return array
        {
           $unwind:"$cat"
        }, 

        {
         $project: {
           _id:0,
           "categoryId":"$cat._id",
           "name":"$cat.name"
         }
        },

        {
         $group : {
          _id:"$categoryId",
          categoryId: { $first: '$categoryId' },
          name: { $first: '$name' }
        }
       },
       
       {
         $project: {
          _id:0, 
          name:1,
          id:"$categoryId"
         }
       }
       
     ]);
       return helper.sendSuccess(rows, res, req.t("data_retrived"),200)
    
  } catch (e) {
    return helper.sendException(res, e.message, e.code)
  }
};



module.exports = {
  getAllCategories
};
