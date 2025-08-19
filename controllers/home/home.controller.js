/* global LOCALE */
const Product = require('../../models/product')
const _ = require('lodash')


const getHomeProducts = async (req, res) => {
  try {
    const category = req.query.category
    if (_.isEmpty(category) || category == 0 || !helper.ObjectId.isValid(category)) {
      const rows = await Product.find({}, { id: "$_id", name: 1, price: 1, image: 1 }).limit(4).sort({ createdAt: -1 })

      return helper.sendSuccess(rows, res, req.t("data_retrived"), 200)
    }
    else {
      const rows = await Product.find({ category: helper.ObjectId(category) }).limit(4).sort({ createdAt: -1 })

      return helper.sendSuccess(rows, res, req.t("data_retrived"), 200)
    }

  } catch (e) {
    return helper.sendException(res, e.message, e.code)
  }
};

const topRatedProducts = async (req, res) => {
  try {
    
      const rows = await Product.aggregate([
        {
          $match: {status: 1}
        },
        {
          $lookup: {
            from: 'product_ratings',
            localField: '_id',
            foreignField: 'product_id',
            as: 'ratings'
          }
        },
        { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },

        {
          $project: { id: '$_id', _id: 1, name: 1, price: 1, image: 1, 
              qty: 1, ratings:{ $ifNull: [ "$ratings.rating", 0 ] }}
        },

        {
          $group: {
             _id:        "$id",
             avgRating:  { $avg: "$ratings" },
             total:      { $sum:1 },
             name:       { $first: "$name" },
             price:      { $first: "$price" },
             image:      { $first: "$image" },
             qty:        { $first: "$qty" }
            
          }
        },
        
        {$match: {avgRating: {$gt: 0}}},

        {$sort: {avgRating: -1}},

        { $limit: 4 },

        { $project:{id:"$_id",_id:0,name:1,price:1,image:1,qty:1} }

      ])

      return helper.sendSuccess(rows, res, req.t("data_retrived"), 200)

  } catch (e) {
    return helper.sendException(res, e.message, e.code)
  }
}

module.exports = {
  getHomeProducts,
  topRatedProducts
};
