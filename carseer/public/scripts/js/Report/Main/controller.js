var fuelType = 0;
var MainReportController = function () {


    //var downloadEvent = $("body").on("click", "#downloadReport", function () {
    //    showLoading();

    //        var opt = {
    //            margin: 50,
    //            filename: 'myfile.pdf',
    //            image: { type: 'jpeg', quality: 0.98 },
    //            html2canvas: { scale: 1.0, dpi: 192 },
    //            jsPDF: {
    //                unit: 'mm', format:[305,800], orientation: 'portrait' }
    //        };
    //    const ele = document.getElementsByTagName("body")[0];

    //    html2pdf().set(opt).from(ele).save();
    //    hideLoading();

    //});
    var marketValueREdirect = $("body").on("click", ".go-to-app", function () {
        
        var url = getUrlVars().ismobile
        if (url == undefined)
            window.location.href = `/GetMarketValue/${$(this).data().serial}/${$(this).data().id}`
        else
            window.location.href = `/GetMarketValue/${$(this).data().serial}/${$(this).data().id}?ismobile=true`
    })

    var loanRedirect = $("body").on("click", ".go-to-app-loan", function () {

        var url = getUrlVars().ismobile
        if (url == undefined)
            window.location.href = `/GetLoan${$(this).data().serial}/${$(this).data().id}`
        else
            window.location.href = `/GetLoan${$(this).data().serial}/${$(this).data().id}?ismobile=true`
    })
    var mobilePopup = function (title, description, btnDescription, cancelDescription, action, cancelAction = null) {
        
        $(".action-icon").css("background-image", `url(/assets/carseer/images/imgs/Icons/sms-orange.svg)`);
        $(".action-title").html(title);
        $(".action-description").html(description);
        $(".action-btn").html(btnDescription);
        $(".close-btn").html(cancelDescription);
        hideLoading();
        $("#js-modal-msg3").addClass("is-active");

        $("body").on("click", ".action-btn", action);
        if (cancelAction != null) {
            $("body").on("click", ".close-btn", cancelAction);
        }


    }
    var sendSmsEvent = $("body").on("click", "#sendSms", function () {
        

        mobilePopup(smsSend, "", send, close, function () {
            toastr.remove();
            showLoading();
            $("#js-modal-msg3").removeClass("is-active");
            $.post("/Reports/SendSms", { reportId: $(this).data().id, sendTo: $(".send-to").val() }).done(function (res) {

                if (!res.success) {
                    toastr.remove();

                    hideLoading();
                    toastr.error(res.message, "", { closeButton: true, timeOut: 1000 })

                }
                else {
                    toastr.remove();

                    hideLoading();
                    toastr.success(res.message, "", { closeButton: true })
                }
            });
        });
    });


    var hideElements = $(".hideElements").on("click", function () {
        const menu = $(this).closest('.hide-options-menu');
        const hideVinAndPlate = menu.find("#hideVinAndPlate").is(':checked');
        const hidePrice = menu.find("#hidePrice").is(':checked');

        const serial = $(this).data().serial;
        const lang = $(this).data().lang;

        if (hideVinAndPlate || hidePrice)
            window.open(`/Reports/EncryptReport/${serial}?isprivate=${hideVinAndPlate}&hidePrice=${hidePrice}&lang=${lang}`);
    });

    var hideOptionsMenuTrigger = $(".hide-options-menu-trigger").on("click", function () {

        var menu = $(this).closest(".hide-options-container").find(".hide-options-menu");

        if (menu[0].classList.contains("is-active"))
            menu[0].classList.remove("is-active");
        else
            menu[0].classList.add("is-active");
    });

    $(document).on("click", function (event) {
        var menuContainer = event.target.closest(".hide-options-container")
        var menus = $(".hide-options-menu.is-active");

        if (menuContainer)
            return;
        else
            menus.each(i => menus[i].classList.remove("is-active"));
    });

    var selectFule = $("body").on("change", "#CarFuelTypeList1", function () {
        fuelType = $(this).val();


    })
    var hayaPop = $("body").on("click", "#InvoiceHayaLink", function () {
        CommonController.actionPopup(hayaFuel, `<select id="CarFuelTypeList1" name="CarFuelTypeList" class=" c-form-field__input " style="height: 35px;">
                                                <option value="0">بنزين</option>
                                                <option value="1">هايبرد</option>
                                                <option value="2">كهرباء</option>
                                                <option value="3">ديزل</option>
                                                <option value="4">غير ذلك</option>
                                             </select>`, "information.svg", printLoc, close, function () {
            showLoading();
            var fuelTypeLoc = fuelType;
            fuelType = 0;
            
            GetJFZICInvoice(0, fuelTypeLoc);
           

        });
    });


    function GetJFZICInvoice(numberOfTrys, fuelTypeLoc) {

        $.ajax({
            type: 'GET',
            url: `${$("#InvoiceHayaLink").data().link}&Fuel=${fuelTypeLoc}&ajax=true`,
            success: function (res) {
                window.location.href = `${$("#InvoiceHayaLink").data().link}&Fuel=${fuelTypeLoc}&ajax=false`;
            },
            statusCode: {
                //This is added to avoid API gatway time out caused by providers taking longer than 29'sec try 3 times then show the error 
                504: function () {
                    if (numberOfTrys != null) {
                        if (numberOfTrys > 3) {
                            hideLoading();
                        } else {    
                            numberOfTrys = numberOfTrys + 1;
                        }
                    } else {
                        numberOfTrys = 1;
                    }

                    sleep(10000).then(() => {
                        GetJFZICInvoice(numberOfTrys, fuelTypeLoc);
                    });
                }
            }
        })

    }

    var downloadEvent = $("body").on("click", ".download-report", function () {


        showLoading();
        $.get("/api/Pdf/CreatePdfApi", { link: $(this).data().link, serial: $(this).data().serial }, function (res) {
            hideLoading();
            /*window.location.href = `https://carseer.com${res.name}`;*/
            var pdfUrl = res.name; // Adjust this line according to your data structure
            // Update the src attribute of the iframe
            window.location.href = `/PDF/${pdfUrl}`;
            /*window.open(`https://carseer.com${res.name}`, '_blank');*/
        });
    });
    var downloadSharedEvent = $("body").on("click", ".download-shared-report", function () {
        showLoading();
        var country = $(this).data("country");
        var serial = $(this).data("serial");
        var encryptedUrl = $(this).data("encryptedurl");
        var lang = $(this).data().lang;
        $.get("/api/Main/CreateHiddenPdf", { country, serial, encryptedUrl, lang }, function (res) {
            hideLoading();
            window.location.href = `${res.url}`;
        });
    });

   
    var loadChart = function () {
        var ctx;
        if (document.getElementById('odometer') != null) {
            ctx = document.getElementById('odometer').getContext('2d');
        }
        if (odometerReading !== null && odometerReading !== undefined) {
            var labels = [];

            $.map(odometerReading, function (obj) {
                obj.x = obj.Date.slice(0, 7);
                obj.y = obj.Value;
                labels.push(obj.Date.slice(0, 7));
                return obj;
            })

            var odoChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data: odometerReading,
                        label: "",
                        borderColor: odometerReading[0].GraphColor,
                        fill: true,
                        hidden: false
                    }
                    ]
                },
                options: {
                    title: {
                        display: false,
                        text: ''
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    animation: false,
                    legend: {
                        onClick: function (e) {
                            e.stopPropagation();
                        }
                    }




                }
            });
        }

    }
    //var floatButton = $('.fixed-action-btn').floatingActionButton({
    //    direction: 'right',
    //    hoverEnabled: false
    //}

    //);
    var backpopup = $("body").on("click", ".btn-back-popup", function () {
        //var ele = $("#js-modal-evalutaion2");
        //ele.removeClass('is-active');
        //var ele2 = $("#js-modal-evalutaion3");
        //ele2.removeClass('is-active');
        if (getUrlVars().indexOf("ismobile") >= 0) {
            window.history.back();
            window.history.back();
        } else {
            let ele = $("#js-modal-evalutaion2");
            ele.removeClass('is-active');
            let ele2 = $("#js-modal-evalutaion3");
            ele2.removeClass('is-active');
        }

    })
    var scrollEvent = $("body").on("click", ".scroll-event", function () {

        let scrollAttr = $(this).data().attrScroll;
        if (scrollAttr != "#-1") {
            let defaultAnchorOffset = 100;
            if ($(scrollAttr).is(":hidden")) {
                scrollAttr = `${scrollAttr}.table-row--mobile`;
            }

            $('html,body').animate({
                scrollTop: $(scrollAttr).offset().top - 300
            }, 500);
            $(scrollAttr).effect("highlight", {}, 3000);

        }
    })
    var sendToBankEvent = $("#sendToBankButton").on("click", function (e) {
        let ddlBankRedirectLink = ""
        let ddlBankValue = "0"
        
        e.preventDefault();
        $('#error-sendtobank').removeClass("display-block");
        const reportId = this.dataset.id;
        const inspectorId = this.dataset.inspectorid;
        ddlBankValue = $("#sendtobank-dropdown").val();
         ddlBankRedirectLink = $("#sendtobank-dropdown").find("option:selected").attr('data-redirectLink');
        
        if (ddlBankValue == "0") {
            $('#error-sendtobank').addClass("display-block");
        }
        else if (typeof (ddlBankValue) == "undefined") {
            redirectToContactUsView();
        } else {
            
            redirectToSendToBankViews(ddlBankValue, reportId, inspectorId, ddlBankRedirectLink);
        }
    });
    var loanRequestEvent = $(".finance-btn").on("click", function () {
        $("#loanType-1").prop("checked", true);
        changeLoanType("input#loanType-1");
        loanCalc();
        rangeUpdate()
    });

    var redirectToSendToBankViews = function (bankId, repId, inspectorId, bankRedirectLink) {
        
        window.location.href = `${bankRedirectLink}/Evaluations/Add?inspectorId=${inspectorId}&reportId=${repId}&bankId=${bankId}&Lang=${lang}`;
    }
    var redirectToContactUsView = function () {
        
        window.location.href = `/Tools/ContactUs`;
    }

    var init = function () {
        hayaPop;
        selectFule;
        downloadEvent;
        sendSmsEvent;
        hideElements;
        downloadEvent;
        downloadSharedEvent;
        backpopup;
        hideOptionsMenuTrigger;
        scrollEvent;
        sendToBankEvent;
        loanRequestEvent;

        if (typeof (mode) == typeof (undefined)) {
            loadChart();
        }

        $("#reportsAnchor").removeAttr("href")
        $("#billsAnchor").removeAttr("href")
        $("#recordsAnchor").removeAttr("href")

        $("body").on("click", "#reportsID", function () {
            window.location.replace("/Account/Dashboard#reports");

        });
        $("body").on("click", "#billsID", function () {
            window.location.replace("/Account/Dashboard#bills");

        });
        $("body").on("click", "#recordsID", function () {
            window.location.replace("/Account/Dashboard#records");

        });

        //if (FullReport != undefined && FullReport != "" && FullReport != null) {

        //    $("#reportsID").attr("href", "/Account/Dashboard")
        //    $("#reportsID").attr("href", "/Account/Dashboard")
        //    $("#reportsID").attr("href", "/Account/Dashboard")

        //}
        //floatButton;
        ReportService.sendEvaluationEvent;
        /*marketValueRedirect;*/
    }
    return {
        init
    }
}()