'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'fileHandler', 'localizer', 'WSHandler', 'DALProjects', 'DALBuildings'],
  function($, cordova, kendo, app, fileHandler, localizer, WSHandler, DALProjects, DALBuildings) {

    var projectView = kendo.observable({
      onShow: function(e) {
        //$('.homeView').html('');
        var chkLogin = app.isUserAuthenticated(); //call for valid user check method in app page
        if (chkLogin == false) { //check for valid user session
          app.mobileApp.navigate('app/loginView/view.html'); //Not login then goto login page
        }
      },
      afterShow: function(e) {
        projectView.init();
        projectView.projectID = e.view.params.ProjectID;
        projectView.showProjectData(e.view.params.ProjectID);
        projectView.showBuildingData(e.view.params.ProjectID);
        if (app.config.allAddingProjects == true) {
          setTimeout(function() {
            $('.displaynone').removeClass('displaynone');
            $('.hidebtn').removeClass('hidebtn');
          }, 500);
        }
      },
      beforeShow: function(e) {
        var $view = $('#' + e.view.content.context.id);
        if ($view.length > 0) {
          app.removeCachedViews($view);
        }
      }
    });

    projectView.set('title', localizer.translateText("projectView.projectCap"));
    app.projectView = projectView;

    projectView.init = function() {
      localizer.translate();
      var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
      navbar.title(localizer.translateText("projectView.projectCap"));
    };

    projectView.showProjectData = function(projectID) {
      DALProjects.getProject(projectID, projectView.bindProjectData)
    }

    projectView.showBuildingData = function(projectID) {
      DALBuildings.getBuildingsOfAProject(projectID, projectView.bindBuildingsData)
    }

    projectView.bindProjectData = function(tx, project) {
      if (project.rows.length > 0) {
        $("#lblProjectName").text(project.rows.item(0).ProjectName);
        var addressArray = [];

        if (project.rows.item(0).AddressLine1 != "" && project.rows.item(0).AddressLine1 != null)
          addressArray.push(project.rows.item(0).AddressLine1);

        if (project.rows.item(0).AddressLine2 != "" && project.rows.item(0).AddressLine2 != null)
          addressArray.push(project.rows.item(0).AddressLine2);

        if (project.rows.item(0).City != "" && project.rows.item(0).City != null)
          addressArray.push(project.rows.item(0).City);

        if (project.rows.item(0).State != "" && project.rows.item(0).State != null)
          addressArray.push(' State - ' + project.rows.item(0).State);

        if (project.rows.item(0).Country != "" && project.rows.item(0).Country != null)
          addressArray.push(' Country - ' + project.rows.item(0).Country);

        if (project.rows.item(0).PostalCode != "" && project.rows.item(0).PostalCode != null)
          addressArray.push(' Postal code - ' + project.rows.item(0).PostalCode);

        $("#lblProjectAddress").text(addressArray.join(','));
        $("#lblProjectPerComplete").text(project.rows.item(0).PercentComplete + '%');
        $("#txtProjNotes").val(project.rows.item(0).Notes);

        if (project.rows.item(0).Notes != null && project.rows.item(0).Notes != "")
          $("#projNotesSelected").data("kendoMobileButton").badge(1);
        else
          $("#projNotesSelected").find(".km-badge").hide();
      } else {
        $("#lblProjectName").text("");
        $("#lblProjectAddress").text("");
        $("#lblProjectPerComplete").text("");
        $("#txtProjNotes").val("");
      }

    };

    projectView.bindBuildingsData = function(tx, buildings) {
      try {
        var projectData = [];

        for (var i = 0; i < buildings.rows.length; i++) {
          projectData.push(buildings.rows.item(i));
        }

        var dataSource = new kendo.data.DataSource({
          data: projectData,
          type: "json"
        });

        $("#buildingsList").kendoMobileListView({
          dataSource: dataSource,
          template: $("#tmplBuilding").text(),
          dataBound: projectView.dataBoundHandler,
          click: function(e) {
            console.log(e);
            if (e.button != undefined) {
              if (e.button.options.icon == "details") {
                projectView.navigateToBuildingView(e);
              } else if (e.button.options.icon == "camera" || e.button.options.icon == "videocamera") {
                projectView.naivgateToImageGallery(e);
              } else if (e.button.options.icon == "edit") {
                projectView.navigateToBuildingAddEdit(e);
              }
            } else {
              projectView.navigateToBuildingView(e)
            }
          }
        });
      } catch (ex) {
        alert(ex.message);
      }

    };

    /*projectView.navigateToBuildingView = function (e) {
        var data = e.button.data();
        app.mobileApp.navigate("app/buildingView/view.html?BuildingID=" + data.bulidingid + "&ProjectID=" + data.projectid + "&ProjectName=" + $("#lblProjectName").text());
    }*/
    projectView.navigateToBuildingView = function(e) {
      //app.mobileApp.navigate("app/buildingView/view.html?BuildingID=" + e.dataItem.BuildingID + "&ProjectID=" + e.dataItem.ProjectID + "&ProjectName=" + $("#lblProjectName").text());
    }

    /*projectView.naivgateToImageGallery = function (e) {
        var data = e.button.data();
        var mediaType = 'i';
        if (data.icon == 'videocamera')
            mediaType = 'v';
        app.mobileApp.navigate("app/mediaGalleryView/view.html?RowGUID=" + data.rowguid + "&BuildingName=" + data.buildingname + "&ProjectName=" + $("#lblProjectName").text() + "&mediaType=" + mediaType);
    };*/
    //Above function copied here for adding changes related to entire row clickable.
    projectView.naivgateToImageGallery = function(e) {
      var mediaType = 'i';
      if (e.button.options.icon == 'videocamera')
        mediaType = 'v';
      app.mobileApp.navigate("app/mediaGalleryView/view.html?RowGUID=" + e.dataItem.RowGUID + "&BuildingName=" + e.dataItem.BuildingName + "&ProjectName=" + $("#lblProjectName").text() + "&mediaType=" + mediaType);
    };

    projectView.navigateToBuildingAddEdit = function(e) {
      //var data = e.button.data();original code
      var data = e.dataItem;
      var proViewID = data.ProjectID;
      var buildingID = data.BuildingID;
      //app.mobileApp.navigate("app/addEditBuildingView/view.html?BuildingID=" + data.bulidingid + "&ProjectID=" + data.projectid + "&ProjectName=" + $("#lblProjectName").text());
      //app.mobileApp.navigate("app/addEditBuildingView/view.html?BuildingID=" + buildingID + "&ProjectID=" + proViewID + "&ProjectName=" + $("#lblProjectName").text());
    };

    projectView.navigateToAddBuilding = function(e) {
      var data = e.button.data();
      //app.mobileApp.navigate("app/addEditBuildingView/view.html?ProjectID=" + projectView.projectID + "&ProjectName=" + $("#lblProjectName").text());
    }

    projectView.dataBoundHandler = function() {
      $("[imggallery]").each(function(index) {
        var uid = $(this).attr("data-rowguid");
        var element = this;
        fileHandler.getMediaFilesCount(uid, 1, function(count) {
          if (count > 0)
            $(element).data("kendoMobileButton").badge(count);
        });
      });
      $("[vidgallery]").each(function(index) {
        var uid = $(this).attr("data-rowguid");
        var element = this;
        fileHandler.getMediaFilesCount(uid, 2, function(count) {
          if (count > 0)
            $(element).data("kendoMobileButton").badge(count);
        });
      });

    };

    projectView.closeParentPopover = function(e) {
      DALProjects.saveNotes(projectView.projectID, $("#txtProjNotes").val(), projectView.closeNotes(e));
    };

    projectView.closeNotes = function(e) {
      if ($("#txtProjNotes").val() != "")
        $("#projNotesSelected").data("kendoMobileButton").badge(1);
      else
        $("#projNotesSelected").find(".km-badge").hide();

      var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');

      popover.close();
    };

    projectView.onNotesClose = function onClose(e) {
      DALProjects.saveNotes(projectView.projectID, $("#txtProjNotes").val(), function(e) {
        if ($("#txtProjNotes").val() != "")
          $("#projNotesSelected").data("kendoMobileButton").badge(1);
        else
          $("#projNotesSelected").find(".km-badge").hide();
      });
    };

    return projectView;
  });
// START_CUSTOM_CODE_settingsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_settingsView
