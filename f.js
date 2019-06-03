function f (filter){  
    if(filter == undefined){
        console.error("Missing arguments!\n f(filter)");
        return;
    }

    if(filter.includes("#"))
        return document.getElementById(filter.split('#')[1]);
    else if(filter.includes("."))
        return document.getElementsByClassName(filter.split('.')[1]);
    else if(filter.includes("@"))
        return document.getElementsByName(filter.split('@')[1]);
    else
        return document.getElementsByTagName(filter);
}

function fAll (filter,command){
    if(filter == undefined || command == undefined){
        console.error("Missing arguments!\n fAll(filter,command)");
        return;
    }

    var components;
    if(filter.includes("#"))
        components = document.getElementById(filter.split('#')[1]);
    else if(filter.includes("."))
        components = document.getElementsByClassName(filter.split('.')[1]);
    else if(filter.includes("@"))
        components = document.getElementsByName(filter.split('@')[1]);
    else
        components = document.getElementsByTagName(filter);

    var result = [];
    if(typeof(command) == "function"){
        for(var i =0 ; i < components.length; i++){
            result.push(command(components[i]));
        }
    }else{
        for(var i =0 ; i < components.length; i++){
            if(command.includes(",")){
                var commands = command.split(",");
                var inResult = {};
                for(var x = 0; x < commands.length; x++){
                    inResult[commands[x]] = eval("components[i]." + commands[x]);
                }
                result.push(inResult);
            }else{
                result.push(eval("components[i]." + command));
            }
        }
    }

    return result;
}

function fConvert(toConvert){
    if(toConvert == undefined){
        console.error("Missing arguments!\n fConvert(var)");
        return;
    }
    var result;
    if(typeof(toConvert) == "object"){ 
        result = "";
        for(var i = 0; i < toConvert.length; i++){
            if(i != 0)
                result += ",";

            result += toConvert[i];
        }
    }else{
        if(toConvert.includes(",")){
            result = toConvert.split(",");
        }
    }
    return result;
}

function fGet(url,callback){
    if(url == undefined || callback == undefined){
        console.error("Missing arguments!\n fGet(url,callback)");
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function fPost(url,params,callback){
    if(url == undefined || callback == undefined || params == undefined){
        console.error("Missing arguments!\n fPost(url,params,callback)");
        return;
    }
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(xhttp.responseText);
        }
    }
    http.send(params);
}

function fTime(callback,time,times){
    if(callback == undefined || time == undefined){
        console.error("Missing arguments!\n fTime(callback,time,times)");
        return;
    }
    if(times != undefined){
        for(var i = 0; i < times; i++){
            setTimeout(() => {
                callback();
            }, 1000 * time * i);
        }
    }else{
        return setInterval(() => {
            callback();
        }, 1000 * time);
    }
}

function fStop(ft){
    if(ft == undefined){
        console.error("Missing arguments!\n fStop(interval)");
        return;
    }
    clearInterval(ft);
}

function fInit(callback){
    if(callback == undefined){
        console.error("Missing arguments!\n fInit(callback)");
        return;
    }
    window.addEventListener("load",function(){ 
        setTimeout(() => {
            callback();
        }, 100);
    });
}

function fEvent(elem,event,callback){
    if(elem == undefined || event == undefined || callback == undefined){
        console.error("Missing arguments!\n fEvent(element,event,callback)");
        return;
    }
    elem.addEventListener(event,callback(e));
}

function fOnly(elem,only){
    if(elem == undefined || only == undefined){
        console.error("Missing arguments!\n fOnly(element,keys)");
        return;
    }
    elem.addEventListener("keypress",function(e){   
        if(!only.includes(e.key))
            e.preventDefault();
    });
}

function fMask(elem,mask){
    if(elem == undefined || mask == undefined){
        console.error("Missing arguments!\n fMask(element,mask)");
        return;
    }
    elem.addEventListener("keypress",function(e){   
        if(elem.value.length >= mask.length){
            e.preventDefault();
            return;
        }
        if(mask[elem.value.length] != "_"){
            e.preventDefault();
            elem.value += mask[elem.value.length] + e.key;
        }
    });
}

var grid_selected = null;
function fGrid(list,elem,options){
    if(elem == undefined || list == undefined){
        console.error("Missing arguments!\n fGrid(list,element,options)");
        return;
    }
    grid_selected = null;

    if(f("#grid") != null)
        f("#grid").remove();

    if(options == undefined)
        options = {
            trAtribs : "",
            tdAtribs : "bgcolor='#d8d8d8' style='cursor: pointer;-webkit-user-select:none'",
            thAtribs : "bgcolor='#4286f4' style='color: white;-webkit-user-select:none'",
            onselected : function(e){ e.style.backgroundColor = '#999999'; },
            onunselected : function(e){ e.style.backgroundColor = '#d8d8d8'; },
            onhover : function(e){ e.style.backgroundColor = '#cccccc'; },
            onout : function(e){ e.style.backgroundColor = '#d8d8d8'; },
            onclick : function(e){ console.log(e.id.split('_')[1]); },
            result : function(e){ console.log(e); }
        };

    if(options.trAtribs == undefined)
        options.trAtribs = "";
    if(options.result == undefined)
        options.result = function(e){ console.log(e); };
    if(options.onselected == undefined)
        options.onselected = function(e){ e.style.backgroundColor = '#999999'; };
    if(options.onunselected == undefined)
        options.onunselected = function(e){ e.style.backgroundColor = '#d8d8d8'; };
    if(options.tdAtribs == undefined)
        options.tdAtribs = "bgcolor='#d8d8d8' style='cursor: pointer;-webkit-user-select:none'";
    if(options.thAtribs == undefined)
        options.thAtribs = "bgcolor='#4286f4' style='color: white;-webkit-user-select:none'";
    if(options.onhover == undefined)
        options.onhover = function(e){ e.style.backgroundColor = '#cccccc'; };
    if(options.onclick == undefined)
        options.onclick = function(e){ console.log(e.id.split('_')[1]); };
    if(options.onout == undefined)
        options.onout = function(e){ e.style.backgroundColor = '#d8d8d8'; };

    var toHTML = "";

    if(options.tableAtribs == undefined){
        toHTML = '<table width="1000" align="center" cellpadding="4" cellspacing="2" bgcolor="gray" align="center" id="grid" name="grid">';
    }else{
        toHTML = '<table '+options.tableAtribs+'>';
    }

    var keys = Object.keys(list);
    toHTML += "<tr "+options.trAtribs+">";
    for(var i = 0; i < keys.length; i++){
        toHTML += "     <th "+options.thAtribs+">";
        toHTML +=               keys[i];
        toHTML += "     </th>";
    }
    toHTML += "</tr>";

    var s = "";
    for(var i = 0; i < keys.length; i++){
        if(i != 0)
            s += ",";

        if(typeof(list[keys[i]]) == "object")
            s += list[keys[i]].length;
        else{
            list[keys[i]] = [list[keys[i]]];
            s += 1;
        }
    }
    var max = eval("Math.max("+s+")");

    for(var x = 0; x < max; x++){
        toHTML += "<tr "+options.trAtribs+">";
        for(var i = 0; i < keys.length; i++){
            toHTML += "<td id='"+keys[i]+"_"+x+"' "+options.tdAtribs+" name="+x+">";
            toHTML +=       (list[keys[i]][x] != undefined) ? list[keys[i]][x] : "";
            toHTML += "</td>";
        }
        toHTML += "</tr>";
    }

    toHTML += '</table>';

    elem.innerHTML = toHTML;

    for(var x = 0; x < max; x++){
        for(var i = 0; i < keys.length; i++){
            f("#"+keys[i]+"_"+x).addEventListener("click",function(){
                var id = this.id.split('_')[1];
                if(options.onunselected != undefined && options.onunselected != ''){
                    if(grid_selected != null){
                        var row = f("@"+grid_selected.id.split('_')[1]);
                        for(var i = 0; i < row.length; i++){
                            options.onunselected(row[i]);
                        }
                    }
                }
                if(options.onselected != undefined && options.onselected != ''){
                    var row = f("@"+id);
                    for(var i = 0; i < row.length; i++){
                        options.onselected(row[i]);
                    }
                }

                grid_selected = this;

                if(options.onclick != undefined && options.onclick != '')
                    options.onclick(this);
                    
                if(options.result != undefined && options.result != ''){
                    var keys = Object.keys(list);
                    var results = [];
                    for(var i = 0; i < keys.length; i++){
                        results.push(list[keys[i]][id]);
                    }
                    options.result(results);
                }
            });
            f("#"+keys[i]+"_"+x).addEventListener("mouseover",function(){
                var id = this.id.split('_')[1];
                if(options.onhover != undefined && options.onhover != '' && grid_selected != this){
                    var row = f("@"+id);
                    for(var i = 0; i < row.length; i++){
                        options.onhover(row[i]);
                    }
                }
            });
            f("#"+keys[i]+"_"+x).addEventListener("mouseout",function(){
                var id = this.id.split('_')[1];
                if(options.onout != undefined && options.onout != '' && grid_selected != this){
                    var row = f("@"+id);
                    for(var i = 0; i < row.length; i++){
                        options.onout(row[i]);
                    }
                }
            });
        }
    }
}

function fIndex(array,value,onlyone){
    if(array == undefined || value == undefined){
        console.error("Missing arguments!\n fIndex(array,value,onlyone)");
        return;
    }
    var result = null;

    if(onlyone == undefined)
        onlyone = false;

    for(var i = 0; i < array.length; i++){
        if(array[i] == value){
            if(result == null)
                result = i;
            else if(onlyone == false)
                result += ","+i;
        }
    }
    if(typeof(result) != "number"){
        return fConvert(result).map(function(item) {
            return parseInt(item);
        });
    }else{
        return result;
    }
}

function fAssoc(array,value,onlyone){
    if(array == undefined || value == undefined){
        console.error("Missing arguments!\n fAssoc(array,value,onlyone)");
        return;
    }
    var result = null;
    var keys = Object.keys(array);

    if(onlyone == undefined)
        onlyone = false;

    for(var i = 0; i < keys.length; i++){
        if(array[keys[i]] == value){
            if(result == null)
                result = keys[i];
            else if(onlyone == false)
                result += ","+keys[i];
        }
    }
    if(result.includes(",")){
        return fConvert(result);
    }else{
        return result;
    }
}