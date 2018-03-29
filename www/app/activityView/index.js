'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALAuthTokens', 'networkInfo', 'cookieManager', 'DALHelper', 'DALProjects', 'mediaHandler'],
function ($, cordova, kendo, app, localizer, WSHandler, DALAuthTokens, networkInfo, cookieManager, DALHelper, DALProjects, mediaHandler) {
    var activityView = kendo.observable({
        beforeShow: function (e) {
            var $view = $('#' + e.view.content.context.id);
            if ($view.length > 0) {
                app.removeCachedViews($view);
            }
        },
        onShow: function () {
            var chkLogin = app.isUserAuthenticated();
            if (chkLogin == false) {
                app.mobileApp.navigate('app/loginView/view.html');
            }
        },
        afterShow: function (e) {
            console.log(e.view.params);
            activityView.projectID = e.view.params.projectID;
            activityView.groupID = e.view.params.groupID;
            activityView.showProjectData(activityView.projectID);
            activityView.init();
        }
    });
    var subPanelCount = 0;
    app.activityView = activityView;

    activityView.showProjectData = function (projectID) {
            DALProjects.getProject(projectID, activityView.bindProjectData)
        }

    activityView.init = function () {
        localizer.translate();
        var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
        navbar.title(localizer.translateText("activityView.title"));
        app.mobileApp.view().header.find("#lblUserName").html(app.getLoggedInUserName());
        activityView.authTokenID = app.authToken;

         //Activity Site Details data first table
       /* var activitySiteData = new kendo.data.DataSource({
            transport: {
                read: {
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    data: "{}",
                    dataType: "json",
                    url: "data/siteDetails.json"
                }
            }
        });
        activitySiteData.filter([
            { field: "id", operator: "eq", value: parseInt(activityView.projectID) }
        ]);

        $("#activitySiteDiv").kendoMobileListView({
            template :  $("#activitySiteTemplate").text(),
            dataSource: activitySiteData
        }); */

   //Activity Installation Data second table
   var activityInstallData = new kendo.data.DataSource({
            transport: {
                read: {
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    data: "{}",
                    dataType: "json",
                    url: "json/installationGroupsViewDetails.json"
                }
             }
        });
        activityInstallData.filter([
            { field: "groupId", operator: "eq", value: parseInt(activityView.groupID) }
        ]);
        $("#activityInstallDiv").kendoMobileListView({
            template : $("#activityInstallTemplate").text(),
            dataSource: activityInstallData
        });
        //Activity Data
        var ActivityData = new kendo.data.DataSource({
            transport: {
                read: {
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    data: "{}",
                    dataType: "json",
                    url: "json/activitydetailsone.json"
                }
            }
        });
        $("#activityDiv").kendoMobileListView({
            template :  $("#activityTemplate").text(),
            dataSource: ActivityData,
            dataBound: activityView.dataBoundHandler,
            click:function(e){
                        /*if(e.button.options.icon == "camera" || e.button.options.icon == "video"){
                            activityView.naivgateToImageGallery(e);
                        }*/
                        if(e.button.options.icon == "camera"){
                            mediaHandler.takeDirectPicture(e, 'i', function () {
                                app.tempAlert(null, localizer.translateText("mediaGalleryView.fileSavedMsg"), 3000);
                                groupView.dataBoundHandler();
                            });
                        } else if(e.button.options.icon == "video"){
                            mediaHandler.takeDirectPicture(e, 'v', function () {
                                app.tempAlert(null, localizer.translateText("mediaGalleryView.fileSavedMsg"), 3000);
                                groupView.dataBoundHandler();
                            });
                        } else if(e.button.options.icon == "film"){
                            activityView.naivgateToImageGallery(e);

                        }
                    }
        });




    };


            activityView.bindProjectData = function (tx, project) {
            var projectData = [];
            for (var i = 0; i < project.rows.length; i++) {
                projectData.push(project.rows.item(i));
            }

            var projectDataDS = new kendo.data.DataSource({
                data: projectData,
                type: "json"
            });

            if (projectData.length > 0) {

                $("#activitySiteDiv").kendoMobileListView({
                    template: $("#activitySiteTemplate").text(),
                    dataSource: projectDataDS,
                    selectable: "single",
                });

            }
        };

    activityView.dataBoundHandler = function () {


        $.ajax({
            type: 'GET',
            url: 'json/stagesData.json',
            data: {},
            dataType: 'json',
            async: 'false',
            success: function (data) {
                // Add the empty option with the empty message
                $(".stages").append('<option value="">Select Stage</option>');
                // Check result isnt empty
                if (data != '') {
                    // Loop through each of the results and append the option to the dropdown
                    $.each(data, function (k, v) {
                        $(".stages").append('<option value="' + v.sid + '">' + v.stage + '</option>');
                    });
                }
            }
        });


        $.ajax({
            type: 'GET',
            url: 'json/statusDropDownData.json',
            data: {},
            dataType: 'json',
            async: 'false',
            success: function (data) {
                // Add the empty option with the empty message
                $(".statusSelect").append('<option value="">Status</option>');
                // Check result isnt empty
                if (data != '') {
                    // Loop through each of the results and append the option to the dropdown
                    $.each(data, function (k, v) {
                        $(".statusSelect").append('<option value="' + v.sid + '">' + v.status + '</option>');
                    });

                    $(".statusSelect").each(function () {
                        var element = $(this);
                        element.val(element[0].dataset.statusval);

                    });

                }
            }
        });

        $( ".actualCalendar" ).datepicker({ dateFormat: 'dd-mm-yy' });
    };

    activityView.saveNotes = function(e)
    {
        var rowGUID = $('#rowGUIDForNotes').val();
        var notes  = $('#txtActivityNotes').val();
        var index = $("#indexForNotes").val();

        /*DALSpecs.updateAttributeNotes(rowGUID, index, notes, function(tx, results){
            if($('#txtActivityNotes').val().length > 0)
                $("#specsContainer").find("a[notesbutton][data-attribname='"+ $("#hidAtrriName").val()  +"']").find(".km-badge").show();
            else
                $("#specsContainer").find("a[notesbutton][data-attribname='"+ $("#hidAtrriName").val()  +"']").find(".km-badge").hide();

            var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');
        	popover.close();
        });*/
    };

    activityView.naivgateToImageGallery = function (e) {
        var data = e.dataItem;
        var mediaType = 'i';
        if (e.button.options.icon == 'film')
            mediaType = 'i';
        app.mobileApp.navigate("app/mediaGalleryView/view.html?RowGUID=" + data.RowGUID + "&mediaType=" + mediaType + "&activity=" + data.activity);
    };

    activityView.onNotesClose = function(e)
    {
        var rowGUID = $('#rowGUIDForNotes').val();
        var notes  = $('#txtActivityNotes').val();
        var index = $("#indexForNotes").val();

        /*DALSpecs.updateAttributeNotes(rowGUID, index, notes, function(tx, results){
            if($('#txtActivityNotes').val().length > 0)
                $("#specsContainer").find("a[notesbutton][data-attribname='"+ $("#hidAtrriName").val()  +"']").find(".km-badge").show();
            else
                $("#specsContainer").find("a[notesbutton][data-attribname='"+ $("#hidAtrriName").val()  +"']").find(".km-badge").hide();
        });*/
    };

   	activityView.closeNotes = function(e)
    {
    	var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');
        popover.close();
    };


    return activityView;
});
