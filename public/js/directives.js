

//Press enter on input
angmodule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


//http://stackoverflow.com/questions/10418644/creating-an-iframe-with-given-html-dynamically
angmodule.directive('ngIframe', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        ngModel: '='
      },
      link: function(scope, element, attrs, tabsCtrl) {
      	scope.$watch('ngModel', function(newVal, oldVal) {
      		console.log(newVal+' vs '+oldVal);
	        updateIFrame(newVal);
	      });

      	function updateIFrame(html){
	        var iframe = $('<iframe width="100%" height="100%"/>');
			iframe[0].src = 'data:text/html;charset=utf-8,' + encodeURI(html);
			element.html('<div/>');
			element.append(iframe);
		}

      }
    };
  });


angmodule.directive('jsonTree', function($compile) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        ngModel: '='
      },
      link: function(scope, element, attrs, tabsCtrl) {
        var nodeIndex = null;

        scope.$watch('ngModel', function(newVal, oldVal) {
          
          nodeIndex = null;
          element.html('');
          var ul = $('<ul/>').addClass('json-tree-ul');
          var liInnser = $('<li></li>');
          ul.append(liInnser);

          var isArray = (newVal && typeof newVal.length !== 'undefined');

          var fName = $('<span ng-init="show = []; show[0]=true" class="json-tree-toggle" ng-click="show[0]=!show[0]">'
                        +'<span ng-show="show[0]">-</span><span ng-hide="show[0]">+</span></span><span>'+((isArray)?'[':'{')+'</span>');
          var valElement = $('<span ng-show="show[0]"/>');
          liInnser.append(fName).append(valElement);
          traverse(newVal,valElement,isArray);
          liInnser.append('<span>'+((isArray)?']':'}')+'</span>');
          var container = $('<div/>').addClass('json-tree-container');
          container.append(ul);
          element.append(container);
          $compile(element.contents())(scope);
        });

        function traverse(node,element,isArray){
          isArray = isArray || false;
          var ul = $('<ul/>').addClass('json-tree-ul');
          nodeIndex = nodeIndex || 1;
          for(field in node){
            nodeIndex++;
            var value = node[field];
            var liInnser = null;

            var fn = (!isArray)?'<span class="json-tree-field-name">'+field+'</span> : ':'';

            if(typeof value === 'string'){
              //strings
              liInnser = $('<li>'+fn+'"<em>'+htmlEntities(value)+'</em>",</li>');
            }
            else if(value === null || value === undefined || typeof value === 'number' || typeof value === 'boolean'){
              //numbers
             liInnser = $('<li>'+fn+'<em>'+htmlEntities(value)+'</em>,</li>');
            }
            else if(typeof value.length !== 'undefined'){
              liInnser = $('<li></li>');
              fName = $(fn+'<span ng-init="show['+nodeIndex+']=true" class="json-tree-toggle" ng-click="show['+nodeIndex+']=!show['+nodeIndex+']">'
                            +'<span ng-show="show['+nodeIndex+']">-</span><span ng-hide="show['+nodeIndex+']">+</span></span><span>[</span>');
              valElement = $('<span  ng-show="show['+nodeIndex+']"/>');
              liInnser.append(fName).append(valElement);
              traverse(value,valElement,true);
              liInnser.append('<span>],</span>');
            }
            else{
              //array
              liInnser = $('<li></li>');
              fName = $(fn+'<span ng-init="show['+nodeIndex+']=true" class="json-tree-toggle" ng-click="show['+nodeIndex+']=!show['+nodeIndex+']">'
                        +'<span ng-show="show['+nodeIndex+']">-</span><span ng-hide="show['+nodeIndex+']">+</span></span><span>{</span>');
              valElement = $('<span  ng-show="show['+nodeIndex+']"/>');
              liInnser.append(fName).append(valElement);
              traverse(value,valElement,false);
              liInnser.append('<span>},</span>');
            }
            ul.append(liInnser);

          }

          element.append(ul);

        }
      }
    };
  });


/*
  In the ngFile variable scope you will have:
    - body: (content of the file)
    - filename: file name
*/
angmodule.directive("ngFile", [function () {
    return {
        scope: {
            ngFile: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                if(!scope.ngFile) scope.ngFile = {};
                if(!changeEvent || !changeEvent.target || !changeEvent.target.files || !changeEvent.target.files.length) {
                  scope.ngFile = {};
                  return;
                }
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.ngFile.body = loadEvent.target.result;
                    });
                }
                reader.readAsText(changeEvent.target.files[0]);
                scope.ngFile.filename = changeEvent.target.files[0].name;

            });
        }
    }
}]);

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}