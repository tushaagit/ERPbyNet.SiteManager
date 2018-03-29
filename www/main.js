requirejs.config({
  waitSeconds: 120,
  paths: {
    jquery: "kendo/js/jquery.min",
    jqueryui: "kendo/js/jquery-ui",
    cordova: "cordova",
    async: "scripts/lib/async",
    kendo: "kendo/js/kendo.mobile.min",
    functionQueue: "scripts/functionQueue",
    hashTable: "scripts/hashTable",
    imageCompressor: "scripts/imageCompressor",
    config: "scripts/config",
    utils: "scripts/utils",
    gauge: "scripts/lib/jquery.jQMeter",
    en: "resources/locales/en/translation",
    en_US: "resources/locales/en-US/translation",
    hi_IN: "resources/locales/hi-IN/translation",
    ja_JP: "resources/locales/ja_JP/translation",
    pt: "resources/locales/pt/translation",
    localizer: "scripts/localizer",
    WSHandler: "scripts/WSHandler",
    fileHandler: "scripts/fileHandler",
    cookieManager: "scripts/cookieManager",
    dropdown: "scripts/lib/jquery.dd.min",
    mediaHandler: "scripts/mediaHandler",

    trialManager: "scripts/businessLayer/trialManager",
    authenticationManager: "scripts/businessLayer/authenticationManager",
    projectManager: "scripts/businessLayer/projectManager",
    installationGroupsManager: "scripts/businessLayer/installationGroupsManager",
    buildingManager: "scripts/businessLayer/buildingManager",
    groupManager: "scripts/businessLayer/groupManager",
    setManager: "scripts/businessLayer/setManager",
    dataSyncStatusManager: "scripts/businessLayer/dataSyncStatusManager",
    commonScriptManager: "scripts/businessLayer/commonScriptManager",

    networkInfo: "scripts/networkInfo",

    DALMain: "scripts/dataAccessLayer/DALMain",
    DALAuthTokens: "scripts/dataAccessLayer/DALAuthTokens",
    DALProjects: 'scripts/dataAccessLayer/DALProjects',
    DALBuildings: "scripts/dataAccessLayer/DALBuildings",
    DALSets: "scripts/dataAccessLayer/DALSets",
    DALGroups: "scripts/dataAccessLayer/DALGroups",
    DALDataSyncStatus: "scripts/dataAccessLayer/DALDataSyncStatus",
    DALHelper: "scripts/dataAccessLayer/DALHelper",
    DALTrialVersion: "scripts/dataAccessLayer/DALTrialVersion",
    DALAppVersions: "scripts/dataAccessLayer/DALAppVersions",
    DALConfigParams: "scripts/dataAccessLayer/DALConfigParams",
    DALErrorLog: "scripts/dataAccessLayer/DALErrorLog",
    DALInstallationGroups: "scripts/dataAccessLayer/DALInstallationGroups",
    dbInitView: "app/dbInitView/index",
    trialExpired: "app/trialExpired/index",
    loginView: "app/loginView/index",
    homeView: "app/homeView/index",
    downloadProjectsView: "app/downloadProjectsView/index",
    installationGroupsView:  "app/installationGroupsView/index",
    activityView:  "app/activityView/index",
    projectView: "app/projectView/index",
    mediaGalleryView: "app/mediaGalleryView/index",
    imageView: "app/imageView/index",
    aboutView: "app/aboutView/index",


  },

  shim: {
    jquery: {
      exports: '$'
    },
    cordova: {
      exports: 'cordova'
    },
    kendo: {
      deps: ['jquery'],
      exports: 'kendo'
    },

    gauge: {
      deps: ['jquery']
    }
  }
});



require(['jquery', 'jqueryui', 'app', 'cordova', 'kendo', 'fileHandler', 'loginView', 'homeView', 'trialManager', 'trialExpired', 'aboutView', 'dbInitView', 'downloadProjectsView', 'installationGroupsView', 'activityView', 'mediaHandler'],
  function(jquery, jqueryui, app, cordova, kendo, fileHandler, loginView, homeView, trialManager, trialExpired, aboutView, dbInitView, downloadProjectsView, installationGroupsView, activityView, mediaHandler) {
    window.APP = app;
    if (kendo.mobileOs) {
      document.addEventListener('deviceready', function() {
        window.APP.init();
        setTimeout(function() {
          navigator.splashscreen.hide();
        }, 4000);
      }, false);
    } else {
      window.APP.init();
      setTimeout(function() {
        navigator.splashscreen.hide();
      }, 4000);
    }
  });
