define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'groupManager', 'DALProjects', 'DALBuildings', 'DALGroups', 'DALSets', 'DALInstallationGroups'],
       function ($, cordova, kendo, app, localizer, WSHandler, groupManager, DALProjects, DALBuildings, DALGroups, DALSets, DALInstallationGroups) {

    var installationGroupsManager = {};

    installationGroupsManager.addInstallationGroup = function(installationGroupsOfThisProject){

         DALInstallationGroups.addInstallationGroup(installationGroupsOfThisProject.OpportunityID,  installationGroupsOfThisProject.OpportunityInstallationGroupID,
                                            installationGroupsOfThisProject.OpportunityInstallationGroupNo, installationGroupsOfThisProject.OpportunityInstallationGroupName, installationGroupsOfThisProject.OpportunityInstallationGroupDescription,installationGroupsOfThisProject.OpportunityInstallationGroupAbbreviation, installationGroupsOfThisProject.PercentComplete, installationGroupsOfThisProject.UnitNames, installationGroupsOfThisProject.RowGuid);

    }

    installationGroupsManager.insertAllInstallationGroupsData = function(projectsInfo){
            	var installationGroupsOfThisProject = projectsInfo.InstallationGroups;

            	$.each( installationGroupsOfThisProject, function( installationGroupsKey, installationGroupsValue ) {
                    	//check if building already exists, if not insert building data
                    DALInstallationGroups.getInstallationGroup(installationGroupsOfThisProject[installationGroupsKey].OpportunityID, installationGroupsOfThisProject[installationGroupsKey].OpportunityInstallationGroupID,
                                         function(tx, records){
                                            if(records.rows.length <= 0){
                                                installationGroupsManager.addInstallationGroup(installationGroupsOfThisProject[installationGroupsKey]);
                                            }
               		 });
                    // insert group data
					// groupManager.insertAllGroupData(installationGroupsOfThisProject[installationGroupsKey], surveyTypeID);
                });

    };
    return installationGroupsManager;
});
