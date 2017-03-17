/**
 * 服务器地址，api地址
 */




/**------------- 商城服务器地址---------------*/
// const mallBaseurl = 'http://192.168.4.240:9050';
// const mallBaseurl = 'http://192.168.4.240:9050';
const mallBaseurl = 'http://192.168.4.240:9050';


/**------------- 会员服务服务器地址---------------*/
const memberBaseUrl ='http://192.168.4.240:9050';
const memberBaseUrl8097 ='http://192.168.4.240:8097';  //测试


/**------------- O2O服务器地址---------------*/
const otoBaseUrl = '';


/**-------------------------商城相关Api-----------------------------*/

/*首页数据*/
export const homePage = mallBaseurl+'/mall/mall_commodity_service/v1/home/display/specific';
/*一级分类*/
export const topCategory = mallBaseurl+'/mall/mall_commodity_service/v1/category/tops';
/*二级分类*/
export  const childCategory = mallBaseurl+'/mall/mall_commodity_service/v1/category/children';
/*商品搜索列表*/
export const searchList = mallBaseurl+'/mall/mall_commodity_service/v1/product/search';

/*获取默认地址*/
export const defaultAddress =mallBaseurl+'/mall/mall_user_service/v1/address/prefered/get';
/*获取商品价格（立即购买使用）*/
export const price =mallBaseurl+'/mall/mall_shoppingcart_service/v1/shoppingcart/calculate/only';

/*获取商品详情*/
export const goodsInfo = mallBaseurl + '/mall/mall_commodity_service/v1/product/get';

/*添加购物车*/
export const addCart = mallBaseurl + '/mall/mall_shoppingcart_service/v1/shoppingcart/add';

/* 获取购物车商品价格*/
export const Total = mallBaseurl + '/mall/mall_shoppingcart_service/v1/shoppingcart/calculate';

/* 创建订单*/
export const multibuy = mallBaseurl + '/mall/mall_order_service/v1/order/multibuy';
/* 创建订单(立即购买，非购物车)*/
export const buy = mallBaseurl + '/mall/mall_order_service/v1/order/buy';

/*获取购物车列表*/
export const shopCartListUrl = mallBaseurl + '/mall/mall_shoppingcart_service/v1/shoppingcart/search';
/*删除购物车item*/
export const shopCartDeleteUrl = mallBaseurl + '/mall/mall_shoppingcart_service/v1/shoppingcart/delete/multi'
/*更新购物车数量*/
export const shopCartUpdateNumberUrl = mallBaseurl + '/mall/mall_shoppingcart_service/v1/shoppingcart/updatenum'

/*获取订单支付详情*/
export const payDetailUrl = mallBaseurl + '/mall/mall_order_service/v1/order/orders/stat'
/*获取积分支付*/
export const payCreditUrl = mallBaseurl + '/mall/mall_order_service/v1/pay/credit'
/*获取支付宝支付*/
export const payAlipayUrl = mallBaseurl + '/mall/mall_order_service/v1/pay/alipay'
/*获取微信支付*/
export const payWechatUrl = mallBaseurl + 'mall/mall_order_service/v1/pay/weixin'

/**-----------------------------------------会员系统Api-----------------------------*/

/*会员登录*/
export const login = memberBaseUrl8097 +'/member/front_user_center/v1/baseop/login';

/*获取当前登录会员基本信息*/
export const memberInfo = memberBaseUrl  +'/member/member_service/v1/membersbasicinforop/getmemberbasicinfo';