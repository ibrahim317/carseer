var ReportService = function ()
{

    //var captureVideo = $("body").on("click", ".capture-video", function () {
    //    window.location.href = `/VideoCapture2/${$(this).data().id}/${$(this).data().serial}`;
    //});
    
    var sendEvaluationEvent = $("body").on("click", ".send-evaluation-request", function (e) {
        
        e.preventDefault();
        var ele = $("#js-modal-evalutaion1");
        var successEle = $("#js-modal-evalutaion2");
        var failEle = $("#js-modal-evalutaion3");
        var reportId = $(this).data().reportId;
        var userPhone = $(".ev-user-phone").val().trim().replace(" ", "");
        var reg = /^\d+$/;
        if (userPhone.trim().length == 0 || !reg.test(userPhone)) {
            $(".phone-error").removeClass("hide");
            $(".phone-error").addClass("display-block");
            
        } else {
            if (!$(".phone-error").hasClass("hide")) {
                $(".phone-error").addClass("hide");
                $(".phone-error").removeClass("display-block");

            }

            showLoading();
            ele.removeClass('is-active');
            
            
                $.post("/api/main/SendEvaluation", { reportId: reportId, phone: userPhone, lang: lang }, function (res) {

                    $(".ev-user-phone").val = "";
                    if (res.success) {
                        $(".updated-evalutaion1-area").html(`<div class="c-price-pending">
                        <div class="c-price-pending__icon"></div>
                        <h3 class="c-price-pending__title medium-text">${locPending}</h3>
                        <p class="c-price-pending__subtitle xxsmall-text">${locSucc}</p>
                      </div>`);
                        hideLoading();
                        successEle.addClass('is-active');

                    } else {
                        $(".error-msg").text(res.message);
                        hideLoading();
                        failEle.addClass('is-active');
                    }
                });
            
        }
    });

    var sendDealerEvaluationEvent = $("body").on("click", ".send-evaluation-verified-dealer-center", function (e) {

        e.preventDefault();
        var ele = $("#js-modal-evalutaion1");
        var successEle = $("#js-modal-evalutaion2");
        var failEle = $("#js-modal-evalutaion3");
        var reportId = $(this).data().reportId;
        var userPhone = $(".ev-user-phone").val().trim().replace(" ", "");
        var bankId = $("#dealer-bank-dropdown").val();
        var marketValue = $(".ev-dealer-market-value").val().trim().replace(" ", "");
        var userId = $("#ev-user-id").val().trim().replace(" ", "");
        $('#error-value-of-vehicle').removeClass("display-block");
        $('#error-sendto-valuation-dealer-drop-down').removeClass("display-block");
        debugger;
        

        debugger;
        var reg = /^\d+$/;
        if (userPhone.trim().length == 0 || !reg.test(userPhone)) {
            $(".phone-error").removeClass("hide");
            $(".phone-error").addClass("display-block");

        } else {
            if (!$(".phone-error").hasClass("hide")) {
                $(".phone-error").addClass("hide");
                $(".phone-error").removeClass("display-block");

            }
            if (marketValue == "" || marketValue == null) {
                $('#error-value-of-vehicle').addClass("display-block");
                return
            } else {
                marketValue = marketValue.replaceAll(",","")
            }
            if (bankId == "0") {
                $('#error-sendto-valuation-dealer-drop-down').addClass("display-block");
                return
            }

            showLoading();
            ele.removeClass('is-active');


            $.post("/api/main/SendEvaluationVerifiedDealerCenter", { reportId: reportId, DealerCenterId: userId, bankId: bankId, marketValue: marketValue, phone: userPhone, lang: lang }, function (res) {

                $(".ev-user-phone").val = "";
                if (res.success) {
                    $(".updated-evalutaion1-area").html(`<div class="c-price-pending">
                        <div class="c-price-pending__icon"></div>
                        <h3 class="c-price-pending__title medium-text">${locPending}</h3>
                        <p class="c-price-pending__subtitle xxsmall-text">${locSucc}</p>
                      </div>`);
                    hideLoading();
                    successEle.addClass('is-active');

                } else {
                    $(".error-msg").text(res.message);
                    hideLoading();
                    failEle.addClass('is-active');
                }
            });

        }
    });
    return {
        /*captureVideo,*/
        sendEvaluationEvent,
        sendDealerEvaluationEvent
    }

}()

easyNumberSeparator({
    selector: '.number-separator',
    separator: ","
})


$("#dealer-bank-dropdown").select2(
{
        "language": {
        "noResults": function () {
            debugger
                return lang == "ar-JO" ? "لا يوجد نتائج بحث" : "No Data Found";
            }
        },
    width: "100%"
})