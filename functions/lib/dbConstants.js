/**
 * All the column names of database tables will be freezed here.
 */
module.exports = Object.freeze({
    USERSTABLE: 'users',
    USERTABLEFIELD: {
        USERID : 'user_id',
        USERNAME:'user_name',
        GENDER: 'gender',
        CITY: 'city'
    },
    USERROLESTABLE: 'user_roles',
    USERROLESTABLEFIELD: {
        ID: 'id',
        USERID: 'user_id',
        USERROLE: 'user_role'
    },
    PRODUCTSTABLE: 'products',
    PRODUCTSTABLEFIELD: {
        PRODUCTID: 'product_id',
        PRODUCTNAME: 'product_name',
        PRODUCTPRICE: 'product_price',
        PRODUCTDISCOUNT: 'product_discount',
        PRODUCTFEATURES: 'product_features',
        PRODUCTAVAILABLECOUNT: 'product_available_count',
        CATEGORY_ID: 'category_id'
    },
    CATEGORIESTABLE: 'categories_table',
    CATEGORYFIELD: {
        CATEGORYID: 'category_id',
        CATEGORYNAME: 'category_name',
    }
});