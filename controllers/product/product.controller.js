const Product       = require('../../models/product')
const Cart          = require('../../models/cart')
const ProductRating = require('../../models/productRating')
const {settings:{PER_PAGE_RECORDS}} = require('../../constant/common')
const _ = require('lodash')

const getLatestProducts = async (req, res) => {
  try {

       const rows = await Product.find({},{id:"$_id",_id:0,name:1,price:1,image:1}).limit(4)

       return helper.sendSuccess(rows, res, req.t("data_retrived"),200)
    
  } catch (e) {
    return helper.sendException(res, e.message, e.code)
  }
}

const products = async (req, res) => {
    try {
     
        const { page=1 }    = req.query
        let   { price, categories, rating  }    = req.body
        let sort
        let match={status:1}
        let metaDataAggregation = []

        
         
        //dynamic sorting for price
        if(!_.isEmpty(price))
        {
          
          let priceOrder = (_.lowerCase(price)=='asc') ? 1 : -1;  
           sort = {...sort,price:priceOrder} 
        }

        if(!_.isEmpty(categories) && _.isArray(categories))
        {
           categories = _.map(categories, (val)=>
               helper.ObjectId(val))
           
           match = {...match,category:{$in:categories}}
        }


        const { offset, limit } = helper.paginate(page, PER_PAGE_RECORDS);

        if(!_.isEmpty(rating) && _.isArray(rating))
        {
          metaDataAggregation = [] 

          rating  = _.map(rating, (val)=>
          parseInt(val))

          let min = _.min(rating)
          let max = _.max(rating)
      
          let ratingMatch = (rating.length > 1) ? {$and: [ {avgRating: {$gte:min} }, {avgRating: {$lte:max} } ] } : {avgRating:{$in: rating }} 

          metaDataAggregation.push(
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
            {
                $match : ratingMatch
            },
            { $skip: offset }, { $limit: limit },
            { $project:{id:"$_id",_id:0,name:1,price:1,image:1,qty:1,total:1} }
            )
        }

        else{
          metaDataAggregation = []

          metaDataAggregation.push( 
            { $skip: offset }, { $limit: limit },
            { $project:{id:"$_id",_id:0,name:1,price:1,image:1,qty:1} })
        }
        
        //dynamic sorting for price and created:-1
        sort = {...sort,createdAt: -1}

    
       

         const rows = await Product.aggregate([
            {
                $match:match
            },
            { 
                $sort:sort
            },
            { 
              $facet    : {
              metadata: [ { $count: "total" } ],
              data: metaDataAggregation
            } 
          }
        ])
        let total;
        if(!_.isEmpty(rating) && !_.isEmpty(rows[0].data))
         total =  rows[0].data[0].total
        else if (!_.isEmpty(rating) && _.isEmpty(rows[0].data))
        total = 0
        else
        total =  rows[0].metadata[0].total


        const data ={
            docs:rows[0].data,
            page: +page || 1,
            limit:limit,
            total: total
        }

        
  
         return helper.sendSuccess(data, res, req.t("data_retrived"),200)
      
    } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
  }


const  showProduct = async (req, res) => {
    try {
         const { product_id, user_id } = req.query
         if(_.isEmpty(product_id) || !helper.ObjectId.isValid(product_id))
         return  helper.sendError({},res,'product not found',405)

           
         const product = await Product.findById(product_id).select('_id name image price qty category information')
         let data =[];


         if(!product)
         return  helper.sendError({},res,'product not found',405)

         const productRating = await ProductRating.aggregate(
          [
            {
              $match:{product_id:helper.ObjectId(product._id)}
            },
            { 
              $facet    : {
              reviewCount: [ { $count: "reviewCount" } ],

              avgRating: [ 
              {
                $group:
                  {
                    _id: "$product_id",
                    avgRating: { $avg: "$rating" }
                  }
               },
               {
                $project: {_id:0,avgRating:{$round:["$avgRating",1]},reviewCount:1 }
               } 
              ],

              comments: [ 
                {
                  $lookup: {
                      from: "users",
                      localField: "user_id",
                      foreignField: "_id",
                      as: "user"
                  }
                },
                {
                  $unwind:"$user"
                },
                 {
                  $project: {_id:0,name:"$user.name",comment:1,rating:1, created_at:"$createdAt"}
                 } 
                ]
            } 
           }
          ]
       )

      
         let relatedProducts    = await Product.aggregate([
          {
            $match: {status:{$eq:1},category:{$eq:helper.ObjectId(product.category)},_id:{$ne:helper.ObjectId(product.id)}}
          }, 
          {
            $sample: {size: 4}
          },
          {
            $project:{id:'$_id',_id:0,name:1,qty:1,price:1,image:1,category:1}
          }
          ])

          let isCart       = false

          if(!_.isEmpty(user_id) && helper.ObjectId.isValid(user_id))
          {
            const checkCart = await Cart.findOne({$and:[
              {product_id:{$eq:helper.ObjectId(product_id)}},
              {user_id:{$eq:helper.ObjectId(user_id)}}
            ]},{user_id:1})
            isCart = (!checkCart) ? false : true  
          }


          data.push({
            extra:{
              top_information:product.information.substr(0,250),
              reviewsCount: (!_.isEmpty(productRating[0].reviewCount)) ? productRating[0].reviewCount[0].reviewCount : 0,
              avg_rating   : (!_.isEmpty(productRating[0].avgRating)) ? productRating[0].avgRating[0].avgRating : 0,
              isCart: isCart
            },
             product: product,
             reviews:(!_.isEmpty(productRating[0].comments)) ? productRating[0].comments : [],
             relatedProducts:relatedProducts
          })
         
         data = data[0]
          
  
         return helper.sendSuccess(data, res, req.t("data_retrived"),200)
      
    } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
  }

  

module.exports = {
    getLatestProducts,
    products,
    showProduct
};
