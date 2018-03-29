'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'fileHandler', 'localizer', 'cookieManager', 'DALMain', 'DALAuthTokens', 'DALProjects', 'DALBuildings',
    'DALGroups', 'DALSets', 'DALDataSyncStatus', 'WSHandler', 'dataSyncStatusManager',
    'DALAppVersions', 'config', 'DALErrorLog', 'DALConfigParams', 'DALInstallationGroups'],
    function ($, cordova, kendo, app, fileHandler, localizer, cookieManager, DALMain, DALAuthTokens, DALProjects, DALBuildings,
        DALGroups, DALSets, DALDataSyncStatus, WSHandler, dataSyncStatusManager,
        DALAppVersions, config, DALErrorLog, DALConfigParams, DALInstallationGroups) {

        var dbInitView = kendo.observable({
            beforeShow: function (e) {
                var $view = $('#' + e.view.content.context.id);
                if ($view.length > 0) {
                    app.removeCachedViews($view);
                }
            },
            onShow: function () {
                var chkLogin = app.isUserAuthenticated();//call for valid user check method in app page
                if (chkLogin == false) {//check for valid user session
                    app.mobileApp.navigate('app/loginView/view.html');//Not login then goto login page
                }
            },
            afterShow: function (e) {
                var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
                navbar.title(localizer.translateText("setup.setup"));
                dbInitView.init();
                app.notifier = dbInitView;

                //if (e.view.params.SetupStatus == "new")
                    dbInitView.doDBSetup();
                //else
                //    $("#dialog").data("kendoMobileModalView").open();
            }
        });
        app.dbInitView = dbInitView;

        dbInitView.init = function () {
            localizer.translate();
        };

        dbInitView.notify = function (message, error, highlight) {
            var notificationClass = '';

            if (error)
                notificationClass = ' class="errorMessage" ';

            if (highlight)
                notificationClass = ' class="highlightMessage" ';

            $("#setupNotificationBoxDBInit").html($("#setupNotificationBoxDBInit").html() + '<p ' + notificationClass + '>' + message + '</p>');
        };


        dbInitView.set('title', localizer.translateText("setup.setup"));
        dbInitView.set('clearData', false);

        dbInitView.doDBSetup = function () {
            //if(dbInitView.dropTables == true){
            app.notify('Tables will be dropped and recreated.');
            DALAuthTokens.dropTable();
            DALProjects.dropTable();
            DALBuildings.dropTable();
            DALGroups.dropTable();
            DALSets.dropTable();
            DALInstallationGroups.dropTable();

            DALDataSyncStatus.dropTable();

            //Create all the tables in proper sequence
            app.notify(localizer.translateText("setup.dbInitMsg"), false, true);
            //$("#imgdbInitLoader").css("display", "block");
            app.mobileApp.showLoading();


            DALAppVersions.createTable(function () {
                DALAuthTokens.createTable(function () {
                    DALProjects.createTable(function () {
                        DALBuildings.createTable(function () {
                            DALGroups.createTable(function () {
                                DALSets.createTable(function () {
                                    DALDataSyncStatus.createTable(function () {
                                        DALErrorLog.createTable(function () {
                                         DALInstallationGroups.createTable(function () {
                                          dataSyncStatusManager.setup(function () {
                                              app.notify(localizer.translateText("setup.dbSetupCompMsg"), false, true);
                                              app.notify(localizer.translateText("setup.smplDataPopltngMsg"), false, true);
                                              dbInitView.populateSampleData();
                                            });
                                          });
                                        });
                                    });
                                });
                            });
                        });
                    })
                })
            });
        };

        dbInitView.populateSampleData = function () {
            dbInitView.populateConfigData();

            app.notify(localizer.translateText("setup.dataPoplStrtMsg"), false, true);
        };


        dbInitView.populateProjectData = function () {
            DALProjects.clearData();
            var SITE_SURVEY_TYPE = 4;
            DALProjects.addProject(1, "TEST0001", "REF001", "Rutuparna", "D.P.Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 10, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(2, "TEST0002", "REF002", "Woodlands", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 20, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(3, "TEST0003", "REF003", "Sneh Classic", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(4, "TEST0004", "REF004", "Kanchanganga", "37 Mayur Colony",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(5, "TEST0005", "REF005", "Himagauri", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(6, "TEST0006", "REF006", "Aboli", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(7, "TEST0007", "REF007", "Shivpratap", "37 Mayur Colony",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(8, "TEST0009", "REF008", "Pinnac Memories", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(9, "TEST0010", "REF009", "Mahesh Plaza", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);
            DALProjects.addProject(10, "TEST0010", "REF010", "Tushar Residency", "D. P. Road",
                "Kothrud", "Pune", "411038", "Maharashtra", "India", 1, 0, "Important Project", app.getGUID(), SITE_SURVEY_TYPE);

            DALProjects.getAllProjects(function (tx, projects) {
                app.notify(localizer.translateDynamicText("setup.projAddMsg", projects.rows.length));
            });
        };


        dbInitView.populateCountryData = function () {
            DALCountry.clearData();
            DALCountry.addCountry(1, "India", 0);
            DALCountry.addCountry(2, "USA", 0);
        };


        dbInitView.populateStateData = function () {
            DALState.clearData();

            DALState.addState(1, 1, "Maharashtra", 0);
            DALState.addState(1, 2, "Gujrat", 0);
            DALState.addState(1, 3, "Madhya Pradesh", 0);
            DALState.addState(1, 4, "Goa", 0);
            DALState.addState(2, 1, "New York", 0);
            DALState.addState(2, 2, "New Jersey", 0);
            DALState.addState(2, 3, "California", 0);
            };

	        dbInitView.populateSurveyTypesData = function () {
	            surveyTypeManager.populateSurveyTypesData();
        };

        dbInitView.populateBuildingData = function () {
            DALBuildings.clearData();

            DALBuildings.addBuilding(1, 1, "B0001", "Tower A", 1, 10, null);
            DALBuildings.addBuilding(1, 2, "B0002", "Tower B", 1, 10, null);
            DALBuildings.addBuilding(1, 3, "B0003", "Tower C", 1, 10, null);

            DALBuildings.addBuilding(2, 1, "B0004", "Tower A", 1, 20, null);
            DALBuildings.addBuilding(2, 2, "B0005", "Tower B", 1, 20, null);
            DALBuildings.addBuilding(2, 3, "B0006", "Tower C", 1, 20, null);
            DALBuildings.addBuilding(2, 4, "B0007", "Tower D", 1, 20, null);

            DALBuildings.getAllBuildings(function (tx, buildings) {
                app.notify(localizer.translateDynamicText("setup.bldgAddMsg", buildings.rows.length));
            });
        };

        dbInitView.populateGroupData = function () {
            DALGroups.clearData();

            DALGroups.addGroup(1, 1, 1, "G0001", "Low Rise", 1, 10, null);
            DALGroups.addGroup(1, 1, 2, "G0002", "Medium Rise", 1, 10, null);
            DALGroups.addGroup(1, 1, 3, "G0003", "High Rise", 1, 10, null);

            DALGroups.addGroup(1, 2, 1, "G0004", "Front Lobby", 1, 10, null);
            DALGroups.addGroup(1, 2, 2, "G0005", "Back Lobby", 1, 10, null);
            DALGroups.addGroup(1, 2, 3, "G0006", "Parking", 1, 10, null);

            DALGroups.addGroup(1, 3, 1, "G0007", "Low Rise", 1, 10, null);
            DALGroups.addGroup(1, 3, 2, "G0008", "Medium Rise", 1, 10, null);
            DALGroups.addGroup(1, 3, 3, "G0009", "High Rise", 1, 10, null);

            DALGroups.addGroup(2, 1, 1, "G0010", "Low Rise", 1, 20, null);
            DALGroups.addGroup(2, 1, 2, "G0011", "Medium Rise", 1, 20, null);
            DALGroups.addGroup(2, 1, 3, "G0012", "High Rise", 1, 20, null);

            DALGroups.addGroup(2, 2, 1, "G0013", "Front Lobby", 1, 20, null);
            DALGroups.addGroup(2, 2, 2, "G0014", "Back Lobby", 1, 20, null);
            DALGroups.addGroup(2, 2, 3, "G0015", "Parking", 1, 20, null);

            DALGroups.addGroup(2, 3, 1, "G0016", "Low Rise", 1, 20, null);
            DALGroups.addGroup(2, 3, 2, "G0017", "Medium Rise", 1, 20, null);
            DALGroups.addGroup(2, 3, 3, "G0018", "High Rise", 1, 20, null);

            DALGroups.addGroup(2, 4, 1, "G0019", "Low Rise", 1, 20, null);
            DALGroups.addGroup(2, 4, 2, "G0020", "Medium Rise", 1, 20, null);
            DALGroups.addGroup(2, 4, 3, "G0021", "High Rise", 1, 20, null);

            DALGroups.getAllGroups(function (tx, groups) {
                app.notify(localizer.translateDynamicText("setup.grpAddMsg", groups.rows.length));

            });
        };

        dbInitView.populateSetData = function () {
            DALSets.clearData();
            DALSpecs.clearData();
            /*
                projectID, buildingID, groupID, setID,
                                            setNo, setName, oldProductType, newProductType, noOfUnits, surveyVersionNo,
                                                    attribute1, attribute2, attribute3, attribute4, attribute5, attribute6, attribute7, attribute8, attribute9, attribute10,
                                            status, percentComplete, notes
                                            */

            /* DALSets.addSet (1, 1, 1, 1, "S0001", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
             DALSets.addSet (1, 1, 1, 2, "S0002", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);

             DALSets.addSet (1, 1, 2, 1, "S0003", "Lift 1-2", 72, 73, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
             DALSets.addSet (1, 1, 2, 2, "S0004", "Lift 3-4", 72, 74, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);

             DALSets.addSet (1, 1, 3, 1, "S0005", "Lift 1-2", 72, 74, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
             DALSets.addSet (1, 1, 3, 2, "S0006", "Lift 3-4", 72, 73, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);      */

            DALSets.addSet(1, 1, 1, 1, "S0001", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 1, 1, 2, "S0002", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 1, 2, 1, "S0003", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 1, 2, 2, "S0004", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 1, 3, 1, "S0005", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 1, 3, 2, "S0006", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 2, 1, 1, "S0007", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 2, 1, 2, "S0008", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 2, 2, 1, "S0009", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 2, 2, 2, "S0010", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 2, 3, 1, "S0011", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 2, 3, 2, "S0012", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 3, 1, 1, "S0013", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 3, 1, 2, "S0014", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 3, 2, 1, "S0015", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 3, 2, 2, "S0016", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 3, 3, 1, "S0017", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 3, 3, 2, "S0018", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 4, 1, 1, "S0019", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 4, 1, 2, "S0020", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 4, 2, 1, "S0021", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 4, 2, 2, "S0022", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 4, 3, 1, "S0023", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(1, 4, 3, 2, "S0024", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 10, null);
            DALSets.addSet(2, 1, 1, 1, "S0025", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 1, 1, 2, "S0026", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 1, 2, 1, "S0027", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 1, 2, 2, "S0028", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 1, 3, 1, "S0029", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 1, 3, 2, "S0030", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 2, 1, 1, "S0031", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 2, 1, 2, "S0032", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 2, 2, 1, "S0033", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 2, 2, 2, "S0034", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 2, 3, 1, "S0035", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 2, 3, 2, "S0036", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 3, 1, 1, "S0037", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 3, 1, 2, "S0038", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 3, 2, 1, "S0039", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 3, 2, 2, "S0040", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 3, 3, 1, "S0041", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 3, 3, 2, "S0042", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 4, 1, 1, "S0043", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 4, 1, 2, "S0044", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 4, 2, 1, "S0045", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 4, 2, 2, "S0046", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 4, 3, 1, "S0047", "Lift 1-2", 72, 71, 2, 1, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);
            DALSets.addSet(2, 4, 3, 2, "S0048", "Lift 3-4", 72, 72, 2, 2, "1350", "3.5", "28.0", "10", "No", "9", "1", null, null, null, 1, 20, null);



            DALSets.getAllSets(function (tx, sets) {
                app.notify(localizer.translateDynamicText("setup.setAddMsg", sets.rows.length));
            });
        };

        dbInitView.populateConfigData = function () {

            DALAppVersions.addVersionNumber(config.appVersion, function () {


                DALConfigParams.setPathsConfigData(function () {
                    app.notify(localizer.translateText("setup.dataPoplCompMsg"), false, true);
                    app.notify(localizer.translateText("setup.dbInitCompMsg"), false, true);
                    //$("#imgdbInitLoader").css("display", "none");
                    app.mobileApp.hideLoading();

                });
            });

        };

        dbInitView.confirmation = function () {
            $("#dialog").data("kendoMobileModalView").close();
            if ($("#buttonYesNo").data("kendoMobileButtonGroup").current().index() == 2) {
                app.mobileApp.navigate("app/homeView/view.html");
            }
            else if ($("#buttonYesNo").data("kendoMobileButtonGroup").current().index() == 1) {
                dbInitView.doDBSetup();
            }

        };


        dbInitView.close = function () {
          if(app.isUserAuthenticated)
            app.mobileApp.navigate("app/homeView/view.html");
          else
            app.mobileApp.navigate("app/loginView/view.html");
        };
        return dbInitView;
    })
