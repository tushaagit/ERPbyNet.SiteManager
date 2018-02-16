'use strict';
define(['jquery', 'cordova', 'app', 'DALMain', 'DALGroups', 'DALBuildings', 'DALProjects'],
       function ($, cordova, app, DALMain, DALGroups, DALBuildings, DALProjects) {
    
    	var DALSets = {};
    	
        DALSets.dropTable = function(){
            var db = DALMain.db;
            var dropTable = "DROP TABLE IF EXISTS Sets";
            db.transaction(function(tx) { 
                tx.executeSql(dropTable, []); 
            }); 
        };
    
    	DALSets.createTable = function(callback)
        {
          	var db=DALMain.db;
            var tblDefinition = "CREATE TABLE IF NOT EXISTS Sets ("
            					+ "ProjectID INTEGER, "
                                + "BuildingID INTEGER, "
                                + "GroupID INTEGER, "
                                + "SetID INTEGER, "
            					+ "SetNo INTEGER, "
                                + "SetName TEXT, "
                                + "OldProductTypeID INTEGER, "
                                + "NewProductTypeID INTEGER, "
                                + "NoOfUnits INTEGER, "
                                + "Attribute1 TEXT, "
                                + "Attribute2 TEXT, "
                                + "Attribute3 TEXT, "
                                + "Attribute4 TEXT, "
                                + "Attribute5 TEXT, "
                                + "Attribute6 TEXT, "
                                + "Attribute7 TEXT, "
                                + "Attribute8 TEXT, "
                                + "Attribute9 TEXT, "
                                + "Attribute10 TEXT, "
             					+ "Status INTEGER DEFAULT 0, "
            					+ "SurveyVersionNo TEXT, "
                                + "PercentComplete INTEGER DEFAULT 0, "
                        		+ "Notes TEXT, "
                                + "AddedOn TEXTDATETIME,"
                                + "UpdatedOn TEXTDATETIME, "
                                + "RowGUID TEXT, "
                        		+ "IsActive INTEGER DEFAULT 1, "            
                        		+ "IsDeleted INTEGER DEFAULT 0, "
            					+ "PRIMARY KEY(ProjectID, BuildingID, GroupID, SetID) "	
            					+ " );";
            db.transaction(function(tx){
                tx.executeSql(tblDefinition, [], function(){
                    if(callback != null)
                        callback();
                }, 
                DALSets.onError);
            });
        };
    	
    	DALSets.clearData=function()
        {
          	var db=DALMain.db;
            var dropTable = "DELETE FROM  Sets";
            db.transaction(function (tx){
                tx.executeSql(dropTable,[]);
            });
        };
    
    	DALSets.addSet = function(projectID, buildingID, groupID, setID,
                                        setNo, setName, oldProductTypeID, newProductTypeID, noOfUnits,                                   		
                                        status, percentComplete, notes, rowGUID, surveyVersionNo, updateSuccess) {
			var  db= DALMain.db;
            //console.log('surveyVersionNo ' + surveyVersionNo);
            var addedOn = new Date();
            if(rowGUID == null || rowGUID == ''){
                rowGUID = app.getGUID();
            }         
            if(percentComplete == null || percentComplete == ''){
                percentComplete = 0;
            }  
            try {
					db.transaction(function(tx) {
						tx.executeSql("INSERT INTO Sets (projectID, buildingID, groupID, setID, "
                                  	+ "setNo, setName, oldProductTypeID, newProductTypeID, noOfUnits, "                                 	
                                  	+ "status, percentComplete, notes, RowGUID, SurveyVersionNo) "
                                 	+ " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                 	[projectID, buildingID, groupID, setID, 
                                     setNo, setName, oldProductTypeID, newProductTypeID, noOfUnits, 
                                     status, percentComplete, notes, rowGUID, surveyVersionNo],
                                    updateSuccess, 
                                    function(tx, err){
                            			alert(err.message);
                        			}
                                );
                        
                        var sql = "UPDATE Groups SET NoOfSets = (SELECT COUNT(*) "
                        											+ " FROM Sets WHERE Sets.ProjectID = Groups.ProjectID AND Sets.BuildingID = Groups.BuildingID AND Sets.GroupID = Groups.GroupID) "
                        							+ ", NoOfUnits = (SELECT SUM(NoOfUnits) "
                        											+ " FROM Sets WHERE Sets.ProjectID = Groups.ProjectID AND Sets.BuildingID = Groups.BuildingID AND Sets.GroupID = Groups.GroupID) "
                        			+ " WHERE Groups.ProjectID = ? AND Groups.BuildingID = ? AND Groups.GroupID = ? ";
                        
                        tx.executeSql(sql, [projectID, buildingID, groupID], null,  function(tx, err){
                            			alert(err.message);
                        			}
                    	);
                        
                        var sql = "UPDATE Buildings SET NoOfSets = (SELECT COUNT(*) "
                        											+ " FROM Sets WHERE Sets.ProjectID = Buildings.ProjectID AND Sets.BuildingID = Buildings.BuildingID) "
                        							+ ", NoOfUnits = (SELECT SUM(NoOfUnits) "
                        											+ " FROM Sets WHERE Sets.ProjectID = Buildings.ProjectID AND Sets.BuildingID = Buildings.BuildingID) "
                        			+ " WHERE Buildings.ProjectID = ? AND Buildings.BuildingID = ? ";
                        
                        tx.executeSql(sql, [projectID, buildingID], null,  function(tx, err){
                            			alert(err.message);
                        			}
                    	);               	},
                    function(tx, err){
                        alert(err.message);
                    });                      
                }
            catch(err)
                {
                    alert(err.message);
                }
                    
        };
        
        DALSets.getAllSets = function(resultsCallback)
        {
          	var db = DALMain.db;
            var getAllData = "SELECT * FROM Sets WHERE IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(getAllData, [], resultsCallback, DALSets.onError);   
                });
        };
    
    	DALSets.getAllActiveSets = function(resultsCallback)
        {
          	var db = DALMain.db;
            var getAllData = "SELECT * FROM Sets WHERE IsActive > 0 AND IsDeleted = 0 ";
            db.transaction(
                function(tx)
                {
                 	tx.executeSql(getAllData, [], resultsCallback, DALSets.onError);   
                });
        };
    
    
    	DALSets.getSetsOfAGroup = function(projectID, buildingID, groupID, resultsCallback)
        {
          	var db = DALMain.db;
           	var sql = "SELECT Projects.ProjectName, Projects.SurveyTypeID, Buildings.BuildingName, Groups.GroupName, Sets.*, OldProductTypes.ProductName AS OldProductType FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
            		+ "  LEFT JOIN OldProductTypes ON Sets.OldProductTypeID = OldProductTypes.ProductID "
            		+ " WHERE Groups.ProjectID = ? AND Groups.BuildingID = ? AND Groups.GroupID = ? AND Groups.IsDeleted = 0";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [projectID, buildingID, groupID], resultsCallback, DALSets.onError);   
                });
        
        };

        DALSets.getSetsOfAProject = function(projectID, resultsCallback)
        {
          	var db = DALMain.db;
           	var sql = "SELECT Projects.ProjectName, Projects.SurveyTypeID, Buildings.BuildingName, Groups.GroupName, Sets.*, OldProductTypes.ProductName AS OldProductType FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
            		+ "  LEFT JOIN OldProductTypes ON Sets.OldProductTypeID = OldProductTypes.ProductID "
            		+ " WHERE Groups.ProjectID = ? AND Groups.IsDeleted = 0";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [projectID], resultsCallback, DALSets.onError);   
                });
        
        };
        
    	DALSets.getSetsOfGroups = function(projectID, groupsList, resultsCallback)
        {            
            // alert(groupsList);
          	var db = DALMain.db;
            var filter = "";
            if(groupsList!=""){ 
            filter = " AND (" + DALSets.parseBuildingGroupSetIDsForQueryFilter(groupsList) + ") ";
            }            
           	var sql = "SELECT Projects.ProjectName,  Projects.SurveyTypeID, Buildings.BuildingName, Groups.GroupName, Sets.*, OldProductTypes.ProductName AS OldProductType FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN OldProductTypes ON Sets.OldProductTypeID = OldProductTypes.ProductID "
          			+ " WHERE Sets.ProjectID = " + projectID + " " + filter + " AND Sets.IsDeleted = 0 ";
                      
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };
    
    	DALSets.getDatatoUpload = function(projectID, resultsCallback)
        {
          	var db = DALMain.db;
         
           	var sql = "SELECT Projects.ProjectID, Buildings.BuildingID, Groups.GroupID, Sets.SetID, Specs.AttributeName, Specs.IndexValue, "
            		+ " Projects.Notes AS ProjectNotes, Projects.PercentComplete AS ProjectCompletion, Buildings.Notes AS BuildingNotes, "
            		+ " Buildings.PercentComplete AS BuildingCompletion, Groups.Notes AS GroupNotes, Groups.PercentComplete AS GroupCompletion, "
            		+ " Sets.SetName, Sets.OldProductTypeID, Sets.NewProductTypeID, Sets.NoOfUnits, Sets.Notes AS SetNotes, Sets.PercentComplete AS SetCompletion, "
            		+ " Specs.AttributeValue, Specs.IsMandatory, Specs.CategoryName, Specs.GroupName, Specs.Notes, Specs.AddedOn, Specs.UpdatedOn, Specs.RowGUID, "
            		+ " Specs.IsMandatory, Specs.ProductVersionNo, Specs.SurveyVersionNo ,Specs.IsActive, Specs.IsDeleted, "
                    + " Projects.RowGUID AS ProjectRowGUID, Buildings.RowGUID AS BuildingRowGUID, Groups.RowGUID AS GroupRowGUID, Sets.RowGUID AS SetRowGUID, Attributes.IsPhotoRequired AS IsPhotoRequired, Attributes.Prompt as Prompt, Specs.IsHidden "
            		+ " FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN Specs ON Sets.ProjectID = Specs.ProjectID AND Sets.BuildingID = Specs.BuildingID AND Sets.GroupID = Specs.GroupID "
            		+ " AND Sets.SetID = Specs.SetID INNER JOIN Attributes ON Sets.OldProductTypeID = Attributes.ProductID AND Specs.AttributeName = Attributes.AttributeName "
                    + " INNER JOIN KbAttributeCategories ON Attributes.ProductID = KbAttributeCategories.ProductID AND Attributes.Category = KbAttributeCategories.AttributeCategoryName "                  
          			+ " WHERE Sets.ProjectID = " + projectID + " AND Sets.IsDeleted = 0 order by KbAttributeCategories.SequenceNo, Specs.GroupName ";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };

        DALSets.getDatatoUploadBySet = function(projectID, setID, resultsCallback)
        {
          	var db = DALMain.db;
         
           	var sql = "SELECT Projects.ProjectID, Buildings.BuildingID, Groups.GroupID, Sets.SetID, Specs.AttributeName, Specs.IndexValue, "
            		+ " Projects.Notes AS ProjectNotes, Projects.PercentComplete AS ProjectCompletion, Buildings.Notes AS BuildingNotes, "
            		+ " Buildings.PercentComplete AS BuildingCompletion, Groups.Notes AS GroupNotes, Groups.PercentComplete AS GroupCompletion, "
            		+ " Sets.SetName, Sets.OldProductTypeID, Sets.NewProductTypeID, Sets.NoOfUnits, Sets.Notes AS SetNotes, Sets.PercentComplete AS SetCompletion, "
            		+ " Specs.AttributeValue, Specs.IsMandatory, Specs.CategoryName, Specs.GroupName, Specs.Notes, Specs.AddedOn, Specs.UpdatedOn, Specs.RowGUID, "
            		+ " Specs.IsMandatory, Specs.ProductVersionNo, Specs.SurveyVersionNo ,Specs.IsActive, Specs.IsDeleted, "
                    + " Projects.RowGUID AS ProjectRowGUID, Buildings.RowGUID AS BuildingRowGUID, Groups.RowGUID AS GroupRowGUID, Sets.RowGUID AS SetRowGUID, Attributes.IsPhotoRequired AS IsPhotoRequired, Attributes.Prompt as Prompt, Specs.IsHidden "
            		+ " FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN Specs ON Sets.ProjectID = Specs.ProjectID AND Sets.BuildingID = Specs.BuildingID AND Sets.GroupID = Specs.GroupID "
            		+ " AND Sets.SetID = Specs.SetID INNER JOIN Attributes ON Sets.OldProductTypeID = Attributes.ProductID AND Specs.AttributeName = Attributes.AttributeName "
                    + " INNER JOIN KbAttributeCategories ON Attributes.ProductID = KbAttributeCategories.ProductID AND Attributes.Category = KbAttributeCategories.AttributeCategoryName "                  
          			+ " WHERE Sets.ProjectID = " + projectID + " AND Sets.SetID = " + setID + " AND Sets.IsDeleted = 0 AND Attributes.IsDeleted = 0 order by KbAttributeCategories.SequenceNo, Specs.GroupName ";
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };
        
    	DALSets.parseBuildingGroupSetIDsForQueryFilter = function(buildingGroupSetIDsSelected){
            var buidlingGroupsSetIDsList = buildingGroupSetIDsSelected.split(",");
            var filter = "";
            for(var i = 0; i < buidlingGroupsSetIDsList.length; i++){
                if(i > 0){
                    filter += " OR ";
                }
                var IDs = buidlingGroupsSetIDsList[i].split("-");                
                filter += " (Sets.BuildingID  = " + IDs[0] + " AND Sets.GroupID  = " + IDs[1] + ")";               
            }
            return filter;
    	};
    
    	DALSets.updateActiveStatus = function(projectID, buildingID, groupID, setID, status )
        {
            var db = DALMain.db;
            var updatedOn = new Date();
            db.transaction(function(tx){
                tx.executeSql("UPDATE Groups SET Status = ?, UpdatedOn =?  WHERE  projectID = ? AND buildingID = ? AND groupID = ? AND setID = ? ",
                              [status, updatedOn, projectID, buildingID, groupID, setID],
                              DALSets.onSuccess, 
                              DALSets.onError);
            });
        };
    	
    	/*DALSets.updateCompletionStatus= function(projectID, buildingID, groupID, setID, percentageComplete )
        {
            var db = DALMain.db;
            var updatedOn = new Date();
            db.transaction(function(tx){
                tx.executeSql("UPDATE Groups SET PercentComplete = ?, UpdatedOn =? WHERE  projectID = ? AND buildingID = ? AND groupID = ? AND setID = ? ",
                              [percentageComplete, updatedOn, projectID, buildingID, groupID, setID],
                              DALSets.onSuccess, 
                              DALSets.onError);
            });
        };*/
       	
    	DALSets.calculateAndUpdateCompletionStatus= function(projectID, buildingID, groupID, setID)
        {
            //console.log('projectID, buildingID, groupID, setID ' + projectID + "," + buildingID+ "," + groupID+ "," + setID );
            var db = DALMain.db;
            var updatedOn = new Date();
            var subQueryNumerator = " (SELECT COUNT(*) FROM Specs WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID + " AND IsMandatory = 'true' AND AttributeValue != '' AND AttributeValue IS NOT NULL) "
            var subQueryDenominator = " (SELECT COUNT(*) FROM Specs WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID + " AND IsMandatory ='true') "
            /*db.transaction(function(tx){
                tx.executeSql(" SELECT COUNT(*) as Count1 FROM Specs WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID + " AND IsMandatory = 'true' AND AttributeValue != '' AND AttributeValue IS NOT NULL ",
                              [],
                              function(tx, results){
                                  console.log('Mandatory answered: ')
                                  console.log(results.rows.item(0).Count1);

                              });
            });*/
            var sql = "UPDATE Sets SET PercentComplete = ifnull(round(" + subQueryNumerator + " * 100.0 / " + subQueryDenominator + ", 2), 100) ";
            sql += " WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID 
            db.transaction(function(tx){
                tx.executeSql(sql,
                              [],
                              function(tx, results){
                 					var groupsSqlSubquery = " (SELECT avg(PercentComplete) FROM Sets WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + ") "
            						var groupSql = "UPDATE Groups SET PercentComplete = round(" + groupsSqlSubquery + ", 2)"
            						groupSql += " WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID;
                    				 tx.executeSql(groupSql,
                                                   [],
                                                   function(tx, results){
                                                        var buldingsSqlSubquery = " (SELECT avg(PercentComplete) FROM Groups WHERE projectID = " + projectID + " AND buildingID = " + buildingID + ") "
                                                        var buildingsSql = "UPDATE Buildings SET PercentComplete = round(" + buldingsSqlSubquery + ", 2)"
                                                        buildingsSql += " WHERE projectID = " + projectID + " AND buildingID = " + buildingID;
                                                        tx.executeSql(buildingsSql,
                                                                       [],
                                                                       function(tx, results){
                                                                            var projectSqlSubquery = " (SELECT avg(PercentComplete) FROM Buildings WHERE projectID = " + projectID + ") "
                                                                            var projectSql = "UPDATE Projects SET PercentComplete = round(" + projectSqlSubquery + ", 2)"
                                                                            projectSql += " WHERE projectID = " + projectID ;
                                                                            tx.executeSql(projectSql,
                                                                                           [],
                                                                                           DALSets.onSuccess,
                                                                                           DALSets.onError);
                                                                        },
                                                                       	DALSets.onError);
                                                    },
                                                   DALSets.onError);
                				}, 
                              DALSets.onError);
               
            });
        };
    
    	DALSets.getSet = function(projectID, buildingID, groupID, setID, resultsCallback)
        {           
           	var db = DALMain.db;
			var sql = "SELECT Projects.ProjectName, Buildings.BuildingName, Groups.GroupName, Sets.* , OldProductTypes.ProductName as OldProductType FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN OldProductTypes ON Sets.OldProductTypeID = OldProductTypes.ProductID "
            		+ " WHERE Sets.ProjectID = " + projectID + " AND Sets.BuildingID = " + buildingID + " AND Sets.GroupID = " + groupID + " AND Sets.SetID = " + setID + " AND Sets.IsDeleted = 0 ";            
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };
    
    	DALSets.updateSets = function(projectID, buildingID, groupID, setID, setName, oldProductTypeID, newProductTypeID, noOfUnits, 
                                       attr1, attr2, attr3, attr4, attr5, attr6, attr7, attr8, attr9, attr10, notes, resultsCallback)
        {
            var db = DALMain.db;
            var sql = "UPDATE Sets SET "
            					+ " SetName = ?, "
                                + " OldProductTypeID = ?, "
                                + " NewProductTypeID = ?, "
                                + " Attribute1 = ?, "
                                + " Attribute2 = ?, "
                                + " Attribute3 = ?, "
                                + " Attribute4 = ?, "
                                + " Attribute5 = ?, "
                                + " Attribute6 = ?, "
                                + " Attribute7 = ?, "	
                                + " Attribute8 = ?, "
                                + " Attribute9 = ?, "
                                + " Attribute10 = ?, "
             					+ " Notes = ? "
            					+ " WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? AND SetID = ? ";
           
            try
            {
                db.transaction(function(tx){
                    tx.executeSql(sql, [setName, 
                                        oldProductTypeID, 
                                        newProductTypeID, 
                    					attr1, 
                                        attr2, 
                                        attr3, 
                                        attr4, 
                                        attr5, 
                                        attr6, 
                                        attr7, 
                                        attr8, 
                                        attr9, 
                                        attr10, 
                                    	notes, 
                                    	projectID, buildingID, groupID, setID], resultsCallback, DALSets.onError);
                    
                                  
                });
                
                //DALSets.updateCompletionStatus(projectID, buildingID, groupID, setID, percentageComp);
                DALSets.updateNoOfSetAndNoOfUnits(projectID, buildingID, groupID, setID, noOfUnits);
                
            }
            catch(err)
            {
                alert(err.message);
            }
            
        };
    
    	
    	DALSets.updateCompletionStatus = function(projectID, buildingID, groupID, setID, percentageComp)
        {
         	var db = DALMain.db;
            try
            {
                db.transaction(function(tx){
                    tx.executeSql("UPDATE Sets Set PercentComplete = round(?, 2) WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? AND SetID = ? ",
									[percentageComp, projectID, buildingID, groupID, setID],
                                  	function(tx){ DALGroups.calculateCompletionStatus(projectID, buildingID, groupID); }, 
                              		DALSets.onError);
                });
                //DALGroups.calculateCompletionStatus(projectID, buildingID, groupID);
             	//DALBuildings.calculateCompletionStatus(projectID, buildingID);
                //DALProjects.calculateCompletionStatus(projectID);
            }
           	catch(err)
            {
				alert(err.message);
            }   
        };    	
    	
    	DALSets.updateNoOfSetAndNoOfUnits = function(projectID, buildingID, groupID, setID, noOfUnits)
        {
            var db = DALMain.db;
            try
            {
                db.transaction(function(tx){
                    tx.executeSql("UPDATE Sets Set NoOfUnits = ? WHERE ProjectID = ? AND BuildingID = ? AND GroupID = ? AND SetID = ? ",
									[noOfUnits, projectID, buildingID, groupID, setID],
                                  	DALSets.onSuccess, 
                              		DALSets.onError);
                });
                DALGroups.updateNoOfSetsAndNoOfUnits(projectID, buildingID, groupID);
                DALBuildings.updateNoOfSetsAndNoOfUnits(projectID, buildingID);
            }
           	catch(err)
            {
				alert(err.message);
            }                 
        };
    	
        DALSets.getMaxSetID = function (resultsCallback) {
            var db = DALMain.db;
            try {
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM Sets WHERE isDeleted = 0 and setID = (select max(setID) from Sets WHERE isDeleted = 0)', [], resultsCallback, DALSets.onError)
                });
            }
            catch (err) {
                alert(err.message);
            }
        };
    
    	DALSets.onSuccess = function(tx, results){
            //alert('DALSets.onSuccess');
        };

        DALSets.onError = function(tr, err){
            alert(err.message);
        };
    

        DALSets.getMandatoryProductAttributes = function(projectID, surveyTypeID, resultsCallback)
        {
          	var db = DALMain.db;
         
           	var sql = "SELECT Projects.ProjectID, Buildings.BuildingID, Groups.GroupID, Sets.SetID, Specs.AttributeName, Specs.IndexValue, "
            		+ " Projects.Notes AS ProjectNotes, Projects.PercentComplete AS ProjectCompletion, Projects.ProjectName AS ProjectName, Buildings.Notes AS BuildingNotes, "
            		+ " Buildings.PercentComplete AS BuildingCompletion, Buildings.BuildingName AS BuildingName, Groups.Notes AS GroupNotes, Groups.PercentComplete AS GroupCompletion, "
            		+ " Groups.GroupName AS GroupName, Sets.SetName as SetName, Sets.OldProductTypeID, Sets.NewProductTypeID, Sets.NoOfUnits, Sets.Notes AS SetNotes, Sets.PercentComplete AS SetCompletion, "
            		+ " Specs.AttributeValue, Specs.IsMandatory, Specs.CategoryName as Location, Specs.GroupName as EquipType, Specs.Notes, Specs.AddedOn, Specs.UpdatedOn, Specs.RowGUID, "
            		+ " Specs.IsMandatory, Specs.ProductVersionNo, Specs.SurveyVersionNo ,Specs.IsActive, Specs.IsDeleted, "
                    + " Projects.RowGUID AS ProjectRowGUID, Buildings.RowGUID AS BuildingRowGUID, Groups.RowGUID AS GroupRowGUID, Sets.RowGUID AS SetRowGUID, Attributes.IsPhotoRequired AS IsPhotoRequired, Attributes.Prompt as Prompt, Specs.IsHidden "
            		+ " FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN Specs ON Sets.ProjectID = Specs.ProjectID AND Sets.BuildingID = Specs.BuildingID AND Sets.GroupID = Specs.GroupID "
            		+ " AND Sets.SetID = Specs.SetID INNER JOIN Attributes ON Sets.OldProductTypeID = Attributes.ProductID AND Specs.AttributeName = Attributes.AttributeName "
                    + " INNER JOIN KbAttributeCategories ON Attributes.ProductID = KbAttributeCategories.ProductID AND Attributes.Category = KbAttributeCategories.AttributeCategoryName "                  
          			+ " WHERE Sets.ProjectID = " + projectID + " AND Projects.SurveyTypeID = " + surveyTypeID + " AND Sets.IsDeleted = 0 order by KbAttributeCategories.SequenceNo, Specs.GroupName ";
                      console.log(sql);
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };  
        

        DALSets.getSetOfProduct = function(projectID, buildingID, groupID, setID, productID, resultsCallback)
        {           
           	var db = DALMain.db;
			var sql = "SELECT Projects.ProjectName, Buildings.BuildingName, Groups.GroupName, Sets.* , OldProductTypes.ProductName as OldProductType FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN OldProductTypes ON Sets.OldProductTypeID = OldProductTypes.ProductID "
            		+ " WHERE Sets.ProjectID = " + projectID + " AND Sets.BuildingID = " + buildingID + " AND Sets.GroupID = " + groupID + " AND Sets.SetID = " + setID + "  AND Sets.OldProductTypeID = " + productID + " AND Sets.IsDeleted = 0 ";
                   // console.log(sql);            
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };


       DALSets.getSetsOfProductGroups = function(projectID, groupsList, productID, resultsCallback)
        {            
            // alert(groupsList);
          	var db = DALMain.db;
            var filter = "";
            if(groupsList!=""){ 
            filter = " AND (" + DALSets.parseBuildingGroupSetIDsForQueryFilter(groupsList) + ") ";
            }            
           	var sql = "SELECT Projects.ProjectName,  Projects.SurveyTypeID, Buildings.BuildingName, Groups.GroupName, Sets.*, OldProductTypes.ProductName AS OldProductType FROM Projects INNER JOIN Buildings ON Projects.ProjectID = Buildings.ProjectID INNER JOIN Groups ON Buildings.ProjectID = Groups.ProjectID AND Buildings.BuildingID = Groups.BuildingID "
            		+ " INNER JOIN Sets ON Groups.ProjectID = Sets.ProjectID AND Groups.BuildingID = Sets.BuildingID AND Groups.GroupID = Sets.GroupID "
              		+ " INNER JOIN OldProductTypes ON Sets.OldProductTypeID = OldProductTypes.ProductID "
          			+ " WHERE Sets.ProjectID = " + projectID + " " + filter + " AND Sets.OldProductTypeID = " + productID + " AND Sets.IsDeleted = 0 ";
                      
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sql, [], resultsCallback, DALSets.onError);   
                });
        };


        DALSets.calculateAndUpdateCopyCompletionStatus= function(projectID, buildingID, groupID, setID, notes, surveyVersionNo, resultsCallback)
        {
            //console.log('projectID, buildingID, groupID, setID ' + projectID + "," + buildingID+ "," + groupID+ "," + setID );
            var db = DALMain.db;
            var updatedOn = new Date();
            var subQueryNumerator = " (SELECT COUNT(*) FROM Specs WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID + " AND IsMandatory = 'true' AND AttributeValue != '' AND AttributeValue IS NOT NULL) "
            var subQueryDenominator = " (SELECT COUNT(*) FROM Specs WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID + " AND IsMandatory ='true') "
            /*db.transaction(function(tx){
                tx.executeSql(" SELECT COUNT(*) as Count1 FROM Specs WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID + " AND IsMandatory = 'true' AND AttributeValue != '' AND AttributeValue IS NOT NULL ",
                              [],
                              function(tx, results){
                                  console.log('Mandatory answered: ')
                                  console.log(results.rows.item(0).Count1);

                              });
            });*/
            var sql = "UPDATE Sets SET PercentComplete = ifnull(round(" + subQueryNumerator + " * 100.0 / " + subQueryDenominator + ", 2), 100) ";
            sql += " , Notes = ?, SurveyVersionNo = ? WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + " AND setID = " + setID 
            db.transaction(function(tx){
                tx.executeSql(sql,
                              [notes, surveyVersionNo],
                              function(tx, results){
                 					var groupsSqlSubquery = " (SELECT avg(PercentComplete) FROM Sets WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID + ") "
            						var groupSql = "UPDATE Groups SET PercentComplete = round(" + groupsSqlSubquery + ", 2)"
            						groupSql += " WHERE projectID = " + projectID + " AND buildingID = " + buildingID + " AND groupID = " + groupID;
                    				 tx.executeSql(groupSql,
                                                   [],
                                                   function(tx, results){
                                                        var buldingsSqlSubquery = " (SELECT avg(PercentComplete) FROM Groups WHERE projectID = " + projectID + " AND buildingID = " + buildingID + ") "
                                                        var buildingsSql = "UPDATE Buildings SET PercentComplete = round(" + buldingsSqlSubquery + ", 2)"
                                                        buildingsSql += " WHERE projectID = " + projectID + " AND buildingID = " + buildingID;
                                                        tx.executeSql(buildingsSql,
                                                                       [],
                                                                       function(tx, results){
                                                                            var projectSqlSubquery = " (SELECT avg(PercentComplete) FROM Buildings WHERE projectID = " + projectID + ") "
                                                                            var projectSql = "UPDATE Projects SET PercentComplete = round(" + projectSqlSubquery + ", 2)"
                                                                            projectSql += " WHERE projectID = " + projectID ;
                                                                            tx.executeSql(projectSql,
                                                                                           [],
                                                                                           resultsCallback,
                                                                                           DALSets.onError);
                                                                        },
                                                                       	DALSets.onError);
                                                    },
                                                   DALSets.onError);
                				}, 
                              DALSets.onError);
               
            });
        };

    	return DALSets;
    	
});