// global variables define
var db = null;
var dbName = "topPageDb";
var tblName = "topPageTbl";
var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
var msg = "";
var showArray = new Array();

$(function(){
    openDb();
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
        selectGroupItem("96");
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

// select item
function selectGroupItem(group_no) {
    try {
        var range = IDBKeyRange.only(group_no.toString());
        var pageStore = db.transaction(tblName).objectStore(tblName);
        var group_index = pageStore.index("group_no_index");
        var selRequest = group_index.openCursor(range);

        selRequest.onerror = function(e) {
            msg = "selectGroupItem error. (" + e.currentTarget.error.message + ")"; 
            console.log(msg);
            $("#msg_area").html("").append(msg);
        }
        
        selRequest.onsuccess = function(evt) {
            var cursor = evt.target.result;
            
            if (cursor != null) {
                showArray.push(cursor.value);
                cursor.continue();
            }
            
            if (evt.currentTarget.readyState == "done") {
                showArray.sort(function(a,b){
                    if(a.show_no < b.show_no) return -1;
                    if(a.show_no > b.show_no) return 1;
                    return 0;
                });
                
                var tmpStr = "";
                for(var i=0;i<showArray.length;i++) {
                    if (i%5==0) {
                        tmpStr += "<tr>";
                    }
                    
                    tmpStr += "<td title='" + showArray[i].show_title + "'>";
                    tmpStr += "<form name='form" + showArray[i].id + "' action='" + showArray[i].link_url + "' target='_blank'>";
                    tmpStr += "<input type='hidden' name='test' value='test'>";
                    tmpStr += "<input type='submit' name='submit' value='" + showArray[i].show_name + "' class='btn_type02'>";
                    tmpStr += "</form></td>";
                    
                    if (i!=0&&i%5==0) {
                        tmpStr += "</tr>";
                    }
                }
                showArray = new Array();
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