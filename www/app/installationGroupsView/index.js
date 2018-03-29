'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALAuthTokens', 'networkInfo', 'cookieManager', 'DALHelper', 'DALProjects', 'DALInstallationGroups'],
    function ($, cordova, kendo, app, localizer, WSHandler, DALAuthTokens, networkInfo, cookieManager, DALHelper, DALProjects, DALInstallationGroups) {

        var installationGroupsView = kendo.observable({
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
                $(".homeButton").show();
            },
            afterShow: function (e) {
                installationGroupsView.projectID = e.view.params.ProjectID;
                installationGroupsView.showProjectData(installationGroupsView.projectID);
                installationGroupsView.showinstallationGroupsData(installationGroupsView.projectID);
                installationGroupsView.init();
            }
        });

        app.installationGroupsView = installationGroupsView;

        installationGroupsView.showProjectData = function (projectID) {
            DALProjects.getProject(projectID, installationGroupsView.bindProjectData)
        }

        installationGroupsView.showinstallationGroupsData = function (projectID) {
            DALInstallationGroups.getInstallationGroupsOfAProject(projectID, installationGroupsView.bindInstallationGroupsData)
        }

        //alert(screen.availWidth);
        installationGroupsView.init = function () {
            localizer.translate();
            var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
            navbar.title(localizer.translateText("installationGroupsView.title"));
            app.mobileApp.view().header.find("#lblUserName").html(app.getLoggedInUserName());
            installationGroupsView.authTokenID = app.authToken;

           /* var installationGroupsDS = new kendo.data.DataSource({
                transport: {
                    read: {
                        contentType: "application/json; charset=utf-8",
                        type: "GET",
                        data: {},
                        dataType: "json",
                        url: "json/installationGroupsViewDetails.json"
                    }
                }
            });

            installationGroupsDS.filter([
                { field: "id", operator: "eq", value: parseInt(installationGroupsView.projectID) }
            ]);

            $("#installationGroupsList").kendoMobileListView({
                template: $("#installationGroupsListTemplate").text(),
                dataSource: installationGroupsDS,
                selectable: "single",
                click: installationGroupsView.groupListSelected

            });*/

        };

        /* installationGroupsView.showProjectData = function (projectID) {

            var projectDataDS = new kendo.data.DataSource({
                transport: {
                    read: {
                        contentType: "application/json; charset=utf-8",
                        type: "GET",
                        data: "{}",
                        dataType: "json",
                        url: "json/siteDetails.json"
                    }
                }
            });

            projectDataDS.filter([
                { field: "id", operator: "eq", value: parseInt(projectID) }
            ]);
            console.log(projectDataDS);

            $("#projectList").kendoMobileListView({
                template: $("#projectListTemplate").text(),
                dataSource: projectDataDS,
                selectable: "single",
            });

        }; */


        installationGroupsView.bindProjectData = function (tx, project) {
            var projectData = [];
            for (var i = 0; i < project.rows.length; i++) {
                projectData.push(project.rows.item(i));
            }

            var projectDataDS = new kendo.data.DataSource({
                data: projectData,
                type: "json"
            });

            if (projectData.length > 0) {

                $("#projectList").kendoMobileListView({
                    template: $("#projectListTemplate").text(),
                    dataSource: projectDataDS,
                    selectable: "single",
                });

            }
        };


        installationGroupsView.bindInstallationGroupsData = function (tx, installationGroups) {

            try {
                var installationGroupsData = [];

                for (var i = 0; i < installationGroups.rows.length; i++) {
                    installationGroupsData.push(installationGroups.rows.item(i));
                }

                var installationGroupsDS = new kendo.data.DataSource({
                    data: installationGroupsData,
                    type: "json"
                });

                $("#installationGroupsList").kendoMobileListView({
                    dataSource: installationGroupsDS,
                    template: $("#installationGroupsListTemplate").text(),
                    selectable: "single",
                    click: installationGroupsView.groupListSelected
                });
            } catch (ex) {
                alert(ex.message);
            }

        };


        installationGroupsView.groupListSelected = function (e) {
            var opportunityID = e.dataItem.OpportunityID;
            var opportunityInstallationGroupID = e.dataItem.OpportunityInstallationGroupID;
            //console.log(e);
            app.mobileApp.navigate("app/activityView/view.html?projectID=" + opportunityID + "&groupID=" + opportunityInstallationGroupID);
        }

        return installationGroupsView;
    });

// START_CUSTOM_CODE_installationGroupsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
//(function () {
//	app.installationGroupsView.set('title', 'Home');
//})();
// END_CUSTOM_CODE_installationGroupsView
