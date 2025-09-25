function callQuery(numberOfTrys,errorMessage) {    
    if ($("#main-form").valid()) {  
        var data = $("#main-form").serialize();
        showQueryLoading();
        $.ajax({
            type: 'POST',
            url: '/Home/Query',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (res) {
                CommonController.onQuerySuccess(res);
            },
            statusCode: {
                //This is added to avoid API gatway time out caused by providers taking longer than 29'sec try 3 times then show the error 
                504: function () {
                    if (numberOfTrys != null) {
                        if (numberOfTrys > 3) {
                            showErrorAndHideQueryLoading(errorMessage);                            
                        } else {
                            numberOfTrys = numberOfTrys + 1;
                        }
                    } else {
                        numberOfTrys = 1;
                    }

                    sleep(20000).then(() => {
                        callQuery(numberOfTrys, errorMessage);
                    });
                },
                408: function () {
                    if (numberOfTrys != null) {
                        if (numberOfTrys > 3) {
                            showErrorAndHideQueryLoading(errorMessage);
                        } else {
                            numberOfTrys = numberOfTrys + 1;
                        }
                    } else {
                        numberOfTrys = 1;
                    }

                    sleep(20000).then(() => {
                        callQuery(numberOfTrys, errorMessage);
                    });
                },
                500: function () {
                    showErrorAndHideQueryLoading(errorMessage);
                },
            }
        })
    }

}
function callQueryDashboard(numberOfTrys,errorMessage) {    
    if ($("#vin-bar").valid()) {  
        var data = $("#vin-bar").serialize();

        showQueryLoading();
        $.ajax({
            type: 'POST',
            url: '/Home/Query',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (res) {
                CommonController.onQuerySuccess(res);
            },
            statusCode: {
                //This is added to avoid API gatway time out caused by providers taking longer than 29'sec try 3 times then show the error 
                504: function () {
                    if (numberOfTrys != null) {
                        if (numberOfTrys > 3) {
                            showErrorAndHideQueryLoading(errorMessage);                            
                        } else {
                            numberOfTrys = numberOfTrys + 1;
                        }
                    } else {
                        numberOfTrys = 1;
                    }

                    sleep(20000).then(() => {
                        callQueryDashboard(numberOfTrys, errorMessage);
                    });
                },
                500: function () {
                    showErrorAndHideQueryLoading(errorMessage);
                }
            }
        })
    }

}

function showErrorAndHideQueryLoading(errorMessage) {
    hideQueryLoading();
    $(".err-title").html(errorMessage);
    $(".error-msg").addClass("is-active");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var CommonController = function (commonService)

{
    var gotToOld = $("body").on("click", ".old-website",
        function ()
        {
            var currentPage = window.location.href;
            debugger;
            if (currentPage.toLowerCase().indexOf("fullreport") !== -1) {
                var arr = currentPage.split("/");
                var serial = arr[arr.length - 1];
                if (serial === "")
                {
                    serial = arr[arr.length - 2];
                }
                window.location.href = `https://legacy.carseer.com/FullReport?Serial=${serial}`;
            }
            else
            {
            }
            window.location.href = "https://legacy.carseer.com/default";
        });
    var onQuerySuccess = function (res) {
        if (res.success) {
            
            if (res.hasRecords) {
                //Redirect to packages
                if (res.status !== QueryStatusEnum.FetchIssued)
                    window.location.href = `/Packages/${res.groupId}`;
                else {
                    //The same vin is exist and fetched
                    if (res.ref === QueryRefEnum.Refetch) {
                        
                        hideQueryLoading();
                        actionPopup("", existReport, "question.png", refetch, showReport, function ()
                        {
                            if (document.querySelector("#main-form") !== null) {
                                $("#ForceQuery").val("true");
                                $("#main-form").submit();
                                $("#js-modal-msg2").removeClass("is-active");
                            } else if (document.querySelector("#vin-bar") !== null) {
                                $("#ForceQuery").val("true");
                                $("#vin-bar").submit();
                                $("#js-modal-msg2").removeClass("is-active");
                            }
                            
                        }, function ()
                            {
                                $("#js-modal-msg2").removeClass("is-active");
                                
                                window.location.href = `/Reports/GeneratingReport/Refetch/${res.existSerial}`;
                                return false;

                        });
                    }
                }
            }
            else {
                
                // No Records
                //Print the custom report if the user allowed to see it
                hideQueryLoading();
                debugger;
                if (res.ref === QueryRefEnum.ShowPrint) {
                    debugger;
                    actionPopup(noDataReportTitle, noDataReportMessage, "information.svg", continueLoc, close, function ()
                    {
                        showLoading();
                        window.location.href =`/Reports/GeneratingReport/NoData/${res.noDataSerial}`

                    }, null)
                }
                else {
                    //Not login- no records
                    //toastr.warning(noRecordsFound, "", { closeDuration:30000 });
                    $(".err-title").html(res.errorMessage);
                    $(".error-msg").addClass("is-active");
                    //$(".js-message").addClass("js-message-active");
               }
            }
        } else {
            hideQueryLoading();
            $(".err-title").html(res.errorMessage);
            $(".error-msg").addClass("is-active");
            //alert(res.errorMessage);
        }
        

    };

    //add loading to button
    var loadingOnField = $("body").on("click", ".loading-btn", function () {

        $(this).hide();
        $(".loading-field").addClass("load-gif")
        

    });

    //remove loading to button
    var removeLoadingOnField = function () {

        $(".loading-field").removeClass("load-gif")
        $(".loading-btn").show();
    }

    var generalBack = $("body").on("click touchstart", ".body-content-header__back", function () {
        history.back();
    });

    var generalBackForAll = $("body").on("click touchstart", ".general-back", function () {
        history.back();
    });

    var generalCancelForm = $("body").on("click", ".form-btn--cancel", function (e)
    {
        e.preventDefault();
        history.back();
    })

    var resetTextField = function ()
    {
        $("input[type=text]").val("");
    }
    var resetCheckBox = function ()
    {
        $("input[type='checkbox']:checked").trigger("click");
    }
    var restSelect = function ()
    {
        $("select")[0].selectedIndex = 0;
    }
    var restArea = function ()
    {
        $("textarea").val("");
    }
    var actionPopup = function (title, description, icon, btnDescription, cancelDescription, action,cancelAction=null)
    {
        debugger;
        $(".action-icon").css("background-image", `url(/assets/images/${icon})`);
        $(".action-title").html(title);
        $(".action-description").html(description);
        $(".action-btn").html(btnDescription);
        $(".close-btn").html(cancelDescription);
        hideLoading();
        $("#js-modal-msg2").addClass("is-active");

        $("body").on("click", ".action-btn", action);
        if (cancelAction != null) {
            $("body").on("click", ".close-btn", cancelAction);
        }


    }


    var datePickerPopup = function (title, description, icon, btnDescription, cancelDescription, action, cancelAction = null) {
        debugger;
        $(".action-icon").css("background-image", `url(/assets/images/${icon})`);
        //$(".action-title").html(title);
        //$(".action-description").html(description);
        //$(".action-btn").html(btnDescription);
        //$(".close-btn").html(cancelDescription);
        hideLoading();
        $("#js-modal-msg3").addClass("is-active");
        $("body").on("click", ".action-btn", action);
        if (cancelAction != null) {
            $("body").on("click", ".close-btn", cancelAction);
        }
    }
    var checkIfError = function () {
        var urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get("hasError") !== null || (typeof (hasError) != typeof (undefined) && hasError.toLowerCase() == "true")) {
            toastr.error(errorMessage, "", { closeButton: true, timeOut: 10000 })
        }
    }

    var init = function ()
    {
        gotToOld;
        loadingOnField;
        generalBack;
        generalBackForAll;
        generalCancelForm;
        removeLoadingOnField();
        
    }
    
    return {
        onQuerySuccess,
        removeLoadingOnField,
        resetTextField,
        resetCheckBox,
        restArea,
        restSelect,
        actionPopup,
        checkIfError,
        datePickerPopup,
        init
    }


}(CommonService)