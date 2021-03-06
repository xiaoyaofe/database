/**
 * Created by weiqiang.yu on 2016-06-15.
 */
/**
 * Created by xiaoyi on 2015/8/4.
 */
'use strict';
app.controller('userRetainController', ['$rootScope', '$scope', '$http', '$timeout', '$q', 'toaster', '$params', function ($rootScope, $scope, $http, $timeout, $q, toaster, $params) {
    $scope.hideDateType=true;
    $scope.hideCountDate=true;
    $scope.datePickerDayDiff=-1;
    $scope.startDate = moment().add($scope.datePickerDayDiff - 30, 'days').format('YYYY-MM-DD');
    $scope.endDate = moment().add($scope.datePickerDayDiff, 'days').format('YYYY-MM-DD');
    $scope.nowdatetype=0;
    $scope.datetype={selected: {id: 0, name: '默认'}};

    var curParams=null;
    /**
     * 通过接口获取数据
     * @param url
     */
    function getData() {
        $http({
            url: 'api/7roadReport/getPopularize_liucun',
            method: 'GET',
            params: curParams
        }).success(function (data, header, config, status) {
            if (data.code == 0) {
                if (data.result.length < 1) {
                    $scope.noData = true;
                    return;
                } else {
                    $scope.noData = false;
                }
                data.result.shift();//特殊：第一个为无效数据 { "fn_oas_fivepower_day": null},

                for(var i=0;i<data.result.length;i++)
                {
                    var temDate;
                    temDate=new Date(data.result[i]["reg_date"])
                    temDate=temDate.format("yyyy-MM-dd") ;
                    data.result[i]["reg_date"]=temDate;
                }

                $scope.tableData=data.result;

            } else {
                pop('error', 'error', data.msg);
            }
        }).error(function (data, header, config, status) {
            pop('error', '链接异常', data);
        });
    }
    // 初始化提示框
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Body'
    };
    var pop = function (type, title, text) {
        toaster.pop(type, title, text);
    };
    /**
     * 监听查询事件
     */
    $scope.$on("7roadReportQuery",function(event,params)
    {
        curParams=params;
        var newDate=new Date();
        var endDate=new Date(curParams.date2);
        if(endDate>new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate()-2))
        {
            curParams.date2=moment(new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate()-2)).format('YYYY-MM-DD');
        }
        $scope.query();
    });
    function exportData(){
        $http({
            url: 'api/7roadReport/export/getPopularize_liucun',
            method: 'GET',
            params: curParams
        }).success(function (data, header, config, status) {
            if(data.code ==0){
                window.open(data.result);
            }else{
                pop('error','error',data.msg);
            }
        }).error(function (data, header, config, status) {
            pop('error', '链接异常', data);
        });
    }


    $scope.query= function () {
        refreshData();
    };

    $scope.export= function () {
        exportData();
    };

    function refreshData()
    {
        getData();
    }
    /**
     * 日期格式化
     * @param fmt
     * @returns {*}
     */
    Date.prototype.format= function (fmt)
    {
        var o={
            "M+":this.getMonth()+1,
            "d+":this.getDate(),
            "h+":this.getHours(),
            "m+":this.getMinutes(),
            "s+":this.getSeconds(),
            "q+":Math.floor((this.getMonth()+3)/3),
            "S":this.getMilliseconds()
        }
        if(/(y+)/.test((fmt)))
        {
            fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
        }
        for(var k in o)
        {
            if(new RegExp("("+k+")").test(fmt))
            {
                fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]) :(("00"+o[k]).substr((""+o[k]).length)));
            }
        }
        return fmt;

    };
}]);