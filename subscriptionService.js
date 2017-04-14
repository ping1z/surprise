var SubscriptionDao = require("./dao/subscriptionDao.js");
var subscription = new SubscriptionDao();
var AddressDao = require("./dao/addressDao.js");
var address = new AddressDao();
var CardDao = require("./dao/cardDao.js");
var card = new CardDao();
var OrderDao = require("./dao/orderDao.js");
var order = new OrderDao();
var TaxRateDao = require("./dao/taxRateDao.js");
var raxRateDao = new TaxRateDao();

var calculateOrderSummary = function(items,rate){
    // calculate order info
    var orderSummary = {
      taxRate:rate,
      totalBeforeTax:0,
      tax:0,
      shippingCost:0,
      total:0
    };
    for(var i=0;i<items.length;i++){
        orderSummary.totalBeforeTax+=items[i].price * items[i].quantity;
    }
    orderSummary.tax = orderSummary.totalBeforeTax * orderSummary.taxRate;
    if(orderSummary.totalBeforeTax>50){
        orderSummary.shippingCost = 0;
    }else{
            orderSummary.shippingCost = 1.0;
    }
    orderSummary.total = orderSummary.totalBeforeTax+orderSummary.tax + orderSummary.shippingCost;

    return orderSummary;
}

function createSubscriptionOrderService(){
    subscription.findOneAvaliable(function(err,r){
        if(err){
            var error={msg:err.message,stack:err.stack};
        }
        if(r!=null){
            console.log("Find 1: ",r);
            var subItem = r;
            subItem.sku = subItem.productSKU;
           
            address.get(subItem.addressId,function(err,address){
                if(address==null){
                     throw new Error('Ivalide addressId='+subItem.addressId);
                }
                
                card.get(subItem.cardId,function(err,card){
                    if(card==null){
                        throw new Error('Ivalide cardId='+subItem.cardId);
                    }
                    raxRateDao.getTaxRate(address.state,function(err,rate){
                        var orderSummary = calculateOrderSummary([subItem],rate);
                        order.placeOrder(subItem.customerId, orderSummary, address, card, [subItem],function(){
                            subscription.updateNextOrderTimeStatus(subItem.id,subItem.frequency, function(e, r){
                                console.log("create");
                                createSubscriptionOrderService();
                            });
                        })
                    });
                })
            })
        }else{
            console.log("Finish");
        }
    })
}

var cronJob = require('cron').CronJob;
//00 00 3 * * *
var myJob = new cronJob('*0 * * * * *', function(){
    createSubscriptionOrderService();
});

myJob.start();





