'use strict';

define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALAuthTokens', 'homeView', 'authenticationManager', 'cookieManager', 'DALDataSyncStatus'],
  function($, cordova, kendo, app, localizer, WSHandler, DALAuthTokens, homeView, authenticationManager, cookieManager, DALDataSyncStatus) {

    var loginView = kendo.observable({
      beforeShow: function(e) {
        var $view = $('#' + e.view.content.context.id);
        if ($view.length > 0) {
          app.removeCachedViews($view);
        }
      },
      onShow: function() {},
      afterShow: function() {
        loginView.init();
        loginView.log("");
        window.localStorage.removeItem('userName');
      }
    });

    app.loginView = loginView;

    loginView.init = function() {
      localizer.translate();
      var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
      navbar.title(localizer.translateText("login.authentication"));
    }

    loginView.validateInput = function() {
      var validator = $("#loginForm").kendoValidator().data("kendoValidator"),
        status = $(".status");

      if (validator.validate()) {

        var msg = localizer.translateText("login.tryToAuthMsg");
        status.text(msg)
          .removeClass("invalid")
          .addClass("valid");
        return true;
      } else {
        var msg = localizer.translateText("login.invalidDataMsg");
        status.text(msg)
          .removeClass("valid")
          .addClass("invalid");
        return false;
      }
    };

    loginView.authenticateUser = function(userName, password) {
      authenticationManager.authenticateUser(userName, password, loginView.authenticationSucceeded, loginView.authenticationFailed);
    };

    loginView.checkUserToken = function(userName) {

    };

    loginView.signIn = function() {

      if (loginView.validateInput()) {
        loginView.authenticateUser(loginView.userName, loginView.password);
      }
    };

    loginView.set('signIn', loginView.signIn);



    // ---- WCF Service call backs -------------------

    loginView.authenticationFailed = function(result) {
      loginView.log("Login failed.");
    };

    loginView.authenticationSucceeded = function(result) {
      //result = JSON.parse(result);
      var expiresOn = new Date();
      expiresOn.addDays(2);
      if (result == true) {
        cookieManager.writeCookie('userName', $("#userName").val(), app.config.tokenLife);
        var useName = app.getLoggedInUserName();
        //$("#loggedInUser").text("Sign-out ("+useName+")");
        $("#loggedInUser").text(localizer.translateText("app.signout") + " (" + useName + ")");

        $("#loggedInUser").click(function() {
          loginView.signOut();
        });

        loginView.log(localizer.translateText("login.loginSuccessMsg")); //alert(r);
        loginView.navigateAway();
      } else {
        loginView.log(localizer.translateText("login.loginFailMsg"));
      }
      //alert("Success: "  + result);
    };

    loginView.navigateAway = function() {
      app.mobileApp.navigate("app/homeView/view.html");
    }
    // ---- Log ----------------------------------------
    // utility function to output messages

    loginView.log = function(msg) {
      if (msg == "")
        $(".status").text("");
      else
        $(".status").text(msg);
    };

    loginView.signOut = function() {
      cookieManager.deleteAllCookies();
      window.localStorage.removeItem('userName');
    };

    return loginView;

  });
// END_CUSTOM_CODE_contactsView
