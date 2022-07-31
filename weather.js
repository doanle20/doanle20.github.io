
console.log("I'm still running");
if ((~"current" in window.localStorage)){
    window.localStorage["current"]="2022-02-20"
}
date_input=document.getElementById("date_input")
date_input.value=window.localStorage["current"]
update()

date_input.addEventListener('change',function(e){
    update();
});
document.getElementById("next").addEventListener('click', function(e){
    date_input.value=adjustDays(date_input.value,1);
    update();
})
function update(){
    window.localStorage["current"]=date_input.value
    getData(date_input.value,5,5)
}
function adjustDays(date,days){
    result=new Date(date);
    result.setDate(result.getDate()+days);
    result=result.toJSON().slice(0,10);
    return result;

}
function getData(current,days_before,days_after){
start=adjustDays(current,-1*days_before);
end=adjustDays(current,days_after);

params={"sid":"414300","sdate":start,"edate":end,"elems":"maxt"};
function formatParams( params ){
    return Object
          .keys(params)
          .map(function(key){
            return key+"="+encodeURIComponent(params[key])
          })
          .join("&")
  }

url="http://data.rcc-acis.org/StnData?"+formatParams(params)
let request = new XMLHttpRequest();
request.open("GET",url);
request.send();
request.onload = function() {
    if (request.status != 200) { // analyze HTTP status of the response
        console.log(`Error ${request.status}: ${request.statusText}`); // e.g. 404: Not Found
    } 
    else { // show the result
        result=JSON.parse(request.response);
        writeTable(current,result);

    }
  };
};

function writeTable(current,result){
    const table = document.getElementById("temp_table")
    while (table.rows.length>1){
        table.deleteRow(1);
    }
    for (let i=result.data.length-1;i>=0;i--){
        document.getElementById("temp_table").appendChild(addRow(result.data[i][0],result.data[i][1],current));
    }
}

function addRow(date,temp,current){
    const row=document.createElement("tr")
    row.appendChild(addCell("date",date));
    row.appendChild(addCell("temp",temp));
    row.appendChild(addCell("color",selectColor(temp)));

    if (date==current){
        row.setAttribute("id","current")
    }
    return row;

  }
function addCell(type,text){
    const cell = document.createElement("td");

    if (type=="color"){
        cell.style.backgroundColor=text;
    }else{
        const cellText = document.createTextNode(text);
        cell.appendChild(cellText);
    }
    
    cell.setAttribute("class",type);
    return cell
}
function selectColor(temp){
    if (temp=="M"){
        return "gray"
    }
    temp=parseInt(temp)
    
    temp_limits=[50,65,75,85,95,100];
    color=['#cce4ff',"#3d8de3","#45bf9b","#f2e766","#f59b42","#e6714e","#e3ba98"];
    for(var t in temp_limits){
        if (temp<temp_limits[t]){
            return color[t]
        }
    }
    return color[color.length-1]
  }

