'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'fileHandler'],
    function ($, cordova, kendo, app, localizer, fileHandler) {

        var imageView = kendo.observable({
            beforeShow: function (e) {
                var $view = $('#' + e.view.content.context.id);
                if ($view.length > 0) {
                    app.removeCachedViews($view);
                }
            },
            onShow: function (e) {
                var chkLogin = app.isUserAuthenticated();//call for valid user check method in app page
                    if(chkLogin == false){//check for valid user session
                        app.mobileApp.navigate('app/loginView/view.html');//Not login then goto login page
                    }
            },
            afterShow: function (e) {
                if (e.view.params.imgUrl != '') {

                    var mediaType = e.view.params.mdtype;
                    var uid = e.view.params.uid;

                    try {
                        var medTyp = 1;
                        if (mediaType != 'i')
                            medTyp = 2;
                        fileHandler.getFiles(uid, null, medTyp, function (filesList) {

                            var dataSource = new kendo.data.DataSource({
                                data: filesList
                                //type: "json"
                            });

                            $("#imageAlbumScroll").innerHtml = "";

                            $("#imageAlbumScroll").kendoMobileScrollView({
                                dataSource: dataSource,
                                template: $("#scrollViewTemplate").text()
                            });
                            var imageAlbum = "";
                            var pageId = 0;
                            var pgNo = 0;
                            $.each(filesList, function (key, value) {
                                imageAlbum += '<div data-role="page" style="width: 1024px;"><img data-bind="click:showImage" src="' + value.nativeURL + '" style="max-width: 100%; max-height: 100%;"></img></div>';
                                //ImageViewer.show(value.nativeURL);
                                if (encodeURI(e.view.params.imgUrl) == value.toURL)
                                    pgNo = pageId;
                                else
                                    pageId++

                            });

                            $("#imageAlbumScroll").data("kendoMobileScrollView").content(imageAlbum);
                            $("#imageAlbumScroll").data("kendoMobileScrollView").scrollTo(pgNo);
                        });
                    }
                    catch (ex) {
                        alert(ex.message);
                    }


                }
            },showPrevImage:function(e){
                    try{
                     var scrollView = $("#imageAlbumScroll").data("kendoMobileScrollView");
                     scrollView.prev();
                    }catch(e){
                        alert(e.message);
                    }
            },showNextImage:function(e){
                    try{
                     var scrollView = $("#imageAlbumScroll").data("kendoMobileScrollView");
                     scrollView.next();
                     }catch(e){
                        alert(e.message);
                    }
            }

        });


        $("#prev-img").click(function(e) {
            var scrollView = $("#imageAlbumScroll").data("kendoMobileScrollView");
            scrollView.prev();
        });

        $("#next-img").click(function(e) {
            var scrollView = $("#imageAlbumScroll").data("kendoMobileScrollView");
            scrollView.next();
        });

        app.imageView = imageView;

        return imageView;
    });
// START_CUSTOM_CODE_settingsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_settingsView
