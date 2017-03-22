(function(){
	var app = angular.module('surpriseCheckout', [ ]);	
    var orderInfo = {
        address:null,
        card:null,
        cartItems:[],

    }
    customerId = (customerId&&customerId!="guest")?customerId:"guest";
    if(customerId=="guest"&& sku==""){
        window.location = "/";
    }

    app.controller('mainController',['$scope',function($scope){
        $scope.updateSummary = function(){
            $scope.orderInfo = orderInfo;
            $scope.taxRate = 0.08;
            $scope.totalBeforeTax = 0;
            for(var i=0;i<orderInfo.cartItems.length;i++){
                $scope.totalBeforeTax+=orderInfo.cartItems[i].price * orderInfo.cartItems[i].quantity;
            }
            $scope.estimatedTax = $scope.totalBeforeTax*$scope.taxRate;
            
            if($scope.total>50){
                $scope.shippingCost = 0;
            }else{
                    $scope.shippingCost = 1.0;
            }
            $scope.total = $scope.totalBeforeTax+$scope.estimatedTax + $scope.shippingCost;

        }
        $scope.$on('updateSummary', function(event, sku) {
            $scope.updateSummary();
        });
        $scope.updateSummary();
	}]);

    app.directive('modAddressSelector',function() {
		return {
			restrict: 'E',
            scope:{},
			controller: function($scope,$http) {
                $scope.displayAddress = null;
                $scope.listAddress = function(callback){
                    var url= "/api/listAddress?customerId="+customerId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.addressList=result.data;
                        if($scope.addressList.length>0){
                            //$scope.mode = "display";
                            $scope.displayAddress = null;
                            for(var i=0;i<$scope.addressList.length;i++){
                                if($scope.addressList[i].isDefault){
                                    $scope.displayAddress = $scope.addressList[i];
                                }
                            }
                            if($scope.displayAddress==null){
                                $scope.displayAddress = $scope.addressList[0];
                            }
                        }else{
                            $scope.addressList=[];
                            $scope.displayAddress=null;
                            //$scope.mode = "editor";
                        }
                        callback && callback($scope.addressList,$scope.displayAddress);
                    }); 
                }
                $scope.enableViewer=function(){
                    if($scope.isGuest){
                        if($scope.displayAddress==null){
                            $scope.enableEditor();
                        }
                    }
                    $scope.mode = "display";
                    orderInfo.address = $scope.displayAddress;

                    $scope.$emit('updateSummary');
                }
                $scope.enableSelector=function(){
                    if($scope.isGuest){
                        $scope.enableEditor();
                    }else{
                        $scope.mode = "selector";
                    } 
                }
            
                $scope.selectAddress=function(item){
                    console.log(item);
                    $scope.displayAddress = item;
                }
                $scope.chooseAddress=function(){
                    $scope.enableViewer();
                }
                $scope.enableEditor=function(){
                    if($scope.isGuest){
                        if($scope.displayAddress==null){
                            $scope.newAddress = {id:"add",country:"United States"};
                        }else{
                            $scope.newAddress = angular.extend({}, $scope.displayAddress);
                        }
                    }else{
                        $scope.newAddress = {id:"add",country:"United States"};
                        
                    }
                    $scope.mode = "editor";
                }
                $scope.cancelEditer = function(){
                    if($scope.isGuest){
                        $scope.enableViewer();
                    }else{
                        $scope.enableSelector()
                    }
                }
                $scope.saveNewAddress =function(){
                    console.log($scope.newAddress);
                    if($scope.isGuest){
                        $scope.displayAddress = $scope.newAddress;
                        $scope.enableViewer();
                        return;
                    }
                    var url='/api/addAddress';
                    $http({
                        method:"POST",
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: $scope.newAddress
                    }).then(function(result) {
                        console.log(result);
                        $scope.enableSelector();
                        $scope.listAddress(function(addressList, displayAddress){
                             $scope.enableSelector();
                        });
                    },function(result) {
                        alert("Save Product Info failed.\nPlease check the console log for more details.");
                        console.error(result);
                    });
                }


                $scope.isGuest = customerId=="guest"?true:false;
                console.log("$scope.isGuest",$scope.isGuest);
                if($scope.isGuest){
                    $scope.enableEditor();
                }else{
                    $scope.listAddress(function(addressList, displayAddress){
                        if(addressList.length>0){
                            $scope.enableViewer();
                        }else{
                            $scope.enableEditor();
                        }
                    });
                }
			},
			templateUrl:'/public/modules/addressSelector.html'
		};
	});


    app.directive('modCardSelector',function() {
		return {
			restrict: 'E',
            scope:{},
			controller: function($scope,$http) {
                $scope.displayCard = null;
                $scope.listCard = function(callback){
                    var url= "/api/listCard?customerId="+customerId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.cardList=result.data;
                        if($scope.cardList.length>0){
                            $scope.displayCard = null;
                            for(var i=0;i<$scope.cardList.length;i++){
                                if($scope.cardList[i].isDefault){
                                    $scope.displayCard = $scope.cardList[i];
                                }
                            }
                            if($scope.displayCard==null){
                                $scope.displayCard = $scope.cardList[0];
                            }
                        }else{
                            $scope.cardList=[];
                            $scope.displayCard=null;
                        }
                        callback && callback($scope.cardList,$scope.displayCard);
                    }); 
                }
                $scope.enableViewer=function(){
                    if($scope.isGuest){
                        if($scope.displayCard==null){
                            $scope.enableEditor();
                        }
                    }
                    $scope.mode = "display";
                    orderInfo.card = $scope.displayCard;
                }
                $scope.enableSelector=function(){
                    if($scope.isGuest){
                        $scope.enableEditor();
                    }else{
                        $scope.mode = "selector";
                    } 
                }
            
                $scope.selectCard=function(item){
                    console.log(item);
                    $scope.displayCard = item;
                }
                $scope.chooseCard=function(){
                    $scope.enableViewer();
                }
                $scope.enableEditor=function(){
                    if($scope.isGuest){
                        if($scope.displayCard==null){
                            $scope.newCard = {id:"add"};
                        }else{
                            $scope.newCard = angular.extend({}, $scope.displayCard);
                        }
                    }else{
                        $scope.newCard = {id:"add"};
                        
                    }
                    $scope.mode = "editor";
                }
                $scope.cancelEditer = function(){
                    if($scope.isGuest){
                        $scope.enableViewer();
                    }else{
                        $scope.enableSelector()
                    }
                }
                $scope.saveNewCard =function(){
                    console.log($scope.newCard);
                    if($scope.isGuest){
                        $scope.displayCard = $scope.newCard;
                        $scope.enableViewer();
                        return;
                    }
                    var url='/api/addCard';
                    $http({
                        method:"POST",
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: $scope.newCard
                    }).then(function(result) {
                        console.log(result);
                        $scope.enableSelector();
                        $scope.listCard(function(cardList, displayCard){
                             $scope.enableSelector();
                        });
                    },function(result) {
                        alert("Save Product Info failed.\nPlease check the console log for more details.");
                        console.error(result);
                    });
                }


                $scope.isGuest = customerId=="guest"?true:false;
                console.log("$scope.isGuest",$scope.isGuest);
                if($scope.isGuest){
                    $scope.enableEditor();
                }else{
                    $scope.listCard(function(cardList, displayCard){
                        if(cardList.length>0){
                            $scope.enableViewer();
                        }else{
                            $scope.enableEditor();
                        }
                    });
                }
			},
			templateUrl:'/public/modules/cardSelector.html'
		};
	});

    app.directive('modProductReview',function() {
		return {
			restrict: 'E',
            scope:{},
			controller: function($scope,$http) {
                var createCartItemFromProductDetails = function (product){
                    var cart = angular.extend({id:"temp"},product);
                    cart.productQuantity = cart.quantity;
                    cart.quantity = 1;
                    return cart;
                }
                $scope.listCart=function(){
                    $scope.cartList = [];
                    if(sku){
                        var url= "/api/getProductDetail?sku="+sku+"&timestamp="+ new Date();
                        $http.get(url)
                        .then(function(result) {
                            if(result){
                                $scope.cartList.push(createCartItemFromProductDetails(result.data));
                                orderInfo.cartItems = $scope.cartList;
                                $scope.$emit('updateSummary');
                            }else{
                                alert("Product not found");  
                            }
                        }); 
                    }else{
                        if(customerId=="guest"){
                            window.location = "/";
                        }
                        var url= "/api/listCart?customerId="+customerId+"&timestamp="+ new Date();
                        $http.get(url)
                        .then(function(result) {
                            if(result){
                                $scope.cartList = result.data;
                                orderInfo.cartItems = $scope.cartList;
                                $scope.$emit('updateSummary');
                            }else{
                                alert("Product not found");  
                            }
                        }); 
                    }
                }
                $scope.listCart();

                $scope.updateSummary=function(){
                    $scope.$emit('updateSummary');
                }
			},
			templateUrl:'/public/modules/checkoutProductReview.html'
		};
	});

    app.directive('modOrderSummary',function() {
		return {
			restrict: 'E',
			controller: function($scope,$http) {
                
                $scope.placeOrder=function(){
                   var url='/api/placeOrder';
                    $http({
                        method:"POST",
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            address:JSON.stringify($scope.orderInfo.address),
                            card:JSON.stringify($scope.orderInfo.card),
                            cartItems:JSON.stringify($scope.orderInfo.cartItems)
                        }
                    }).then(function(result) {
                        if(result.data=="OK"){
                            if(customerId=="guest"){
                                alert("Thank you!\n We will send you a email with the order information.");
                                window.location = "/";
                            }else{
                                alert("Thank you!\n You order has been submitted successfully.")
                                window.location = "/listOrder";
                            }
                        }
                        console.log(result);
                        
                    },function(result) {
                        alert("Place order failed.\nPlease check the console log for more details.");
                        console.error(result);
                    });
                }
			},
			templateUrl:'/public/modules/orderSummary.html'
		};
	});

    app.directive('convertToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return val;//parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
            }
        };
    });
})();