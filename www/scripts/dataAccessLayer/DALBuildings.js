'use strict';

define(['jquery', 'cordova', 'app', 'localizer', 'DALMain', 'DALProjects'],
       function ($, cordova, app, localizer, DALMain, DALProjects) {

	var DALBuildings = {};

    DALBuildings.dropTable = function(){
        var db = DALMain.db;
        var dropTable = "DROP TABLE IF EXISTS Buildings";
        db.transaction(function(tx) {
            tx.executeSql(dropTable, [], null, DALBuildings.onError);
        });
    };

    DALBuildings.createTable = function(callback){
        var db = DALMain.db;

        var tblDef = "CREATE TABLE IF NOT EXISTS Buildings("
         				+ "ProjectID INTEGER, "
         				+ "BuildingID INTEGER, "
         				+ "BuildingNo TEXT, "
         				+ "BuildingName TEXT, "
        				+ "NoOfSets INTEGER, "
						+ "NoOfUnits TEXT, "
        				+ "Status INTEGER DEFAULT 0, "
                        + "PercentComplete INTEGER DEFAULT 0, "
                        + "Notes TEXT, "
        				+ "AddedOn TEXTDATETIME, "
        				+ "UpdatedOn TEXTDATETIME,"
        				+ "RowGUID TEXT,"
                        + "IsActive INTEGER DEFAULT 1, "
                        + "IsDeleted INTEGER DEFAULT 0, "
        				+ "PRIMARY KEY(ProjectID, BuildingID)"
        				+ ");";

        db.transaction(function(tx) {
             tx.executeSql(tblDef, [], function(){
                 if(callback != null)
                     callback();
             }, DALBuildings.onError);
        });
    };

    DALBuildings.clearData = function(){
        var db = DALMain.db;
        var dropTable = "DELETE FROM Buildings";
         db.transaction(function(tx) {
            tx.executeSql(dropTable, []);
        });
    };

    DALBuildings.addBuilding = function(projectID, buildingID, buildingNo, buildingName,
                                                	status, percentComplete, notes, rowGUID, updatesuccesscallback) {
        var db = DALMain.db;
        var addedOn = new Date();
        if(rowGUID == null || rowGUID == ''){
            rowGUID = app.getGUID();
        }

        if(percentComplete == null || percentComplete == ''){
            percentComplete = 0;
        }

        try{
             db.transaction(function(tx) {
                tx.executeSql("INSERT INTO Buildings(ProjectID, BuildingID, BuildingNo, BuildingName, Status, PercentComplete, Notes, AddedOn, RowGUID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                              [projectID, buildingID, buildingNo, buildingName,
                                                        status, percentComplete, notes, addedOn, rowGUID],
                              updatesuccesscallback,
                              DALBuildings.onError);
            },
            function(tx, err){
                alert('err.message');
            });
        }
        catch(err){
            alert(err.message);
        }


    }

    DALBuildings.getAllBuildings = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Buildings WHERE isDeleted = 0', [], resultsCallback,  DALBuildings.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALBuildings.getBuilding = function(projectID, buildingID, resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM Buildings WHERE ProjectID = ? AND BuildingID = ? AND isDeleted = 0', [projectID, buildingID], resultsCallback,  DALBuildings.onError)
        });
    };

    DALBuildings.getBuildingsOfAProject = function(projectID, resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Buildings WHERE ProjectID = ? AND isDeleted = 0', [projectID], resultsCallback,  DALBuildings.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALBuildings.updateBuildingData = function(buildingName, notes, buildingID, projectID, updatesuccesscallback){
        var db = DALMain.db;
        var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE Buildings SET  BuildingName = ?, Notes = ?, updatedOn = ? WHERE BuildingID = ? and ProjectID =?",
                          [buildingName, notes, updatedOn, buildingID, projectID],
                          updatesuccesscallback,
                          DALProjects.onError);
        });
    };

    DALBuildings.updateStatus = function(projectID, buildingID, newStatusID, percentComplete){
        var db = DALMain.db;
        var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE Buildings SET  newStatusID = ?, percentComplete = round(?, 2), updatedOn = ? WHERE ProjectID = ? AND BuildingID = ?",
                          [newStatusID, percentComplete, updatedOn, projectID, buildingID],
                          DALBuildings.onSuccess,
                          DALBuildings.onError);
        });
    };

    DALBuildings.updateCompletion = function(projectID, buildingID, percentComplete){
        var db = DALMain.db;
       	var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE Buildings SET  percentComplete = round(?, 2), updatedOn = ? WHERE ProjectID = ? AND BuildingID = ?",
                          [percentComplete, updatedOn, projectID, buildingID],
                          function(tx){ DALProjects.calculateCompletionStatus(projectID); },
                          DALBuildings.onError);
        });
    };


   	DALBuildings.updateNoOfSetsAndUnits = function(projectID, buildingID){
        var noOfSets = 0;
        var noOfUnits = 0;
        require(['DALGroups'], function (DALGroups) {
            DALGroups.getGroupsOfABuilding(projectID, buildingID, function(tx, groups){
                for(var i=0; i < groups.rows.length; i++){
                    noOfSets = noOfSets + groups.rows.item(i).noOfSets
                    noOfUnits = noOfUnits + groups.rows.item(i).NoOfUnits;
                }
                var db = DALMain.db;
                var updatedOn = new Date();
                db.transaction(function(tx){
                    tx.executeSql("UPDATE Buildings SET NoOfSets = ?, NoOfUnits =?, UpdatedOn = ? WHERE  projectID = ? AND buildingID = ? ",
                              [noOfSets, noOfUnits, updatedOn, projectID, buildingID],
                              DALGroups.onSuccess,
                              DALGroups.onError);
                });
            });
    	});
    };

    DALBuildings.calculateCompletionStatus = function(projectID, buildingID)
    {
        var db = DALMain.db;
        db.transaction(function(tx){
            tx.executeSql("SELECT (SELECT round(SUM(IFNULL(PercentComplete,0)), 2) FROM Groups WHERE ProjectID = ? AND BuildingID = ? AND IsDeleted = 0) / "
                          			+"(SELECT COUNT(*) FROM Groups WHERE ProjectID = ? AND BuildingID = ?  AND IsDeleted = 0) as Percentage FROM Buildings WHERE  ProjectID = ? AND BuildingID = ?  AND IsDeleted = 0 ",
                          [projectID, buildingID, projectID, buildingID, projectID, buildingID],
                          function(tx, result)
                            {
                                if(result.rows.length > 0)
                                    {
                                       DALBuildings.updateCompletion(projectID, buildingID, result.rows.item(0).Percentage);
                                    }
                            },
                          DALBuildings.onError);
        });
    };

    DALBuildings.updateNoOfSetsAndNoOfUnits = function(projectID, buildingID)
        {
			var db = DALMain.db;
            db.transaction(function(tx)
          	{
				tx.executeSql("UPDATE Buildings "
                              	+ " SET NoOfSets = (SELECT SUM(NoOfSets) FROM Groups WHERE ProjectID = ? AND BuildingID = ? AND Status > 0 ), "
                              	+ " NoOfUnits = (SELECT SUM(NoOfUnits) FROM Groups WHERE ProjectID = ? AND BuildingID = ? AND Status > 0 ) "
                              	+ " WHERE ProjectID = ? AND BuildingID = ? AND Status > 0 ",
                            [projectID, buildingID, projectID, buildingID, projectID, buildingID],
                            DALBuildings.onSuccess,
                          	DALBuildings.onError
                         );
            });
        };

    DALBuildings.saveNotes = function(projectID, buildingID, notes, resultsCallback)
    {
        var db = DALMain.db;
        var updateQuery = "UPDATE Buildings SET Notes = ? WHERE ProjectID = ? AND BuildingID = ? AND Status > 0";
        db.transaction(function(tx){
            tx.executeSql(updateQuery, [notes, projectID, buildingID], resultsCallback, DALBuildings.onError);
        });
    };

    DALBuildings.getMaxBuildingNo = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Buildings WHERE isDeleted = 0 and BuildingID = (select max(BuildingID) from Buildings WHERE isDeleted = 0)', [], resultsCallback,  DALBuildings.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALBuildings.onSuccess = function(tx, results){
    };

    DALBuildings.onError = function(tr, err){
        alert(localizer.translateText("DALBuildings.buiding") + "  " + err.message);
    };

    return DALBuildings;
});
