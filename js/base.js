var databaseRef;
var bmiStatus;
var recordList = [];
initDataBase();
loadRecord();

function initDataBase() {
    var firebaseConfig = {
        apiKey: "AIzaSyBYfjBBcikUzqMj-hf7ZGz4In9PPwATBaw",
        authDomain: "project-ab2e9.firebaseapp.com",
        databaseURL: "https://project-ab2e9-default-rtdb.firebaseio.com",
        projectId: "project-ab2e9",
        storageBucket: "project-ab2e9.appspot.com",
        messagingSenderId: "295049698987",
        appId: "1:295049698987:web:26de26c58e5a350c1321ee"
    };
    firebase.initializeApp(firebaseConfig);
    databaseRef = firebase.database().ref('bmi');
}

$(".btn-result").click(function() {
    var height = $("#input-height").val();
    var weight = $("#input-weight").val();

    if (height && weight) {
        $(".btn-result").hide();
        $(".btn-result-area").removeClass(`btn-${bmiStatus}`);
        var bmiVal = (weight / Math.pow((height * 0.01), 2)).toFixed(2);
        bmiStatus = checkBMIStatus(bmiVal);
        $(".btn-result-area").show();
        $(".btn-result-area").addClass(`btn-${bmiStatus}`);
        $(".result-area-bmi").html(`${bmiVal}<br><span>BMI</span>`);
        writeData(height, weight, bmiVal, bmiStatus);
    } else {
        alert("請輸入身高體重!");
    }
});

$(".btn-result-area").click(function() {
    $("#input-height").val("");
    $("#input-weight").val("");
    $(".btn-result-area").hide();
    $(".btn-result").show();
});


$(document).on('click', '.btn-delete', function() {
    var id = $(this).data("id");
    databaseRef.child(id).remove();
});

function checkBMIStatus(val) {
    if (val < 18.5) {
        return "underweight";
    } else if (val >= 18.5 && val < 24) {
        return "ideal";
    } else if (val >= 24 && val < 27) {
        return "overweight";
    } else if (val >= 27 && val < 30) {
        return "mild-obesity";
    } else if (val >= 30 && val < 35) {
        return "moderate-obesity";
    } else {
        return "severe-obesity";
    }
}

function writeData(height, weight, bmiVal, bmiStatus) {
    var now = new Date($.now());
    var createTime = `${paddingZero(now.getMonth()+1)}-${now.getDate()}-${now.getFullYear()}`;
    var data = {
        "height": height,
        "weight": weight,
        "bmi": bmiVal,
        "status": bmiStatus,
        "createTime": createTime
    }
    databaseRef.push(data);
}

function paddingZero(n) {
    return n < 10 ? '0' + n : n
}

function loadRecord() {
    databaseRef.on('value', function(snapshot) {
        $('#record-list> .record-item').remove();
        recordList = [];
        snapshot.forEach(function(item) {
            recordList.push({
                key: item.key,
                value: item.val()
            })
        })
        recordList.reverse();
        appendDataList(recordList);
    })
}

function appendDataList(recordList) {
    recordList.forEach(record => {
        var recordVal = record.value;
        var recordHtml = `
        <div class="record-item">
            <div class="status ${recordVal.status}">
                <div class="status-color"></div>
                <div class="status-text"></div>
            </div>
            <div class="record-item-bmi-data">
                <div><span>BMI</span>${recordVal.bmi}</div>
                <div><span>weight</span>${recordVal.weight}kg</div>
                <div><span>height</span>${recordVal.height}cm</div>
            </div>
            <span class="record-item-date">${recordVal.createTime}</span>
            <div class="btn btn-delete" data-id='${record.key}'>刪除</div>
        </div>`;
        $('.middle-area #record-list').append(recordHtml);
    });
}