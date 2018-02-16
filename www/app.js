
'use strict';
define(['jquery', 'cordova', 'config', 'DALMain', 'networkInfo', 'cookieManager', 'DALHelper', 'trialManager', 'localizer', 'DALAppVersions', 'DALConfigParams', 'DALErrorLog', 'utils'],
    function ($, cordova, config, DALMain, networkInfo, cookieManager, DALHelper, trialManager, localizer, DALAppVersions, DALConfigParams, DALErrorLog, utils) {

        var app = {
            data: {},
            config: config
        };
        window.app = app;

        app.bootstrap = function () {
            $(function () {


                DALMain.init();
                DALConfigParams.createTable(function () {
                    //Load basic configuration parameters
                    config.loadConfiguration(function () {
                        app.setInitialPage();
                        networkInfo.init();
                        app.showNetworkInfo();//call showNetworkInfo function.
                        app.showVersion();
                        app.utils = utils;
                    });

                });
            });
        };
        //Check user Logged in or not
        app.isUserAuthenticated = function () {
            if (cookieManager.readCookie('userName') === undefined || cookieManager.readCookie('userName') == '' || cookieManager.readCookie('userName') === null) {

                return false;
            } else {
                return cookieManager.isExpired('userName');

            }
        };

        app.getLoggedInUserName = function () {
            var cookie = cookieManager.readCookie('userName');
            var start = cookie.indexOf("=") + 1;
            var end = cookie.indexOf(";");
            return cookie.substring(start, end);
        };


        app.showNetworkInfo = function () {
            app.showSpaceOccupied();
            app.showNetworkConnection();
        };

        app.tempAlert = function (parentDiv, msg, duration) {
            try {
                var el = document.createElement("div");
                el.setAttribute("class", "tempAlertPop");

                el.innerText = "    " + msg + "    ";
                setTimeout(function () {
                    el.parentNode.removeChild(el);
                }, duration);
                document.body.appendChild(el);
            }
            catch (e) {
                alert(e);
            }
        };
        app.setInitialPage = function () {
            DALHelper.doesProjectsTableExists(app.isDBSetupRequired);
        };

        app.isDBSetupRequired = function (tx, resultTable) {

            if (resultTable.rows.length > 0) {

                trialManager.isTrialStillAvailable(function (trialAvailable) {
                    if (trialAvailable) {
                        var chkLogin = app.isUserAuthenticated();//call for valid user check method in app page

                        if (chkLogin == true) {//check for valid user session
                            $("#loggedInUser").text(localizer.translateText("app.signout") + " (" + app.getLoggedInUserName() + ")");
                            $("#lblUserName").html(app.getLoggedInUserName());
                            app.mobileApp = new kendo.mobile.Application(document.body, {
                                skin: 'flat',
                                transition: 'slide',
                                initial: 'app/homeView/view.html'
                            });
                        }
                        else {
                            app.mobileApp = new kendo.mobile.Application(document.body, {
                                skin: 'flat',
                                transition: 'slide',
                                initial: 'app/loginView/view.html'
                            });
                        }

                    }
                });
            }
            else {
                app.mobileApp = new kendo.mobile.Application(document.body, {
                    skin: 'flat',
                    transition: 'slide',
                    initial: 'app/dbInitView/view.html'
                });
            }
        };


        app.init = function () {

            // global error handling code
            var logDataError = function (message, title, callback) {
                DALErrorLog.addErrorLog(message, app.errorLogSucceeded, app.erroLogFailed);
            };

            app.erroLogFailed = function (result) {
                console.log(result);
            };

            app.errorLogSucceeded = function (result) {

                console.log(result);
                DALErrorLog.getLogDetails(app.bindErrorLog);
            };

            app.bindErrorLog = function (txn, errorLogDat) {

                if (errorLogDat.rows.length > 0) {
                    console.log(errorLogDat.rows.item(0).ErrorDetail);
                }
            }


            var showError = function (message) {
                logDataError(message, 'Error occurred');
            };
            window.addEventListener('error', function (e) {
                // e.preventDefault();
                var message = e.message + "' from " + e.filename + ":" + e.lineno;
                logDataError(message, 'Error occurred');
                return true;
            });
            var tabindex = 0;
            window.addEventListener('keydown', function (e) {
                if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
                    tabindex = e.target.tabIndex + 1;
                    $("[TabIndex='" + tabindex + "']").focus();
                    return false;
                }
            }, true);

            localizer.translate();
            if (window.cordova) {
                document.addEventListener('deviceready', function () {
                    if (navigator && navigator.splashscreen) {
                        navigator.splashscreen.hide();
                    }
                    var element = document.getElementById('appDrawer');
                    if (typeof (element) != 'undefined' && element !== null) {
                        if (window.navigator.msPointerEnabled) {
                            $('#navigation-container').on('MSPointerDown', 'a', function (event) {
                                app.keepActiveState($(this));
                            });
                        } else {
                            $('#navigation-container').on('touchstart', 'a', function (event) {
                                app.keepActiveState($(this));
                            });
                        }
                    }

                    app.bootstrap();
                }, false);
            } else {
                app.bootstrap();
            }
        }

        app.keepActiveState = function _keepActiveState(item) {
            var currentItem = item;
            $('#navigation-container li a.active').removeClass('active');
            currentItem.addClass('active');
        };


        app.getGUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        app.isOnline = function () {
            if (!navigator || !navigator.connection) {
                return true;
            } else {
                return navigator.connection.type !== 'none';
            }
        };

        app.drawerVisiblility = function () {
            //if(app.mobileApp.view().id == "app/loginView/view.html")
            if (cookieManager.readCookie('userName') == undefined || cookieManager.readCookie('userName') == "") {
                $("#appDrawer").data("kendoMobileDrawer").hide();
            }
            else {
                if (app.mobileApp.view().id.indexOf("surveyView") > 0) {
                    $("#appDrawer").data("kendoMobileDrawer").hide();
                    $("#specs-left-drawer").data("kendoMobileDrawer").show();
                }
            }
        };

        app.notify = function (message, error, highlight) {
            app.notifier.notify(message, error, highlight);
        };
        //Extend the Date object
        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        };

        app.replaceAll = function (target, search, replacement) {
            return String(target).split(search).join(replacement);
        };

        app.formatForID = function (input) {
            return input.trim().replace(/[^a-z0-9]+/gi, '-');
        };
        //code  added on 1st of march 2017 for  network information
        app.showSpaceOccupied = function () {
            try {
                if (window.navigator.simulator != true) {
                    chrome.system.memory.getInfo(
                        function (info) {

                            var perFreeMomory;
                            var totalCapacity = info.capacity;
                            var availCapacity = info.availableCapacity;

                            perFreeMomory = availCapacity / totalCapacity;
                            perFreeMomory = perFreeMomory * 100;

                            var numb = perFreeMomory;
                            numb = Math.round(numb);
                            numb = 100 - numb;
                            /*
                            $("#ggeSpace").gauge(numb, { color: "#696969", unit: localizer.translateText("homeView.deviceStatMsg"), font: "40px verdana" });
                            */

                            $('#ggeSpace').jQMeter({
                                goal: '$100',
                                raised: '$' + numb,
                                meterOrientation: 'vertical',
                                width: '40px',
                                height: '40px'
                            });
                            //alert("avail: "+ homeView.memoryConversion(info.availableCapacity)+" of "+homeView.memoryConversion(info.capacity));
                        });
                }
                else {

                    /*$("#ggeSpace").gauge(10, { color: "#696969", unit: localizer.translateText("homeView.deviceStatMsg"), font: "40px verdana" });*/
                    $('#ggeSpace').jQMeter({
                        goal: '100',
                        raised: '90',
                        meterOrientation: 'vertical',
                        width: '40px',
                        height: '40px'
                    });
                }
            }
            catch (e) {
                //alert(e.toString());
            }
        };
        //following code added on 1st of march 2017
        app.showNetworkConnection = function () {
            var connectionType = networkInfo.connectionType;
            switch (connectionType) {
                case 'Unknown connection':
                    $("#conLogo").attr("src", "images/nonetwork-logo.jpg");
                    break;
                case 'Ethernet connection':
                    $("#conLogo").attr("src", "images/wifi-logo.jpg");
                    break;
                case 'WiFi connection':
                    $("#conLogo").attr("src", "images/wifi-logo.jpg");
                    break;
                case 'Cell 2G connection':
                    $("#conLogo").attr("src", "images/wifi-logo.jpg");
                    break;
                case 'Cell 3G connection':
                    $("#conLogo").attr("src", "images/3g-logo.jpg");
                    break;
                case 'Cell 4G connection':
                    $("#conLogo").attr("src", "images/4g-logo.jpg");
                    break;
                case 'Cell generic connection':
                    $("#conLogo").attr("src", "images/wifi-logo.jpg");
                    break;
                case 'No network connection':
                    $("#conLogo").attr("src", "images/nonetwork-logo.jpg");
                    break;
                default:
                    $("#conLogo").attr("src", "images/nonetwork-logo.jpg");
            }

        };
        app.showVersion = function () {
            var appVersion = config.appVersion;
            $("#appVersion").html("Version: " + appVersion);
        };

        app.navigateToSetup = function () {
            $("#appDrawer").data("kendoMobileDrawer").hide();
            app.mobileApp.navigate("app/dbInitView/view.html?SetupStatus=repeat");
        };

        app.reeetConfigParams = function () {
            $("#appDrawer").data("kendoMobileDrawer").hide();
            app.downloadProductsView.openConfigPopup();
            //DALConfigParams.dropTable();
            //DALConfigParams.createTable();
        }

        /*app.emailErrorLogfunc = function()
         {
             $("#appDrawer").data("kendoMobileDrawer").hide();
             app.mobileApp.navigate("app/emailErrorLogView/view.html");
         };*/

        app.removeCachedViews = function ($divCurrentView) {
            if ($divCurrentView.length > 0) {
                var id = $divCurrentView.attr('id');

                $("div[data-role='view']").each(function () {
                    var $view = $(this);

                    if ($view.attr('id') != id) {
                        var view = $view.data("kendoMobileView");
                        if (typeof (view) != 'undefined') {
                            if($view.attr('id').indexOf("ViewID") != -1){
                            view.destroy();
                            $view.remove();
                            }
                        }
                    }
                });
            }
        }

        app.removePopupView = function () {
            $('.km-popover-root').remove();
        }
        app.attributeCounter = 0;
        app.valuesCounter = 0;
        app.surveyMappingsCounter = 0;
        app.categoriesCounter = 0;
        app.attributeGroupsCounter = 0;
        app.aRGAttributeCounter = 0;
        return app;
    });

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp
