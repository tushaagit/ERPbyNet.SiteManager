'use strict';

define(['jquery', 'cordova', 'app', 'localizer', 'DALMain', 'fileHandler'],
       function ($, cordova, app, localizer, DALMain, fileHandler) {
	var DALHelper = {};



    DALHelper.getAllProjects = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Projects WHERE isDeleted = 0', [], resultsCallback,  DALHelper.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

	DALHelper.onError = function(tr, err){
        alert(err.message);
    };

    DALHelper.getAllBuildings = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Buildings WHERE isDeleted = 0', [], resultsCallback,  DALHelper.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALHelper.getAllGroups = function(resultsCallback)
        {
          	var db = DALMain.db;
            var getAllData = "SELECT * FROM Groups WHERE IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(getAllData, [], resultsCallback, DALHelper.onError);
                });
        };

     DALHelper.getAllSets = function(resultsCallback)
        {
          	var db = DALMain.db;
            var getAllData = "SELECT * FROM Sets WHERE IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(getAllData, [], resultsCallback, DALHelper.onError);
                });
        };

    DALHelper.doesProjectsTableExists = function(resultsCallback)
    {
        var db = DALMain.db;

        var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='Projects'";

        db.transaction(function(tx){
            tx.executeSql(query, [], resultsCallback, DALHelper.onError);
        });
    };

    DALHelper.doesTrialTableExists =  function(resultsCallback)
    {
        var db = DALMain.db;
        var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='ConfigParams'";
        db.transaction(function(tx){
            tx.executeSql(query, [], resultsCallback, DALHelper.onError);
        });
    };


    DALHelper.getMediaToUpload = function(uid, rowguid, successHandler)
    {
      	//upload project media
        fileHandler.uploadMediaToServer(rowguid, rowguid, function(bldCount){ alert(localizer.translateText("DALHelper.uploadedImages") + " " + bldCount)});
        //upload building media
        DALHelper.getAndUploadBuildingsOfAProject(uid);
        //upload group media
        DALHelper.getAndUploadGroupsOfProject(uid);
        //upload set media
        DALHelper.getAndUploadSetsOfProject(uid);
        //upload spec media
        DALHelper.getAndUploadSpes(uid);
    };

    DALHelper.getAndUploadBuildingsOfAProject = function(projectID){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT Projects.rowGUID as projectGUID, Buildings.RowGuid as buildingGUID  FROM Buildings '
                                  +' INNER JOIN Projects ON Projects.ProjectID = Buildings.ProjectID  WHERE Buildings.ProjectID = ? AND Buildings.isDeleted = 0', [projectID], DALHelper.uploadBuildingMedia,  DALHelper.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALHelper.uploadBuildingMedia = function(tx, buildings)
    {
        for(var i = 0; i<buildings.rows.length; i++)
            {
                fileHandler.uploadMediaToServer(buildings.rows.item(i).buildingGUID, buildings.rows.item(i).projectGUID+'/'+buildings.rows.item(i).buildingGUID, function(bldCount){ alert(localizer.translateText("DALHelper.uploadedImages") + " " + bldCount)});
            }
    };

    DALHelper.getAndUploadGroupsOfProject = function(projectID)
        {
          	var db = DALMain.db;
            var sql = 'SELECT 	Projects.RowGUID as projectGuid, Buildings.RowGUID as buildingGuid, Groups.RowGUID as groupGuid '
            			+' FROM 	Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID '
                    	+' INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID '
                        +' WHERE 	Groups.ProjectID = ? AND Projects.IsDeleted = 0 AND Buildings.IsDeleted = 0 AND Groups.IsDeleted = 0'

            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [projectID], DALHelper.uploadGroupMedia, DALHelper.onError);
                });
        };

    DALHelper.uploadGroupMedia = function(tx, groups)
    {
        for(var i = 0; i<groups.rows.length; i++)
        {
        	fileHandler.uploadMediaToServer(groups.rows.item(i).groupGuid, groups.rows.item(i).projectGuid+'/'+groups.rows.item(i).buildingGuid +'/'+groups.rows.item(i).groupGuid, function(bldCount){ alert(localizer.translateText("DALHelper.uploadedImages") + " " + bldCount)});
        }
    };

    DALHelper.getAndUploadSetsOfProject = function(projectID)
        {
          	var db = DALMain.db;
            var sql = 'SELECT 	Projects.RowGUID as projectGuid, Buildings.RowGUID as buildingGuid, Groups.RowGUID as groupGuid, Sets.RowGUID as setGuid '
            			+' FROM 	Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID '
                    	+' INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID '
            			+' INNER JOIN Sets ON  Buildings.ProjectID = Sets.ProjectID AND Buildings.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID '
                        +' WHERE 	Sets.ProjectID = ? AND Projects.IsDeleted = 0 AND Buildings.IsDeleted = 0 AND Groups.IsDeleted = 0 AND Sets.IsDeleted = 0'

            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [projectID], DALHelper.uploadSetMedia, DALHelper.onError);
                });
        };

    DALHelper.uploadSetMedia = function(tx, sets)
    {
        for(var i = 0; i<sets.rows.length; i++)
        {
        	fileHandler.uploadMediaToServer(sets.rows.item(i).setGuid, sets.rows.item(i).projectGuid+'/'+sets.rows.item(i).buildingGuid +'/'+sets.rows.item(i).groupGuid +'/'+sets.rows.item(i).setGuid,
                                            	function(bldCount){ alert(localizer.translateText("DALHelper.uploadedImages") + " " + bldCount)});
        }
    };

    DALHelper.getAndUploadSpes = function(projectID)
        {
          	var db = DALMain.db;

           	var sql = "SELECT Projects.RowGUID as projectGuid, Buildings.RowGUID as buildingGuid, Groups.RowGUID as groupGuid, Sets.RowGUID as setGuid, Specs.RowGUID as specGuid, Specs.IndexValue as indexVal "
            		+" FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN Specs ON Sets.ProjectID = Specs.ProjectID AND Sets.BuildingID = Specs.BuildingID AND Sets.GroupID = Specs.GroupID"
            		+ " AND Sets.SetID = Specs.SetID"
          			+ " WHERE Sets.ProjectID = " + projectID + " AND Specs.IsImageAdded > 0 AND Sets.IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], DALHelper.uploadSpesMedia, DALHelper.onError);
                });
        };

    DALHelper.uploadSpesMedia = function(tx, specs)
    {
        for(var i = 0; i < specs.rows.length; i++)
        {
            //if(specs.rows.item(i).specGuid.indexOf('74a1') > -1)
                //alert(specs.rows.item(i).specGuid + '-' + specs.rows.item(i).indexVal);
            fileHandler.uploadMediaToServer(specs.rows.item(i).specGuid + '-' + specs.rows.item(i).indexVal,
                                        specs.rows.item(i).projectGuid+'/'+specs.rows.item(i).buildingGuid +'/'+specs.rows.item(i).groupGuid +'/'+specs.rows.item(i).setGuid+'/'+specs.rows.item(i).specGuid + '-' + specs.rows.item(i).indexVal,
                                            	function(bldCount){ alert(localizer.translateText("DALHelper.uploadedImages") + " " +bldCount)});
            if(i == specs.rows.length-1)
                alert(localizer.translateText("DALHelper.mediaUploadProgress"));
        }
    };

    DALHelper.onError = function(tx, error)
    {

    };



    return DALHelper;
});
