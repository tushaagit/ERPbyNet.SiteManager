'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'gauge', 'localizer', 'fileHandler', 'WSHandler', 'DALAuthTokens', 'downloadProjectsView', 'DALProjects', 'DALBuildings', 'networkInfo', 'projectView', 'mediaGalleryView', 'cookieManager', 'DALHelper'],
    function ($, cordova, kendo, app, gauge, localizer, fileHandler, WSHandler, DALAuthTokens, downloadProjectsView, DALProjects, DALBuildings, networkInfo, projectView, mediaGalleryView, cookieManager, DALHelper) {

        var homeView = kendo.observable({
            beforeShow: function (e) {
                var $view = $('#' + e.view.content.context.id);
                if ($view.length > 0) {
                    app.removeCachedViews($view);
                }
            },
            onShow: function () {
                var chkLogin = app.isUserAuthenticated();

                if (chkLogin == false) {
                    app.removePopupView();
                    app.mobileApp.navigate('app/loginView/view.html');
                }
            },
            afterShow: function () {
                homeView.init();
                homeView.initCharts();
                if (app.config.allAddingProjects == true) {
                    setTimeout(function () {
                        $('.displaynone').removeClass('displaynone');
                        $('.hidebtn').removeClass('hidebtn');
                    }, 500);
                }

            }
        });
        app.homeView = homeView;

        homeView.init = function () {
            localizer.translate();
            var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
            navbar.title(localizer.translateText("homeView.home"));
            app.mobileApp.view().header.find("#lblUserName").html(app.getLoggedInUserName());

        };

        homeView.set('title', localizer.translateText("homeView.home"));

        homeView.initCharts = function () {
            homeView.showProjectsStatus();
            //following code comment on  1st of march
            //homeView.showSpaceOccupied();
            //homeView.showNetworkConnection();
        };
        homeView.showProjectsStatus = function () {
            app.mobileApp.showLoading();
            DALProjects.getAllProjects(homeView.bindProjectData)
        };

        homeView.memoryConversion = function (size) {
            var Kb = 1 * 1024;
            var Mb = Kb * 1024;
            var Gb = Mb * 1024;
            var Tb = Gb * 1024;
            var Pb = Tb * 1024;
            var Eb = Pb * 1024;

            if (size < Kb) return size.toFixed(2) + " byte";
            if (size >= Kb && size < Mb) return (size / Kb).toFixed(2) + " Kb";
            if (size >= Mb && size < Gb) return (size / Mb).toFixed(2) + " Mb";
            if (size >= Gb && size < Tb) return (size / Gb).toFixed(2) + " Gb";
            if (size >= Tb && size < Pb) return (size / Tb).toFixed(2) + " Tb";
            if (size >= Pb && size < Eb) return (size / Pb).toFixed(2) + " Pb";
            if (size >= Eb) return (size / Eb).toFixed(2) + " Eb";

            return "";
        };

        homeView.bindProjectData = function (tx, projects) {
            try {
                var oppData = [];
                for (var i = 0; i < projects.rows.length; i++) {
                    oppData.push(projects.rows.item(i));
                }
                var dataSource = new kendo.data.DataSource({
                    data: oppData,
                    type: "json"

                });

                if (oppData.length == 0) {
                    $("#projectsList").html('<div class="listViewMessage">' + localizer.translateText("homeView.noProjectsMessage") + '</div>');
                    app.mobileApp.hideLoading();
                } else {
                    $("#projectsList").kendoMobileListView({
                        dataSource: dataSource,
                        template: $("#template").text(),
                        dataBound: homeView.dataBoundHandler,
                        click: function (e) {                             //Entire row click change
                            if (e.button != undefined) {                  //click on other than button area
                                if (e.button.options.icon == "details") { //click event on details button
                                    homeView.navigateToProject(e);      //go to navigateproject
                                } else if (e.button.options.icon == "camera" || e.button.options.icon == "videocamera") {
                                    homeView.naivgateToImageGallery(e);
                                } else if (e.button.options.icon == "arrowupload") {
                                    var networkCon = app.isOnline();
                                    if(networkCon === true){
                                        homeView.uploadData(e);
                                    } else {
                                        alert(localizer.translateText("homeView.noconnection"));
                                    }
                                } else if (e.button.options.icon == "delete"){
                                    if(e.dataItem !== undefined){
                                        homeView.deleteProject(e);
                                    }
                                } else if (e.button.options.icon == "percent") {
                                         //homeView.showMandatoryData(e);
                                } else if (e.button.options.icon == "edit") {
                                         homeView.navigateToEditProject(e);
                                }
                            } else {
                                homeView.navigateToProject(e);
                            }

                        }
                    });
                }
            }
            catch (ex) {
                alert(ex.message);
            }

        };



        /* original function is comment above.
        Entire row click chanage access parameter differently in navigateToProject.*/
        homeView.navigateToProject = function (e) {
            setTimeout(function () {
                app.removePopupView();
                app.mobileApp.navigate("app/projectView/view.html?ProjectID=" + e.dataItem.ProjectID)
            }, 500);
        };

        homeView.navigateToEditProject = function (e) {
            //var data = e.button.data();//original code
            var data = e.dataItem;
            var proID = data.ProjectID;
            app.removePopupView();
            //app.mobileApp.navigate("app/addEditProjectView/view.html?projectID=" + data.projectid);//original code
            app.mobileApp.navigate("app/addEditProjectView/view.html?projectID=" + proID);
        };

        homeView.navigateToAddProject = function (e) {
            var data = e.button.data();
            app.removePopupView();
            app.mobileApp.navigate("app/addEditProjectView/view.html");
        }



        /* original function is comment above.
           Entire row click chanage access parameter differently in naivgateToImageGallery.*/
        homeView.naivgateToImageGallery = function (e) {
            var mediaType = 'i';
            if (e.button.options.icon == 'videocamera')
                mediaType = 'v';
            setTimeout(function () {
                app.removePopupView();
                app.mobileApp.navigate("app/mediaGalleryView/view.html?RowGUID=" + e.dataItem.RowGUID + "&ProjectName=" + e.dataItem.ProjectName + '&mediaType=' + mediaType)
            }, 500);
        };

        homeView.dataBoundHandler = function () {
            $("[imggallery]").each(function (index) {
                var uid = $(this).attr("data-rowguid");
                var element = this;
                fileHandler.getMediaFilesCount(uid, 1, function (count) {
                    if (count > 0)
                        $(element).data("kendoMobileButton").badge(count);
                });
            });
            $("[vidgallery]").each(function (index) {
                var uid = $(this).attr("data-rowguid");
                var element = this;
                fileHandler.getMediaFilesCount(uid, 2, function (count) {
                    if (count > 0)
                        $(element).data("kendoMobileButton").badge(count);
                });
            });
            app.mobileApp.hideLoading();
        };

        homeView.uploadData = function (e) {

            navigator.notification.confirm(
                localizer.translateText("homeView.confirmUploadMsg"), // message
                function (buttonIndex) {
                    if (buttonIndex == 1) {
                        homeView.uploadDataToServer(e);
                    }
                    else {
                        alert(localizer.translateText("homeView.uploadCancelMsg"));
                    }
                },            // callback to invoke with index of button pressed
                'Upload data',           // title
                ['OK', 'Cancel']         // buttonLabels
            );

        };

        homeView.uploadDataToServer = function (e) {
            //var data = e.button.data();
            //var projectId = data.projectid;
            // var projectGuid = data.rowguid;
            var projectId = e.dataItem.ProjectID; //Entire row click chanage access parameter differently.
            var projectGuid = e.dataItem.RowGUID; //Entire row click chanage access parameter differently.
            var percentComplete = e.dataItem.PercentComplete;

            if(percentComplete==100 || app.config.allowPartialSurveyDataUpload == true){
                    var totalRecords = 0
                DALSets.getSetsOfAProject(projectId, function (tx, setresults) {
                    var totalSetCnt = setresults.rows.length;
                    var runningSetCnt = 0;
                for (var setindex = 0; setindex < setresults.rows.length; setindex++) {
                    var setID = setresults.rows.item(setindex).SetID;
                    DALSets.getDatatoUploadBySet(projectId, setID, function (tx, result) {
                    var specsData = [];
                    //console.log(result.rows);
                    for (var i = 0; i < result.rows.length; i++) {

                        specsData.push(result.rows.item(i));
                    }

                    var data = JSON.stringify(specsData);

                    var dataToPost = {
                        surveyInfo: data
                    };

                    //alert(localizer.translateDynamicText("homeView.upldTotlRecCntMsg", result.rows.length));

                    WSHandler.sendGetRequest('UploadSurveyInfo', dataToPost, function (tsresult) {
                        runningSetCnt++;
                        if(tsresult.length > 2)   //// consider quote length
                            alert('UploadSurveyInfo error : ' + tsresult);
                        else
                        {
                            totalRecords = totalRecords + result.rows.length;
                        }

                        if(totalSetCnt == runningSetCnt)
                        {
                            var projectIDdata = JSON.stringify(projectId);
                            var projectdataToPost = {
                                ProjectIDInfo: projectIDdata
                            };
                            WSHandler.sendGetRequest('UploadToActuals', projectdataToPost, function(usresult) {
                                alert(totalRecords + ' records : ' + usresult);

                                if (window.navigator.simulator === true) { }
                                else {
                                    try{
                                        alert(localizer.translateText("homeView.UploadingMediaFiles"));
                                        DALHelper.getMediaToUpload(projectId, projectGuid);
                                    }
                                    catch(e)
                                    {
                                        alert('Upload media files error');
                                    }

                                    }
                            }, function() {
                                alert('UploadToActuals failed');

                            } );

                        }

                    }, function (tsresult, ex) { alert(localizer.translateText("app.failed") + ' ' + ex + ' ' + tsresult); });

                });
                }
            });

            }else{
                alert(localizer.translateText("homeView.UploadAbortText"));
            }
        };


        homeView.showMandatoryData = function (e) {

            var percentComplete = e.dataItem.PercentComplete; //Entire row click chanage access parameter differently.
            var projectId = e.dataItem.ProjectID;
            var surveyTypeID = e.dataItem.SurveyTypeID;
            if(percentComplete<=100){
            DALSets.getMandatoryProductAttributes(projectId, surveyTypeID, function (tx, result) {
            console.log(result);
                var uploadDataAbort = false;
                var uploadNoPhotoAbort = false;
                var abortedAttributeNames = " <b> " + $('#errorTitle').text() + " </b> <br/> <br/> ";
                var abortedPhotoAttributeNames = " <b> " + localizer.translateText("homeView.PhotosRequiredAlert") + " </b> <br/> <br/> ";
                var categoryName = "";
                var groupName = "";
                var setName = "";
                var attrbName = "";
                var tempPhotoCatName = "";
                var tempPhotoGrpName = "";
                var photoCategoryName = "";
                var photoGroupName = "";
                var photoSetName = "";
                console.log(result.rows);
                for (var i = 0; i < result.rows.length; i++) {
                   // if (app.config.allowPartialSurveyDataUpload == false) {
                        if (result.rows.item(i).IsMandatory == "true" && result.rows.item(i).AttributeValue == "" && result.rows.item(i).IsHidden == "false" ) {
                            uploadDataAbort = true;
                            if (categoryName != result.rows.item(i).Location || groupName != result.rows.item(i).EquipType || setName != result.rows.item(i).SetName){
                            abortedAttributeNames += "</ul> <div class='questionListCategory'> <p> <strong> Project Name: </strong> " + result.rows.item(i).ProjectName + " <strong> Building Name: </strong> " + result.rows.item(i).BuildingName + " <strong> Group Name: </strong> " + result.rows.item(i).GroupName + " <strong> Set Name: </strong> " + result.rows.item(i).SetName + " </p></div> <div class='questionListGroup'> <p> <strong> Location: </strong> " + result.rows.item(i).Location + " <strong> Equpment Type: </strong> " + result.rows.item(i).EquipType + " </p></div> <ul class='questionList'><li> " + result.rows.item(i).Prompt + "</li>";
                            }else
                                abortedAttributeNames += " <li> " + result.rows.item(i).Prompt + "</li>";
                            categoryName = result.rows.item(i).Location;
                            groupName = result.rows.item(i).EquipType;
                            setName = result.rows.item(i).SetName
                        }
                        if (result.rows.item(i).IsPhotoRequired == 1) {

                            attrbName = result.rows.item(i).Prompt;
                            tempPhotoCatName = result.rows.item(i).Location;
                            tempPhotoGrpName = result.rows.item(i).EquipType;

                            fileHandler.getMediaFilesCount(result.rows.item(i).RowGUID + "-" + result.rows.item(i).IndexValue, 1, function (count) {
                                if (count == 0) {
                                    uploadNoPhotoAbort = true;
                                    if (photoCategoryName != tempPhotoCatName || photoGroupName != tempPhotoGrpName || photoSetName != result.rows.item(i).SetName){
                                    abortedPhotoAttributeNames += "</ul> <div class='questionListCategory'> <p> <strong> Project Name: </strong> " + result.rows.item(i).ProjectName + " <strong> Building Name: </strong> " + result.rows.item(i).BuildingName + " <strong> Group Name: </strong> " + result.rows.item(i).GroupName + " <strong> Set Name: </strong> " + result.rows.item(i).SetName + " </p></div> <div class='questionListGroup'> <p> <strong> Location: </strong> " + tempPhotoCatName + " <strong> Equpment Type: </strong> " + tempPhotoGrpName + " </p></div> <ul class='questionList'><li> " + attrbName + "</li>";
                                    } else{
                                    abortedPhotoAttributeNames +=  " <li> " + attrbName + "</li>";
                                    }
                                }
                                photoCategoryName = tempPhotoCatName;
                                photoGroupName = tempPhotoGrpName;
                                photoSetName = result.rows.item(i).SetName;
                            });

                        }

                   // }
                }

                setTimeout(function () {

                        if (uploadNoPhotoAbort == false)
                            abortedPhotoAttributeNames = " </br> ";

                        if (uploadDataAbort == false)
                            abortedAttributeNames = "</br>";

                        $("#promptContainer").html(abortedAttributeNames + " </br> </br> " + abortedPhotoAttributeNames);
                        $("#popover-Prompt").data("kendoMobilePopOver").open("#promptContainer");
                        $(".k-animation-container").css({ top: '0px', align: 'center', left:'0px' });


                }, 1000);

            });

                if(app.config.allowPartialSurveyDataUpload == false)
                    $('.hideMandatoryText').removeClass('hideMandatoryText');
            }else{
                alert(localizer.translateText("homeView.allQuestionAnswered"));
            }
        };


        homeView.closeParentPopover = function (e) {

            var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');

            popover.close();
        };

        //Delete Individual project from home view
        homeView.deleteProject = function (e) {
            var x = confirm("Do you really want to delete this project?");
            if(x === true){
                var proID = e.dataItem.ProjectID;//get ProjectID
                var proID_array = [];//create empty array
                proID_array.push(proID);//push into created array
                DALProjects.deleteProjectData(proID_array, function(tx, records){
                    homeView.afterShow();//when success then call same page
                });
            }
        };

        return homeView;
    });

// START_CUSTOM_CODE_homeView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
//(function () {
//	app.homeView.set('title', 'Home');
//})();
// END_CUSTOM_CODE_homeView
