(function(){
	var app = angular.module('surpriseAdmin', [ ]);	

    app.factory('MenuService',function(){
		var modules=[
				{
					id:"dashboard",
					name:"Dashboard",
					url:"/admin",
				},
				{
					id:"catalog",
					name:"Catalog",
					url:"/admin/catalog",
				},
                {
					id:"order",
					name:"Order",
					url:"/admin/shipment",
				},
                {
					id:"shipment",
					name:"Shipment",
					url:"/admin/shipment",
				}
			];
		var curModuleIndex = 1;
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
			templateUrl:'/public/modules/order.html'//,
			//controllerAs: 'dashboardController'
		};
	});
    app.directive('moduleShipment',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
			},
			templateUrl:'/public/modules/shipment.html'//,
			//controllerAs: 'dashboardController'
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