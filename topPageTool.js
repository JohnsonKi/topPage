// global variables define
var db = null;
var dbName = "topPageDb";
var tblName = "topPageTbl";
var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
var msg = "";
var sortArray = new Array();
var exportImportArray = new Array();
var showArray = new Array();
var newLineStr = "__NEWLINE__";

$(function(){
    openDb();
    
    if (exportImportArray.length > 10) {
        $("#page_top_link").css("display", "block");
    } else {
        $("#page_top_link").css("display", "none");
    }
    
    $("#add_btn").click(function() {
        addItem();
    });
    
    $("#update_btn").click(function() {
        updateItem();
    });
    
    $("#delete_btn").click(function() {
        deleteDB();
    });

    $("#export_btn").click(function() {
        exportData();
    });
    
    $("#import_btn").click(function() {
        importData();
    });
    
    $("#pagetop_btn").click(function() {
        $("html,body").animate({scrollTop:0},50);
		return false;
    });
});

// open db if null create db
function openDb() {
    var openRequest = indexedDB.open(dbName, 1);
    
    openRequest.onerror = function(e) {
        msg = "openDb " + dbName + " error. (" + e.currentTarget.error.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
    
    openRequest.onsuccess = function(evt) {
        db = openRequest.result;
        showAllData();
        
        msg = "openDb " + dbName + " success. (" + evt.currentTarget.readyState + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
    
    openRequest.onupgradeneeded = function(evt) {
        var pageStore = openRequest.result.createObjectStore(tblName, {keyPath:"id"});
        pageStore.createIndex("group_no_index", "group_no", { unique: false });
        pageStore.createIndex("show_no_index", "show_no", { unique: false });
        pageStore.createIndex("create_tm_index", "create_tm", { unique: true });
        
        msg = "openDb " + dbName + " upgrade success. (" + evt.currentTarget.readyState + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

// add item to db
function addItem() {
    try {
        var nowDate = new Date();
        var create_tm = nowDate.getFullYear().toString();
        create_tm += (parseInt(nowDate.getMonth()) + parseInt(1)).toString();
        create_tm += nowDate.getDate().toString();
        create_tm += nowDate.getHours().toString();
        create_tm += nowDate.getMinutes().toString();
        create_tm += nowDate.getSeconds().toString();
        create_tm += nowDate.getMilliseconds().toString();
        var show_name = document.getElementById("show_name").value;
        var link_url = document.getElementById("link_url").value;
        var group_no = document.getElementById("group_no").value;
        var show_no = document.getElementById("show_no").value;
        var show_title = document.getElementById("show_title").value;
        
        var dataObj = {
            "id":create_tm,
            "show_name":show_name,
            "link_url":link_url,
            "group_no":group_no,
            "show_no":show_no,
            "show_title":show_title,
            "create_tm":create_tm
        };
        
        var pageStore = db.transaction(tblName, "readwrite").objectStore(tblName);
        var addRequest = pageStore.add(dataObj);
        
        addRequest.onerror = function(e) {
            msg = "addItem error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        addRequest.onsuccess = function(evt) {
            sortArray = new Array();
            $("#show_data_table").html("").append("<tr><th>表示名</th><th>操作</th></tr>");
            showAllData();
            
            msg = "addItem " + dataObj.show_name + " success. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "addItem error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    } 
}

// update item to db
function updateItem() {
    try {
        var nowDate = new Date();
        var create_tm = nowDate.getFullYear().toString();
        create_tm += (parseInt(nowDate.getMonth()) + parseInt(1)).toString();
        create_tm += nowDate.getDate().toString();
        create_tm += nowDate.getHours().toString();
        create_tm += nowDate.getMinutes().toString();
        create_tm += nowDate.getSeconds().toString();
        create_tm += nowDate.getMilliseconds().toString();
        var data_id = document.getElementById("data_id").value;
        var show_name = document.getElementById("show_name").value;
        var link_url = document.getElementById("link_url").value;
        var group_no = document.getElementById("group_no").value;
        var show_no = document.getElementById("show_no").value;
        var show_title = document.getElementById("show_title").value;
        
        var dataObj = {
            "id":data_id,
            "show_name":show_name,
            "link_url":link_url,
            "group_no":group_no,
            "show_no":show_no,
            "show_title":show_title,
            "create_tm":create_tm
        };
        
        var pageStore = db.transaction(tblName, "readwrite").objectStore(tblName);
        var addRequest = pageStore.put(dataObj);
        
        addRequest.onerror = function(e) {
            msg = "updateItem error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        addRequest.onsuccess = function(evt) {
            sortArray = new Array();
            $("#show_data_table").html("").append("<tr><th>表示名</th><th>操作</th></tr>");
            showAllData();
            
            msg = "updateItem " + dataObj.show_name + " success. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "updateItem error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

// show item content
function showItemContent(data_id) {
    try {
        var pageStore = db.transaction(tblName).objectStore(tblName);
        var showRequest = pageStore.get(data_id.toString());
        
        showRequest.onerror = function(e) {
            msg = "showItemContent error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        showRequest.onsuccess = function(evt) {
            var cursor = evt.currentTarget.result;
            if(cursor != null){
                $("#data_id").val(cursor.id);
                $("#show_name").val(cursor.show_name);
                $("#link_url").val(cursor.link_url);
                $("#group_no").val(cursor.group_no);
                $("#show_no").val(cursor.show_no);
                $("#show_title").val(cursor.show_title);
                
                msg = "showItemContent " + cursor.show_name + " success. (" + evt.currentTarget.readyState + ")"; 
                console.log(msg);
                $("#msg_area").html("").append(msg);
            } else if (evt.currentTarget.readyState =="done") {
                msg = "showItemContent error. not found id=" + data_id + " (" + evt.currentTarget.readyState + ")"; 
                console.log(msg);
                $("#msg_area").html("").append(msg);
            }
        }
    } catch(e) {
        msg = "showItemContent error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

// show db content
function showAllData() {
    try {
        var pageStore = db.transaction(tblName).objectStore(tblName);
        var showRequest = pageStore.openCursor();
        
        showRequest.onerror = function(e) {
            msg = "showAllData error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        showRequest.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor != null) {
                sortArray.push(cursor.value);
                cursor.continue();
            }
            
            if (evt.currentTarget.readyState == "done") {
                sortArray.sort(function(a,b){
                    if(a.show_no < b.show_no) return -1;
                    if(a.show_no > b.show_no) return 1;
                    return 0;
                });
                
                var tmpStr = "";
                for(var i=0,j=1;i<sortArray.length;i++,j++) {
                    if (j%2==0) {
                        tmpStr += "<tr><td title='" + sortArray[i].show_title + "'>" + sortArray[i].show_name + "</td><td>";
                    } else {
                        tmpStr += "<tr><td title='" + sortArray[i].show_title + "' class='even'>" + sortArray[i].show_name + "</td><td class='even'>";
                    }
                    
                    tmpStr += "<form name='form" + sortArray[i].id + "' action='" + sortArray[i].link_url + "' target='_blank'>";
                    tmpStr += "<input type='hidden' name='test' value='test'>";
                    tmpStr += "<input type='submit' name='submit' value='Submit' class='btn_type02'>";
                    tmpStr += "<input type='button' name='edit_btn' id='edit_btn' value='Edit' onclick='showItemContent(\"" + sortArray[i].id.toString() + "\")' class='btn_type02'>";
                    tmpStr += "<input type='button' name='del_btn' id='del_btn' value='Delete' onclick='deleteItem(\"" + sortArray[i].id.toString() + "\")' class='btn_type02'>";
                    tmpStr += "</form></td></tr>";
                }
                $("#show_data_table").append(tmpStr);
            }
            
            msg = "showAllData process. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "showAllData error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

// delete db
function deleteDB() {
    try {
        var delRequest = indexedDB.deleteDatabase(dbName);
        
        delRequest.onerror = function(e) {
            msg = "deleteDB error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        delRequest.onsuccess = function(evt) {
            sortArray = new Array();
            $("#show_data_table").html("").append("<tr><th>表示名</th><th>操作</th></tr>");
            showAllData();
            
            msg = "deleteDB process. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "deleteDB error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

//export data
function exportData() {
    try {
        var pageStore = db.transaction(tblName).objectStore(tblName);
        var showRequest = pageStore.openCursor();
        
        showRequest.onerror = function(e) {
            msg = "exportData error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        showRequest.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor != null) {
                exportImportArray.push(cursor.value);
                cursor.continue();
            }
            
            if (evt.currentTarget.readyState == "done") {
                exportImportArray.sort(function(a,b){
                    if(a.create_tm < b.create_tm) return -1;
                    if(a.create_tm > b.create_tm) return 1;
                    return 0;
                });
                
                var tmpStr = "";
                for(var i=0;i<exportImportArray.length;i++) {
                    tmpStr += exportImportArray[i].id + ",";
                    tmpStr += exportImportArray[i].show_name + ",";
                    tmpStr += exportImportArray[i].link_url + ",";
                    tmpStr += exportImportArray[i].group_no + ",";
                    tmpStr += exportImportArray[i].show_no + ",";
                    tmpStr += exportImportArray[i].show_title + ",";
                    tmpStr += exportImportArray[i].create_tm + newLineStr;
                }
                $("#show_data_table")
                    .css("display", "none");
                $("#import_area")
                    .css("display", "none");
                $("#export_area")
                    .html("")
                    .css("display", "block")
                    .append(tmpStr);
                
                exportImportArray = new Array();
            }
            
            msg = "exportData process. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "exportData error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

//import data
function importData() {
    try {
        var importStr = $("#import_area").val();
        $("#show_data_table").css("display", "none");
        $("#export_area").css("display", "none");
        $("#import_area").css("display", "block");
        
        if (importStr != "") {
            if(exportImportArray.length <= 0) {
                exportImportArray = importStr.split(newLineStr);
            }

            var nowDate = new Date();
            var create_tm = nowDate.getFullYear().toString();
            create_tm += (parseInt(nowDate.getMonth()) + parseInt(1)).toString();
            create_tm += nowDate.getDate().toString();
            create_tm += nowDate.getHours().toString();
            create_tm += nowDate.getMinutes().toString();
            create_tm += nowDate.getSeconds().toString();
            create_tm += nowDate.getMilliseconds().toString();
            
            var start_index = 0;
            var data_array = exportImportArray[start_index++].split(",");
            var dataObj = {
                "id":create_tm,
                "show_name":data_array[start_index++],
                "link_url":data_array[start_index++],
                "group_no":data_array[start_index++],
                "show_no":data_array[start_index++],
                "show_title":data_array[start_index++],
                "create_tm":data_array[start_index++]
            };

            var pageStore = db.transaction(tblName, "readwrite").objectStore(tblName);
            var addRequest = pageStore.add(dataObj);

            addRequest.onerror = function(e) {
                msg = "importData error. (" + e.currentTarget.error.message + ")"; 
                console.log(msg);
                $("#msg_area").html("").append(msg);
            }

            addRequest.onsuccess = function(evt) {
                exportImportArray.shift();
                
                if (exportImportArray[0] != "") {
                    importData();    
                }
                
                msg = "importData success. (" + evt.currentTarget.readyState + ")"; 
                console.log(msg);
                $("#msg_area").html("").append(msg);
            }
        }
    } catch(e) {
        msg = "importData error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }
}

// delete item
function deleteItem(data_id) {
    try {
        var pageStore = db.transaction(tblName, "readwrite").objectStore(tblName);
        var delRequest = pageStore.delete(data_id.toString());
        
        delRequest.onerror = function(e) {
            msg = "deleteItem error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        delRequest.onsuccess = function(evt) {
            sortArray = new Array();
            $("#show_data_table").html("").append("<tr><th>表示名</th><th>操作</th></tr>");
            showAllData();
            
            msg = "deleteItem " + data_id + " success. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "deleteItem error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }  
}

// select item
function selectGroupItem(group_no) {
    try {
        var range = IDBKeyRange.only(group_no.toString());
        var pageStore = db.transaction(tblName).objectStore(tblName);
        var group_index = store.index("group_no_index");
        var selRequest = group_index.get(range);

        selRequest.onerror = function(e) {
            msg = "selectGroupItem error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        selRequest.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor != null) {
                showArray.push(cursor);
                cursor.continue();
            }
            
            if (evt.currentTarget.readyState == "done") {
                showArray.sort(function(a,b){
                    if(a.show_no < b.show_no) return -1;
                    if(a.show_no > b.show_no) return 1;
                    return 0;
                });
                
                var tmpStr = "";
                for(var i=0,j=1;i<showArray.length;i++,j++) {
                    if (j%5==0) {
                        tmpStr += "<tr>";
                    } else {
                        tmpStr += "<td title='" + showArray[i].show_title + "'>";
                        tmpStr += "<form name='form" + showArray[i].id + "' action='" + showArray[i].link_url + "' target='_blank'>";
                        tmpStr += "<input type='hidden' name='test' value='test'>";
                        tmpStr += "<input type='submit' name='submit' value='" + showArray[i].show_name + "' class='btn_type02'>";
                        tmpStr += "</form></td>";
                    }
                    
                    if (j%5==0) {
                        tmpStr += "</tr>";
                    }
                }
                $("#showGroupData").html("").append(tmpStr);
            }
            
            msg = "selectGroupItem process. (" + evt.currentTarget.readyState + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
    } catch(e) {
        msg = "selectGroupItem error. (" + e.message + ")"; 
        console.log(msg);
        $("#msg_area").html("").append(msg);
    }    
}