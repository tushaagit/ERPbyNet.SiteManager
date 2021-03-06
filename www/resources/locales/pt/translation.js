'use strict';
define([],
       function () {
    	var pt = {
                "app.name": "SmartSiteSurvey",
                "login.userName": "Nome do utilizador",
                "login.password": "Senha",
                "login.signIn": "Login",
                "login.tryToAuthMsg": "Tentando autenticar ...",
                "login.invalidDataMsg": "Ops! há dados inválidos na forma.",
                "login.loginSuccessMsg": "Login com sucesso.",
                "login.loginFailMsg": "Falha na Login.",
                "login.authentication": "Autenticação",

                "app.back": "Voltar",
                "app.homeMenu": "Home",
                "app.setupMenu": "Instalação",
                "app.downloadProjectsMenu": "Download de Projetos",
                "app.aboutApp": "Sobre SmartSiteSurvey",
                "app.checkUpdates": "Verificar atualizações",
                "app.failed": "Erro",
                "app.signout": "Terminar sessão",

                "homeView.dashboard": "Dashboard",
                "homeView.ProjectsList": "Projects",
                "homeView.deviceStatus": "Estado do dispositivo",
                "homeView.connection": "Ligação",
                "homeView.confirmUploadMsg": "Clique em OK para continuar a fazer upload de dados para o servidor",
                "homeView.uploadCancelMsg": "processo de upload cancelado!",
                "homeView.upldTotlRecCntMsg": "Total de registos   {0}. Upload iniciado…",
                "homeView.home": "Home",
                "homeView.deviceStatMsg": "% de espaço ocupado",
                "homeView.noProjectsMessage": "Please download projects for the surveys to be performed.",

                "projectView.projectCap": "Projeto",
                "projectView.notes": "Notas",
                "projectView.save": "Gravar",
                "projectView.close": "Fechar",
                "projectView.addressCap": "Endereço",
                "projectView.completeCap": "% Completa",
                "projectView.buildingCol": "Edifício.",
                "projectView.noOfSetsCol": "#Conjuntos",
                "projectView.noOfUnitsCol": "#Unidades",
                "projectView.perCompCol": "% Completa",

                "projectView.noOfSymbol": "#",
                "projectView.percentageSymbol": "%",
                "projectView.colonSymbol": ":",

                "buildingView.ProjectName": "Projeto",
                "buildingView.Notes": "Notas",
                "buildingView.Save": "Gravar",
                "buildingView.Close": "Fechar",
                "buildingView.buildingName": "Edifício",
                "buildingView.noOfSets": "Número de conjuntos",
                "buildingView.noOfUnits": "Número de unidades",
                "buildingView.percComp": "% Completa",
                "buildingView.groupNoCol": "Grupo#",
                "buildingView.groupNameCol": "Grupo",
                "buildingView.noOfSetsCol": "#Conjuntos",
                "buildingView.perCompCol": "%Completa",
                "buildingView.noOfUnitsCol": "#Unidades",

                "groupView.ProjectgName": "Projeto",
                "groupView.notes": "Notas",
                "groupView.save": "Gravar",
                "groupView.close": "Fechar",
                "groupView.buildingName": "Edifício",
                "groupView.groupName": "Grupo",
                "groupView.noOfUnits": "#Unidades",
                "groupView.percComp": "% Completa",
                "groupView.setNameCol": "#Conjuntos",
                "groupView.oldProductNameCol": "Produto existente",
                "groupView.noOfUnitsCol": "#Unidades",
                "groupView.percCompCol": "% Completa",

                "setView.ProjectName": "Projeto",
                "setView.buildingName": "Edifício",
                "setView.groupName": "Grupo",
                "setView.setName": "Conjunto",
                "setView.oldProductType": "Tipo de produto existente",
                "setView.newProductType": "Novo tipo de produto",
                "setView.noOfUnits": "Número de unidades",
                "setView.percComp": "Percentagem completa",
                "setView.notes": "Notas",
                "setView.save": "Gravar",
                "setView.uploadData": "Upload",
                "setView.emptySetNameMsg": "Inserir o nome do conjunto _",
                "setView.noOfUnitsErrorMsg": "O número de unidades não deve ser inferior a 1",
                "setView.perCompErrorMsg": "A percentagem deve estar entre 0 e 100",
                "setView.totalSpecMsg": "Total de Especificações {0} Upload começou .",
                "setView.setUpdatedMsg": "Detalhes do conjunto atualizados com sucesso.",

                "dbInitView.close": "Fechar",

                "downloadProductsView.close": "Fechar",
                "downloadProductsView.syncStartMsg": "A sincronizar os dados da definição do questionário. Por favor aguarde…",
                "downloadProductsView.synchSrvyDefs": "Sincronizar definições do questionário",
                "downloadProductsView.syncCompMsg": "Sincronização dos dados de definição do questionário terminada.",
                "downloadProductsView.invalidDataMsg": "Insira valores para todos os campos",
                "downloadProductsView.dataSaveSuccess" :"Configuração salva com êxito",
                "downloadProductsView.tokenlife": "Vida simbólica",
                "downloadProductsView.errorTokenLife" : "Insira a Vida do Token",
                "downloadProductsView.servicePath": "Caminho de Serviço",
                "downloadProductsView.servicePathError" : "Insira o Caminho de Serviço",
                "downloadProductsView.mediaServicePath": "Caminho do Serviço de Mídia",
                "downloadProductsView.mediaServicePathError" : "Insira o Caminho do Serviço de Mídia",
                "downloadProductsView.KnowledgebaseID": "ID da Base de Conhecimento",
                "downloadProductsView.knowledgebaseIDError" : "Digite o ID da Base de Conhecimento",
                "downloadProductsView.Submit" : "Enviar", 
                "downloadProductsView.saveConfigParam" : "Salvar Parâmetros de Configuração", 
                
                "downloadProjectsView.searchTextName": "Buscar texto",
                "downloadProjectsView.search": "Busca",
                "downloadProjectsView.listOfOpportunities": "Lista de oportunidades",
                "downloadProjectsView.emptySearchTextMsg": "Insira o texto de busca para o nome do projeto",
                "downloadProjectsView.servCallFailMsg": "O pedido de serviço falhou",
                "downloadProjectsView.dwnldCallFailMsg": "O pedido de Download falhou",
                "downloadProjectsView.bindDataMsg": "Dados do ligamento {0}",
                "downloadProjectsView.dwnldCompleteMsg": "Download completo",
                "downloadProjectsView.insertDataMsg": "inserir dados {0}",
                "downloadProjectsView.dwnldErrMsg": "Erro de Download",
                "downloadProjectsView.dwnldProjects": "Download de projetos",
                "downloadProjectsView.dwnldSeccMsg": "Download com sucesso {0}",
                "downloadProjectsView.download" : "Download",
                "downloadProjectsView.downloadConfirmationMsg" : "Some of the selected projects already exist. Do you want to overwrite those?",

                "imageGallery.fileName": "Nome do ficheiro",
                "mediaGalleryView.emptyFileNameMsg": "Inserir o nome do ficheiro_",
                "mediaGalleryView.fileDeletedMsg": "O Ficheiro {0} foi apagado",
                "mediaGalleryView.fileSavedMsg": "Ficheiro gravado com sucesso",
                "mediaGalleryView.errorCodeMsg": "Código de erro {0}",
                "mediaGalleryView.imgGallery": "Galeria de imagens",
                "mediaGalleryView.vidGallery": "Video Gallery",
                "mediaGalleryView.sortBy" : "Sort by",
                "mediaGalleryView.overWriteConfirm": "This name is already taken, are you sure you want to overwrite the photo?",

                "networkInfoView.checkConnection": "Verifique a ligação",
                "networkInfoView.goToHome": "Ir para o Início",
                "networkInfoView.connectionTypeCap": "Tipo de ligação",
                "networkInfoView.lastCheckAtCap": "Última verificação em",
                "networkInfoView.networkInfo": "Informação de rede",

                "setup.lblSetupDB": "Preparar Base de dados",
                "setup.DBSetup": "Prossiga",
                "setup.dropTables": "Soltar tabelas no início",
                "setup.close": "Fechar",
                "setup.setup": "Instalação",
                "setup.dbInitMsg": "Preparando a base de dados, aguarde por favor.",
                "setup.dbSetupCompMsg": "A preparação da base de dados terminou",
                "setup.smplDataPopltngMsg": "Preenchendo os dados da amostra…",
                "setup.dataPoplStrtMsg": "Preenchimento de dados iniciado",
                "setup.projAddMsg": "{0} projetos adicionados.",
                "setup.bldgAddMsg": "{0} edifícios adicionados.",
                "setup.grpAddMsg": "{0} grupos adicionados.",
                "setup.setAddMsg": "{0} conjuntos adicionados",
                "setup.dataPoplCompMsg": "Preenchimento de dados concluído",
                "setup.dbInitCompMsg": "Inicialização da base de dados concluída",

                "setupView.tblDropMsg": "As tabelas serão apagadas e recriadas.",

                "surveyView.back": "Voltar",
                "surveyView.projectName": "Projeto",
                "surveyView.surveyVersionNo": "Versão do Questionário",
                "surveyView.categoryGroup": "Categoria :: Grupo",
                "surveyView.helpText": "Ajuda sobre a pergunta do Questionário.",
                "surveyView.notes": "Notas",
                "surveyView.save": "Gravar",
                "surveyView.close": "Fechar",
                "surveyView.survey": "Questionário",
                "surveyView.noHelp": "No help available.",
                "projectView.note": "Nota",
                
                "trialExpired.message": "O seu período de teste terminou. Contate-nos por favor através do e-mail sales@xecomit.com para alargar o período de teste.",
                "trialExpired.trialExp": "O período de teste terminou",
          }
       return pt;
});
