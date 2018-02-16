'use strict';
define(['jquery', 'cordova', 'app', 'localizer', 'DALMain', 'DALBuildings'],
       function ($, cordova, app, localizer, DALMain, DALBuildings) {
    
    	var DALGroups = {};
    	
        DALGroups.dropTable = function(){
            var db = DALMain.db;
            var dropTable = "DROP TABLE IF EXISTS Groups";
            db.transaction(function(tx) { 
                tx.executeSql(dropTable, [], function(){},function(){alert('exc');}); 
            }); 
        };
    
    	DALGroups.createTable = function(callback)
        {
          	var db=DALMain.db;
            var tblDefinition = "CREATE TABLE IF NOT EXISTS Groups ("
            					+ "ProjectID INTEGER, "
                                + "BuildingID INTEGER, "
                                + "GroupID INTEGER, "
                                + "GroupNo INTEGER, "
                                + "GroupName TEXT, "
                                + "NoOfSets INTEGER, "
                                + "NoOfUnits INTEGER, "
             					+ "Status INTEGER DEFAULT 0, "
                                + "PercentComplete INTEGER DEFAULT 0, "
                        		+ "Notes TEXT, "
                                + "AddedOn TEXTDATETIME,"
                                + "UpdatedOn TEXTDATETIME, "
                                + "RowGUID TEXT, "
                        		+ "IsActive INTEGER DEFAULT 1, "            
                        		+ "IsDeleted INTEGER  DEFAULT 0, "
            					+ "PRIMARY KEY(ProjectID, BuildingID, GroupID) "	
            					+ " );";
            db.transaction(function(tx){
                tx.executeSql(tblDefinition,[], function(){
                    if(callback != null)
                        callback();
                }, 
                DALGroups.onError);
            });
        };
    	
    	DALGroups.clearData=function()
        {
          	var db=DALMain.db;
            var dropTable = "DELETE FROM  Groups";
            db.transaction(function (tx){
                tx.executeSql(dropTable,[]);
            });
        };
    
    	DALGroups.addGroup = function(projectID, buildingID, groupID,
                                        groupNo, groupName, status, percentComplete, notes, rowGUID, updatesuccesscallback) {
			var  db= DALMain.db;
            var addedOn = new Date();
            if(rowGUID == null || rowGUID == ''){
                rowGUID = app.getGUID();
            }
            
            if(percentComplete == null || percentComplete == ''){
                percentComplete = 0;
            }

            try {
					db.transaction(function(tx) {
					tx.executeSql("INSERT INTO Groups (ProjectID, BuildingID, GroupID, GroupNo, "
                                 	+" GroupName, Status, PercentComplete, Notes, AddedOn, UpdatedOn, RowGUID) "
                                 	+" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                 	[projectID, buildingID, groupID, groupNo, 
                                     groupName, status, percentComplete, notes, addedOn, addedOn, rowGUID],
                                    updatesuccesscallback, 
                                    DALGroups.onError
                                );
                                        
                	},
                    function(tx, err){
                        alert('err.message');
                    });                      
                }
            catch(err)
                {
                    alert(err.message);
                }
                    
        }

    
    	DALGroups.getAllGroups = function(resultsCallback)
        {
          	var db = DALMain.db;
            var getAllData = "SELECT * FROM Groups WHERE IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(getAllData, [], resultsCallback, DALGroups.onError);   
                });
        };
    
    	DALGroups.getAllActiveGroups = function(resultsCallback)
        {
          	var db = DALMain.db;
            var getAllData = "SELECT * FROM Groups WHERE IsActive > 0 AND IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(getAllData, [], resultsCallback, DALGroups.onError);   
                });
        };
       
    	DALGroups.getGroup = function(projectID, buildingID, groupID, resultsCallback)
        {
          	var db = DALMain.db;
            var sql = "SELECT Projects.ProjectName, Buildings.BuildingName, Groups.* FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID WHERE Groups.ProjectID = ? AND Groups.BuildingID = ? AND GroupID = ? AND Groups.IsDeleted = 0";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(sql, [projectID, buildingID, groupID], resultsCallback, DALGroups.onError);   
                });
        };
    	
    	DALGroups.getGroupsOfAProject = function(projectID, resultsCallback)
        {
          	var db = DALMain.db;
            db.transaction(
                function(tx)
                {
                 	tx.executeSql("SELECT * FROM Groups WHERE ProjectID = ? AND IsDeleted = 0 ", [projectID], resultsCallback, DALGroups.onError);   
                });
        };
    
    	DALGroups.getGroupsOfABuilding = function(projectID, buildingID, resultsCallback)
        {
          	var db = DALMain.db;
            var sql = "SELECT Projects.ProjectName, Buildings.BuildingName, Groups.* FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID WHERE Groups.ProjectID = ? AND Groups.BuildingID = ? AND Groups.IsDeleted = 0";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [projectID, buildingID], resultsCallback, DALGroups.onError);   
                });
        };
       	
    	DALGroups.getGroupsOfBuildings = function(projectID, buildingsList, resultsCallback)
        {
          	var db = DALMain.db;
            var sql = "SELECT Projects.ProjectName, Buildings.BuildingName, Groups.* FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID WHERE Groups.ProjectID = " + projectID + " AND Groups.BuildingID IN (" + buildingsList + ")  ";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALGroups.onError);   
                 });
        };
    
    	DALGroups.updateActiveStatus = function(projectID, buildingID, groupID, status )
        {
            var db = DALMain.db;
            var updatedOn = new Date();
            db.transaction(function(tx){
                tx.executeSql("UPDATE Groups SET Status = ?, UpdatedOn =?  WHERE  projectID = ? AND buildingID = ? AND groupID = ?",
                              [status, updatedOn, projectID, buildingID, groupID],
                              DALGroups.onSuccess, 
                              DALGroups.onError);
            });
        };
    	
    	DALGroups.updateCompletionStatus= function(projectID, buildingID, groupID, percentageComplete )
        {
            var db = DALMain.db;
            var updatedOn = new Date();
            db.transaction(function(tx){
                tx.executeSql("UPDATE Groups SET PercentComplete = round(?, 2), UpdatedOn =? WHERE  projectID = ? AND buildingID = ? AND groupID = ?",
                              [percentageComplete, updatedOn, projectID, buildingID, groupID],
                              function(tx){ DALBuildings.calculateCompletionStatus(projectID, buildingID); }, 
                              DALGroups.onError);
            });
        };
       	
        DALGroups.updateNoOfSetsAndUnits = function(projectID, buildingID, groupID){
            var noOfSets = 0;
            var noOfUnits = 0;
            require(['DALSets'], function (DALSets) {
                DALSets.getSetsOfAGroup(projectID, buildingID, groupID, function(tx, sets){
                    noOfSets = sets.rows.length;
                    for(var i=0; i < sets.rows.length; i++){
                        noOfUnits = noOfUnits + sets.rows.item(i).NoOfUnits;
                    }
                    var db = DALMain.db;
                    var updatedOn = new Date();
                    db.transaction(function(tx){
                        tx.executeSql("UPDATE Groups SET NoOfSets = ?, NoOfUnits = ?, UpdatedOn = ? WHERE  projectID = ? AND buildingID = ? AND groupID = ?",
                                    [noOfSets, noOfUnits, updatedOn, projectID, buildingID, groupID],
                                    function(){
                            			alert(groupID);
                                        DALBuildings.updateNoOfSetsAndUnits(projectID, buildingID);                                                                                                      
                                    }, 
                                 	DALGroups.onError);
                    });
                });
        	});    
        };
    
    	DALGroups.calculateCompletionStatus = function(projectID, buildingID, groupID)
        {
            var db = DALMain.db;
            db.transaction(function(tx)
           	{
                tx.executeSql("SELECT (SELECT SUM(IFNULL(PercentComplete,0)) FROM Sets WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? AND isDeleted = 0) / "
                              			+" (SELECT COUNT(PercentComplete) FROM Sets WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? AND isDeleted = 0)  as Percentage FROM Groups WHERE  ProjectID = ? AND BuildingID = ? AND GroupID = ? ",
                [projectID, buildingID, groupID, projectID, buildingID, groupID, projectID, buildingID, groupID],
                function(tx, result)
                {
                    if(result.rows.length > 0)
                        {
                            DALGroups.updateCompletionStatus(projectID, buildingID, groupID, result.rows.item(0).Percentage);
                        }
                }, 
                DALGroups.onError);
            });
        };
    
    	DALGroups.updateNoOfSetsAndNoOfUnits = function(projectID, buildingID, groupID)
        {
			var db = DALMain.db;
            db.transaction(function(tx)
          	{
				tx.executeSql("UPDATE Groups "
                              	+ " SET NoOfSets = (SELECT COUNT(*) FROM Sets WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ?  ), " 
                              	+ " NoOfUnits = (SELECT SUM(NoOfUnits) FROM Sets WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? ) " 
                              	+ " WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ?  ",
                            [projectID, buildingID, groupID, projectID, buildingID, groupID, projectID, buildingID, groupID],
                            DALGroups.onSuccess,
                          	DALGroups.onError
                         );
            });
        };

        
    DALGroups.updateGroupData = function(GroupName, Notes, GroupID, ProjectID, BuildingID, updatesuccesscallback){
        var db = DALMain.db;
        var updatedOn = new Date();         
        db.transaction(function(tx) { 
            tx.executeSql("UPDATE Groups SET  GroupName = ?, Notes = ?, updatedOn = ? WHERE GroupID = ? and ProjectID = ? and BuildingID = ?", 
                          [GroupName, Notes, updatedOn, GroupID, ProjectID, BuildingID], updatesuccesscallback, DALGroups.onError); 
        });         
    };
        
    	DALGroups.saveNotes = function(projectID, buildingID, groupID, notes, resultsCallback)
        {
            var db = DALMain.db;
            var updateQuery = "UPDATE Groups SET Notes = ? WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? AND Status > 0";
            db.transaction(function(tx){
                tx.executeSql(updateQuery, [notes, projectID, buildingID, groupID], resultsCallback, DALGroups.onError);
            });
        };
    
        DALGroups.getMaxGroupID = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) { 
                    tx.executeSql('SELECT * FROM Groups WHERE isDeleted = 0 and GroupID = (select max(GroupID) from Groups WHERE isDeleted = 0)', [], resultsCallback,  DALGroups.onError)  
            });
        }
        catch(err){
            alert(err.message);
        }
    };

        DALGroups.onSuccess = function(tx, results){
        };

        DALGroups.onSuccessGroupUpdate = function(tx, results){
            app.mobileApp.hideLoading();
            alert(localizer.translateText("DALGroups.dataSaved"));
            app.mobileApp.navigate("app/buildingView/view.html");
        };

        DALGroups.onError = function(tr, err){
            alert(err.message);
        };
    
    	return DALGroups;
    	
});