define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'setManager', 'DALProjects', 'DALBuildings', 'DALGroups', 'DALSets'],
       function ($, cordova, kendo, app, localizer, WSHandler,  setManager, DALProjects, DALBuildings, DALGroups, DALSets) {
   
    var groupManager = {};
    
    groupManager.addGroup = function(groupsOfThisProject){
        DALGroups.addGroup(groupsOfThisProject.ProjectID,groupsOfThisProject.BuildingID, groupsOfThisProject.GroupID,
                                            groupsOfThisProject.GroupNo,groupsOfThisProject.GroupName,
                                            1,groupsOfThisProject.PercentComplete, groupsOfThisProject.Notes, groupsOfThisProject.RowGuid);
        
    }
    
    groupManager.insertAllGroupData = function(buildingsInfo, surveyTypeID){
            	var groupsOfThisProject = buildingsInfo.Groups;
            	$.each( groupsOfThisProject, function( groupKey, groupValue ) {
                    //check if group already exists, if not insert groups data
                      DALGroups.getGroup(groupsOfThisProject[groupKey].ProjectID, groupsOfThisProject[groupKey].BuildingID,
                                         groupsOfThisProject[groupKey].GroupID,
                                         function(tx, records){
                                            if(records.rows.length <= 0){
                                                groupManager.addGroup(groupsOfThisProject[groupKey]);
                                            }                        
               		 });                    
                    
                    // insert all sets data
                    setManager.insertAllSetData(groupsOfThisProject[groupKey], surveyTypeID);
                });


    };
    return groupManager;
});