var copyReportNumTrigger = document.querySelector('.js-copy-report-num');
var copyText = document.querySelector(".js-reportNum");

document.querySelector(".js-reportNum").setAttribute('readonly', 'readonly');


function onCopyReportNumClick() {
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
}

copyReportNumTrigger.addEventListener('click', onCopyReportNumClick); 