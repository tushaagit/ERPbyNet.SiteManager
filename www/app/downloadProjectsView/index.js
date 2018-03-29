'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler','DALAuthTokens','DALProjects', 'projectManager', 'cookieManager', 'DALErrorLog'],
       function ($, cordova, kendo, app, localizer, WSHandler, DALAuthTokens, DALProjects, projectManager, cookieManager, DALErrorLog) {

    var downloadProjectsView =  kendo.observable({
        beforeShow: function (e) {
            var $view = $('#' + e.view.content.context.id);
            if ($view.length > 0) {
                app.removeCachedViews($view);
            }
        },
        onShow: function() {
            var chkLogin = app.isUserAuthenticated();

                if(chkLogin == false){
                    app.mobileApp.navigate('app/loginView/view.html');
                }
        },
        afterShow: function() { downloadProjectsView.init(); }
    });
    app.downloadProjectsView = downloadProjectsView;
    var surveyProjectArray = {};
    downloadProjectsView.set('title', localizer.translateText("downloadProjectsView.dwnldProjects"));
   	downloadProjectsView.set('searchText', '');

   /*var   opportunityListData =  [{"ProjectID":"0001","ContractNo":"IN000189","ProjectName":"Dwarka Residancy","AddressLine1":"Deccan, Pune", "NoOfUnits": 4, "PercentComplete":null,"Notes":null,"AddedOn":null,"RowGuid":null},
                                  {"ProjectID":"0002","ContractNo":"IN000185","ProjectName":"Dwarka","AddressLine1":"Aundh, Pune", "NoOfUnits": 10, "PercentComplete":null,"Notes":null,"AddedOn":null,"RowGuid":null},
                                  {"ProjectID":"0003","ContractNo":"IN000155","ProjectName":"Dwarka Sankul","AddressLine1":"Pimpri, Pune", "NoOfUnits": 5, "PercentComplete":null,"Notes":null,"AddedOn":null,"RowGuid":null},
                                  {"ProjectID":"0004","ContractNo":"IN000195","ProjectName":"Sai - Dwarka","AddressLine1":"Kothrud, Pune", "NoOfUnits": 18, "PercentComplete":null,"Notes":null,"AddedOn":null,"RowGuid":null}];*/

    downloadProjectsView.init = function()
    {
        downloadProjectsView.projectCount = 0;
        downloadProjectsView.finalArrayCount = 0;
    	localizer.translate();
        var navbar =  app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
        navbar.title(localizer.translateText("downloadProjectsView.dwnldProjects"));
    };

         downloadProjectsView.changeSurveyType = function(e){
	        surveyProjectArray[$(e).attr("projID")] = $(e).val();
	    };

    downloadProjectsView.getOpportunities = function(searchText){
        var userName = app.getLoggedInUserName();
        var dataToPost = { "SearchText": searchText, "UserName" : userName };
        //alert(dataToPost +"//"+ downloadProjectsView.serviceSucceeded +"//"+ downloadProjectsView.serviceFailed);
        WSHandler.sendRequest('SearchInstallationOpportunities', dataToPost, downloadProjectsView.serviceSucceeded, downloadProjectsView.serviceFailed);
        // downloadProjectsView.bindData();
    };

    downloadProjectsView.serviceFailed = function (result, ex) {
        alert('Service call failed: ' + result.status + '  ' + result.statusText);
        alert(localizer.translateDynamicText("downloadProjectsView.servCallFailMsg", result.status + '  ' + result.statusText));
        DALErrorLog.addErrorLog(ex.message, app.errorLogSucceeded, app.erroLogFailed);
    };

    downloadProjectsView.downloadFailed = function (result, ex) {
        //alert('Download call failed: ' + result.status + '  ' + result.statusText);
        alert(localizer.translateDynamicText("downloadProjectsView.dwnldCallFailMsg", result.status + '  ' + result.statusText));
        DALErrorLog.addErrorLog(ex.message, app.errorLogSucceeded, app.erroLogFailed);
    };

    downloadProjectsView.serviceSucceeded = function (projectsList){
        downloadProjectsView.bindData(projectsList);
    };

    downloadProjectsView.downloadSucceeded = function (projectsData){
        try{
              downloadProjectsView.insertData(JSON.parse(projectsData), surveyProjectArray);
            }
         catch(ex) {
             //alert('download succeeded err: '+ ex.message);
             alert(localizer.translateDynamicText("downloadProjectsView.dwnldSeccMsg", ex.message));
             DALErrorLog.addErrorLog(ex.message, app.errorLogSucceeded, app.erroLogFailed);
        }
    };

    downloadProjectsView.search = function(){
       	  downloadProjectsView.validatable = $("#downloadProjectsForm").kendoValidator().data("kendoValidator");
    	   if(downloadProjectsView.validatable.validate())
            {
	   			downloadProjectsView.getOpportunities(downloadProjectsView.searchText);
            }
        else
            {
                var errorText = localizer.translateText("downloadProjectsView.emptySearchTextMsg");
                alert(errorText);
            }
    };

  downloadProjectsView.bindData = function (opportunityList) {
  //   downloadProjectsView.bindData = function () {
        try {
            var dataSource = new kendo.data.DataSource({
                   data: opportunityList,
                    dataType: "json",

             schema: {
                model: {
                    id: "ProjectID",
                    fields: {
                        ProjectID: { type: "int" },
                        ContractNo: { type: "string" },
                        ProjectName: { type: "string" }
                    }
                }
             }
            });
            $("#downlodProjectlist").kendoMobileListView({
                dataSource: dataSource,
                template: $("#downlodProjectTemplate").text()
            });

            /*DALSurveyTypes.getAllSurveyTypes(function (tx, records) {
                if (records.rows.length > 0) {
                    var surveyTypeOtions;
                    var surveyTypeRecords = records.rows;
                    var optionSelected = "";
                    for (var i = 0; i < surveyTypeRecords.length; i++) {
                        if (app.config.defaultSurveyTypeID === surveyTypeRecords.item(i).SurveyTypeID) {
                            optionSelected = "selected";
                        } else {
                            optionSelected = "";
                        }
                        surveyTypeOtions += "<option value=" + surveyTypeRecords.item(i).SurveyTypeID + " " + optionSelected + ">" + surveyTypeRecords.item(i).SurveyTypeName + "</option>";

                    }
                    $(".selectDropDown").html(surveyTypeOtions);
                }
            });*/

            downloadProjectsView.attachCircleClickHandler();
        }
        catch(ex) {
            //alert('bind data '+ex.message);
            alert(localizer.translateDynamicText("downloadProjectsView.bindDataMsg", ex.message));
            DALErrorLog.addErrorLog(ex.message, app.errorLogSucceeded, app.erroLogFailed);
        }
    }
    downloadProjectsView.insertData = function(projectsInfo, surveyTypeIds){
        try{
        	projectManager.insertAllProjectData(projectsInfo,  surveyTypeIds, downloadProjectsView.successAddProjectCallBack);


        }
        catch(ex) {
            //alert('insert Data '+ex.message);
            alert(localizer.translateDynamicText("downloadProjectsView.insertDataMsg", ex.message));
            DALErrorLog.addErrorLog(ex.message, app.errorLogSucceeded, app.erroLogFailed);
        }

    }

    downloadProjectsView.successAddProjectCallBack = function(e){

        downloadProjectsView.projectCount = parseInt(downloadProjectsView.projectCount) + 1;
        if(downloadProjectsView.finalArrayCount == downloadProjectsView.projectCount){
            app.mobileApp.hideLoading();
        	alert(localizer.translateText("downloadProjectsView.dwnldCompleteMsg"));
            downloadProjectsView.projectCount = 0;
            downloadProjectsView.finalArrayCount = 0;
            app.mobileApp.navigate("app/homeView/view.html");
        }

    }

    downloadProjectsView.downloadSelected = function(){
        try{
            var final_array = [];
            var selected = $("#downlodProjectlist .circleGreen");	// get all checkboxes which are selected
            $("#downlodProjectlist .circleGreen").each(function(){	// Iterate through array of selected opportunities
                var ProjectID = $(this).attr("projectID");
                final_array.push(ProjectID);
                 if(surveyProjectArray[ProjectID]==undefined)
	                surveyProjectArray[ProjectID] = app.config.defaultSurveyTypeID;  					// push selected opporutunity in an array
            });
            downloadProjectsView.finalArrayCount = final_array.length;
            if(downloadProjectsView.finalArrayCount !== 0){
            DALProjects.projectExists(final_array, function(tx, records){
                if(records.rows.length > 0){
                    navigator.notification.confirm(
                        localizer.translateText("downloadProjectsView.downloadConfirmationMsg"), // message
                        function (buttonIndex) {
                            if (buttonIndex == 1) {

                                DALProjects.deleteProjectData(final_array, function(tx, records){
                                    downloadProjectsView.downloadProjects(final_array);
                                });
                            }else {

                            }
                        },            // callback to invoke with index of button pressed
                        'Upload data',  // title
                        ['OK', 'Cancel']  // buttonLabels
                    );
                }else{
                    downloadProjectsView.downloadProjects(final_array);
                }
            });
            } else {
                alert("Please select a project to download!");
            }
        } catch(ex) {
	        alert(localizer.translateDynamicText("downloadProjectsView.dwnldErrMsg", ex.message));
            DALErrorLog.addErrorLog(ex.message, app.errorLogSucceeded, app.erroLogFailed);
        }
    };

    downloadProjectsView.downloadProjects = function(ProjectIds){
        app.mobileApp.showLoading();
         var dataToPost = {
                         "ProjectIDs": ProjectIds
                     };

                WSHandler.sendRequest('GetInstallationOpportunitiesToDownload', dataToPost, downloadProjectsView.downloadSucceeded, downloadProjectsView.downloadFailed);
            //app.mobileApp.hideLoading();
        	//alert(localizer.translateText("downloadProjectsView.dwnldCompleteMsg"));
            //app.mobileApp.navigate("app/homeView/view.html");
    }
    downloadProjectsView.attachCircleClickHandler = function(){
       $("[circle]").click(function(){
            if($(this).hasClass("circleGrey"))
                $(this).removeClass().addClass("circleGreen");
            else
                $(this).removeClass().addClass("circleGrey");
        });
        //The Entire row is clickable not for circle.
         /*$("#downlodProjectlist li").click(function(){ console.log($(this).children("[circle]"));
              if($(this).children("[circle]").hasClass("circleGrey"))
                $(this).children("[circle]").removeClass().addClass("circleGreen");
            else
                $(this).children("[circle]").removeClass().addClass("circleGrey");
        });*/
    };
    return downloadProjectsView;
});
// START_CUSTOM_CODE_settingsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_settingsView
