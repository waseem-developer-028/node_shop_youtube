const Notification = require('../../models/notification')
const User = require('../../models/user')
const moment = require('moment')
const _ = require('lodash')


const notifications = async (req, res) => {

    const token = req.headers['Authorization'] || req.headers['authorization']
    
    const { page = 1 }      = req.query

    try {
        const user = await User.findOne({ api_token: token })
        const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'data',
        limit: 'limit',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'last_page',
        pagingCounter: 'slNo',
        meta: 'paginator',
      };
      
      const options = {
        page: page,
        limit: 3,
        sort: { createdAt: -1 },
        customLabels: myCustomLabels,
      };


        let data = await Notification.paginate({ user_id: helper.ObjectId(user._id) }, options)
       const ids =  _.map(data.data, '_id')

        await Notification.updateMany({ _id: { $in: ids } }, { read_at: Date.now() })
        data = {
            
                data:data.data,
                itemCount: data.paginator.itemCount,
                limit: data.paginator.limit,
                last_page: data.paginator.last_page,
                currentPage: data.paginator.currentPage,
                slNo: data.paginator.slNo,
                hasPrevPage: data.paginator.hasPrevPage,
                hasNextPage: data.paginator.hasNextPage,
                prev: data.paginator.prev,
                next: data.paginator.next
            
        }

        return helper.sendSuccess(data, res, req.t("data_retrived"), 200)

    } catch (e) {
        return helper.sendException(res, e.message, e.code)
    }
}

const unreadCount = async (req, res) => {

    const token = req.headers['Authorization'] || req.headers['authorization']

    try {
        const user = await User.findOne({ api_token: token })
        let unread = await Notification.aggregate([
            {
                $match: { user_id: helper.ObjectId(user._id), read_at: null }
            },
            { $count: "count" }
        ])

        unread = (!_.isEmpty(unread)) ? unread[0].count
        : 0
       
        return helper.sendSuccess(unread, res, req.t("data_retrived"), 200)
    } catch (e) {
        return helper.sendException(res, e.message, e.code)
    }
}


module.exports = {
   notifications, 
   unreadCount,
};
