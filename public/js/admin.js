(function(){
	var app = angular.module('surpriseAdmin', [ ]);	

    app.filter('shipmentStatus', function() {
        return function(input) {
            var out;
            switch(input){
                case 0 :out="Pendding";break;
                case 1 :out="Packed";break;
                case 2 :out="Shipped";break;
                case 3 :out="Delivered";break;
            }
            return out;
        };
    })

     app.filter('returnStatus', function() {
        return function(input) {
            var out;
            switch(input){
                case 0 :out="Pendding";break;
                case 1 :out="Received";break;
                case 2 :out="Refunded";break;
                case 3 :out="Cancel";break;
            }
            return out;
        };
    })
    app.filter('subscriptionStatus', function() {
        return function(input) {
            var out;
            switch(input){
                case 0 :out="Stopped";break;
                case 1 :out="Actived";break;
            }
            return out;
        };
    })

    app.factory('MenuService',function(){
		var modules=[
				{
					id:"catalog",
					name:"Catalog",
					url:"/admin/catalog",
				},
                {
					id:"shipment",
					name:"Shipment",
					url:"/admin/shipment",
				},
                {
					id:"return",
					name:"Return",
					url:"/admin/return",
				},
                {
					id:"subscription",
					name:"Subscription",
					url:"/admin/subscription",
				}
			];
		var curModuleIndex = 0;
		var MenuService = {
			initMenuService:function(){
				console.log("initMenuService");
			},
			getModuleIndex:function(){
				return curModuleIndex;
			},
			getModules:function(){
				return modules;
			},
			changeModules:function(index){
				curModuleIndex = index;
			},
            getActiveModule:function(){
				return modules[curModuleIndex];
			},
		}
		return MenuService;
	});

    app.controller('TopMenuController',['$scope','MenuService',function($scope,MenuService){
		this.modules = MenuService.getModules();
		$scope.changeModules = MenuService.changeModules;
		$scope.getModuleIndex = MenuService.getModuleIndex;
	}]);

    app.directive('moduleContainer',function($compile) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {},
            controller:function($scope,$element,MenuService) {
                $scope.getActiveModule = MenuService.getActiveModule;
                $scope.$watch(
                    function( $scope ) {
                        return $scope.getActiveModule().id;
                    },
                    function( newValue ) {
                        var el = $compile( "<module-"+newValue+"></module-"+newValue+">" )( $scope );
                        $element.html( el );
                    }
                );				
            }
        };
    });
    app.directive('moduleDashboard',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
			},
			templateUrl:'/public/modules/dashboard.html'//,
			//controllerAs: 'dashboardController'
		};
	});
    app.directive('moduleCatalog',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
                $scope.moduleInfo={
					curSubmodule:"product-list",
					productSKU:null
				};
                $scope.filter = {
                    occasion:"-1",
                    department:"-1",
                    gender:"-1",
                    age:"-1",
                    keyword:""
                }
                $scope.submitFilter=function(){
                    $scope.$broadcast('renderList');
                }
                $scope.$on('selectProduct', function(event, sku) {
                    console.log(sku);
                    $scope.moduleInfo.productSKU = sku;
                    $scope.moduleInfo.curSubmodule = "product-info";     
                });

                $scope.createProduct = function(){
                    $scope.moduleInfo.productSKU = null;
                    $scope.moduleInfo.curSubmodule = "product-info"; 
                }
                $scope.BackToList = function(){
                    $scope.moduleInfo.productSKU = null;
                    $scope.moduleInfo.curSubmodule = "product-list"; 
                }
			},
			templateUrl:'/public/modules/catalog.html'
		};
	});
    app.directive('catalogProductListTmpl',function(){
		return {
			restrict: 'E',
			controller: function($scope,$http) {
                $scope.pageInfo = {
                   index:1,
                   count:5,
                   totalPage:100
                }
				$scope.$on('renderList', function(event, args) {
                    console.log($scope.filter);
                    $scope.render();
                });
                $scope.render = function(){
                    var url = '/admin/api/listProduct?';
                    if($scope.filter.occasion!="-1"){
                        url+="occasion="+$scope.filter.occasion+"&";
                    }
                    if($scope.filter.department!="-1"){
                        url+="department="+$scope.filter.department+"&";
                    }
                    if($scope.filter.gender!="-1"){
                        url+="gender="+$scope.filter.gender+"&";
                    }
                    if($scope.filter.age!="-1"){
                        url+="age="+$scope.filter.age+"&";
                    }
                    if($scope.filter.keyword!="-1"){
                        url+="keyword="+$scope.filter.keyword+"&";
                    }
                    url+="page="+$scope.pageInfo.index+"&count="+$scope.pageInfo.count+"&timestamp="+ new Date();
                    $http.get(url)
					.then(function(result) {
                        $scope.list=result.data;
                        $scope.pageInfo.index=result.data.page;
                        $scope.pageInfo.totalPage=result.data.totalPage;
				    }); 
                }
                $scope.render();

                $scope.showProductInfo = function(index){
                    $scope.$emit('selectProduct',$scope.list.items[index].sku);
                }

                $scope.pre = function(){
                    $scope.pageInfo.index-=1;
                    $scope.pageInfo.index = $scope.pageInfo.index<0?0:$scope.pageInfo.index;
                    $scope.render();
                }
                $scope.next = function(){
                    $scope.pageInfo.index+=1;
                    if($scope.pageInfo.index>$scope.pageInfo.totalPage){
                        $scope.pageInfo.index = $scope.pageInfo.totalPage;
                        return;
                    }
                    $scope.render();
                }

			},
			templateUrl:'/public/templates/catalogProductListTmpl.html'
		};
	});

    app.directive('catalogProductInfoTmpl',function(){
		return{
			restrict: 'E',
			controller: function($scope,$http){	
                $scope.sku = $scope.moduleInfo.productSKU;
                $scope.isNewProduct = $scope.sku?false:true;
				if($scope.isNewProduct){
                    $scope.product={
                        sku:"Auto generate"
                    };
                }else{
                    var url= "/admin/api/getProduct?sku="+$scope.sku+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.product=result.data;
                    }); 
                }
                $scope.save = function(){
                    console.log($scope.product);
                    var url=$scope.isNewProduct?'/admin/api/createProduct':'/admin/api/updateProduct';
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
                        data: $scope.product
                    }).then(function(result) {
                        alert("Product Info Saved.");
                        if($scope.isNewProduct){
                            $scope.product.sku = result.data.insertId;
                            $scope.sku = result.data.insertId;
                            $scope.moduleInfo.productSKU=result.data.insertId;
                            $scope.isNewProduct = false;
                        }
                    },function(result) {
                        alert("Save Product Info failed.\nPlease check the console log for more details.");
                        console.error(result);
                    });
                }

                $scope.delete = function(){
                    var result = confirm("Are you sure ant to delete this product?");
                    if(!$scope.sku)return;

                    if (result) {
                        var url= "/admin/api/deleteProduct?sku="+$scope.sku+"&timestamp="+ new Date();
                        $http.get(url)
                        .then(function(result) {
                            alert("Product deleted.");
                            $scope.moduleInfo.productSKU = null;
                            $scope.moduleInfo.curSubmodule = "product-list";  
                        },function(result){
                            alert("Product delete failed.\nPlease check the console log for more details.");
                            console.error(result);
                        }); 
                    }
                    
                }
			},
			templateUrl:'/public/templates/catalogProductInfoTmpl.html'
		};
	});

    app.directive('moduleOrder',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
			},
			templateUrl:'/public/modules/order.html'
		};
	});
    app.directive('moduleShipment',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
                $scope.moduleInfo={
					curSubmodule:"shipment-list",
					shipmentId:null
				};
                $scope.filter = {
                    status:-1
                }
                $scope.submitFilter=function(){
                    $scope.$broadcast('renderList');
                }
                $scope.$on('selectshipment', function(event, id) {
                    console.log(id);
                    $scope.moduleInfo.shipmentId = id;
                    $scope.moduleInfo.curSubmodule = "shipment-info";     
                });
                $scope.BackToList = function(){
                    $scope.moduleInfo.shipmentId = null;
                    $scope.moduleInfo.curSubmodule = "shipment-list"; 
                }
			},
			templateUrl:'/public/modules/shipment.html'
		};
	});


     app.directive('shipmentListTmpl',function(){
		return {
			restrict: 'E',
			controller: function($scope,$http) {
                $scope.pageInfo = {
                   index:1,
                   count:5,
                   totalPage:100
                }
				$scope.$on('renderList', function(event, args) {
                    console.log($scope.filter);
                    $scope.render();
                });
                $scope.render = function(){
                    var url = '/admin/api/listshipment?';
                    if($scope.filter.status!="-1"){
                        url+="status="+$scope.filter.status+"&";
                    }
                    
                    url+="page="+$scope.pageInfo.index+"&count="+$scope.pageInfo.count+"timestamp="+ new Date();
                    $http.get(url)
					.then(function(result) {
                        $scope.list=result.data;
                        $scope.pageInfo.index=result.data.page;
                        $scope.pageInfo.totalPage=result.data.totalPage;
				    }); 
                }
                $scope.render();

                $scope.showshipmentInfo = function(index){
                    $scope.$emit('selectshipment',$scope.list.items[index].id);
                }

                $scope.pre = function(){
                    $scope.pageInfo.index-=1;
                    $scope.pageInfo.index = $scope.pageInfo.index<0?0:$scope.pageInfo.index;
                    $scope.render();
                }
                $scope.next = function(){
                    $scope.pageInfo.index+=1;
                    if($scope.pageInfo.index>$scope.pageInfo.totalPage){
                        $scope.pageInfo.index = $scope.pageInfo.totalPage;
                        return;
                    }
                    $scope.render();
                }

			},
			templateUrl:'/public/templates/shipmentListTmpl.html'
		};
	});

    app.directive('shipmentInfoTmpl',function(){
		return{
			restrict: 'E',
			controller: function($scope,$http){	
                $scope.shipmentId = $scope.moduleInfo.shipmentId;
                
                var url= "/admin/api/getShipment?id="+$scope.shipmentId+"&timestamp="+ new Date();
                $http.get(url)
                .then(function(result) {
                    $scope.shipment=result.data.shipment;
                    $scope.lineItems=result.data.lineItems;
                }); 

                $scope.confirmPacked=function(){
                    var url= "/admin/api/shippment/packed?id="+$scope.shipmentId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.shipment=result.data.shipment;
                        $scope.lineItems=result.data.lineItems;
                    }); 
                }
                $scope.confirmShipped=function(){
                    var url= "/admin/api/shippment/shipped?id="+$scope.shipmentId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.shipment=result.data.shipment;
                        $scope.lineItems=result.data.lineItems;
                    }); 
                }
                $scope.confirmDelivered=function(){
                    var url= "/admin/api/shippment/delivered?id="+$scope.shipmentId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.shipment=result.data.shipment;
                        $scope.lineItems=result.data.lineItems;
                    }); 
                }
                
			},
			templateUrl:'/public/templates/shipmentInfoTmpl.html'
		};
	});

    app.directive('moduleReturn',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
                $scope.moduleInfo={
					curSubmodule:"return-list",
					returnId:null
				};
                $scope.filter = {
                    status:-1
                }
                $scope.submitFilter=function(){
                    $scope.$broadcast('renderList');
                }
                $scope.$on('selectReturn', function(event, id) {
                    console.log(id);
                    $scope.moduleInfo.returnId = id;
                    $scope.moduleInfo.curSubmodule = "return-info";     
                });
                $scope.BackToList = function(){
                    $scope.moduleInfo.returnId = null;
                    $scope.moduleInfo.curSubmodule = "return-list"; 
                }
			},
			templateUrl:'/public/modules/return.html'
		};
	});

    app.directive('returnListTmpl',function(){
		return {
			restrict: 'E',
			controller: function($scope,$http) {
                $scope.pageInfo = {
                   index:1,
                   count:5,
                   totalPage:100
                }
				$scope.$on('renderList', function(event, args) {
                    console.log($scope.filter);
                    $scope.render();
                });
                $scope.render = function(){
                    var url = '/admin/api/listReturn?';
                    if($scope.filter.status!="-1"){
                        url+="status="+$scope.filter.status+"&";
                    }
                    
                    url+="page="+$scope.pageInfo.index+"&count="+$scope.pageInfo.count+"timestamp="+ new Date();
                    $http.get(url)
					.then(function(result) {
                        $scope.list=result.data;
                        $scope.pageInfo.index=result.data.page;
                        $scope.pageInfo.totalPage=result.data.totalPage;
				    }); 
                }
                $scope.render();

                $scope.showReturnInfo = function(index){
                    $scope.$emit('selectReturn',$scope.list.items[index].id);
                }

                $scope.pre = function(){
                    $scope.pageInfo.index-=1;
                    $scope.pageInfo.index = $scope.pageInfo.index<0?0:$scope.pageInfo.index;
                    $scope.render();
                }
                $scope.next = function(){
                    $scope.pageInfo.index+=1;
                    if($scope.pageInfo.index>$scope.pageInfo.totalPage){
                        $scope.pageInfo.index = $scope.pageInfo.totalPage;
                        return;
                    }
                    $scope.render();
                }

			},
			templateUrl:'/public/templates/returnListTmpl.html'
		};
	});


     app.directive('returnInfoTmpl',function(){
		return{
			restrict: 'E',
			controller: function($scope,$http){	
                $scope.returnId = $scope.moduleInfo.returnId;
                
                var url= "/admin/api/getReturn?id="+$scope.returnId+"&timestamp="+ new Date();
                $http.get(url)
                .then(function(result) {
                    $scope.returnItem=result.data;
                }); 

                $scope.confirmReceived=function(){
                    var url= "/admin/api/return/received?id="+$scope.returnId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                        $scope.returnItem=result.data;
                    }); 
                }
                $scope.confirmRefund=function(){
                    var url= "/admin/api/return/refund?id="+$scope.returnId+"&timestamp="+ new Date();
                    $http.get(url)
                    .then(function(result) {
                       $scope.returnItem=result.data;
                    }); 
                }
                
			},
			templateUrl:'/public/templates/returnInfoTmpl.html'
		};
	});


    app.directive('moduleSubscription',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
                $scope.moduleInfo={
					curSubmodule:"subscription-list",
					returnId:null
				};
                $scope.filter = {
                    status:-1
                }
                $scope.submitFilter=function(){
                    $scope.$broadcast('renderList');
                }
			},
			templateUrl:'/public/modules/subscription.html'
		};
	});

    app.directive('subscriptionListTmpl',function(){
		return {
			restrict: 'E',
			controller: function($scope,$http) {
                $scope.pageInfo = {
                   index:1,
                   count:5,
                   totalPage:100
                }
				$scope.$on('renderList', function(event, args) {
                    console.log($scope.filter);
                    $scope.render();
                });
                $scope.render = function(){
                    var url = '/admin/api/listSubscription?';
                    if($scope.filter.status!="-1"){
                        url+="status="+$scope.filter.status+"&";
                    }
                    
                    url+="page="+$scope.pageInfo.index+"&count="+$scope.pageInfo.count+"timestamp="+ new Date();
                    $http.get(url)
					.then(function(result) {
                        $scope.list=result.data;
                        $scope.pageInfo.index=result.data.page;
                        $scope.pageInfo.totalPage=result.data.totalPage;
				    }); 
                }
                $scope.render();

                $scope.pre = function(){
                    $scope.pageInfo.index-=1;
                    $scope.pageInfo.index = $scope.pageInfo.index<0?0:$scope.pageInfo.index;
                    $scope.render();
                }
                $scope.next = function(){
                    $scope.pageInfo.index+=1;
                    if($scope.pageInfo.index>$scope.pageInfo.totalPage){
                        $scope.pageInfo.index = $scope.pageInfo.totalPage;
                        return;
                    }
                    $scope.render();
                }

			},
			templateUrl:'/public/templates/subscriptionListTmpl.html'
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