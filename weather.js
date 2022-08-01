
console.log("I'm still running");

// Initialization
if (!("current" in window.localStorage)){
    window.localStorage["current"]="2022-02-20"
}else if(window.localStorage['current'].length!=10){
    window.localStorage["current"]="2022-02-20"
}
date_input=document.getElementById("date_input")
date_input.value=window.localStorage["current"]
update(date_input.value,5,5)

//Event Listeners
date_input.addEventListener('change',function(e){
    update(date_input.value,5,5);
});
document.getElementById("next").addEventListener('click', function(e){
    date_input.value=adjustDays(date_input.value,1);
    update(date_input.value,5,5);
})

//Functions
function update(current,days_before,days_after){
    window.localStorage["current"]=current
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

    fetch("https://data.rcc-acis.org/StnData?"+formatParams(params))
        .then(response=>response.text())
        .then(function(text){
            result=JSON.parse(text);
            const table = document.getElementById("temp_table")
            while (table.rows.length>1){
                table.deleteRow(1);
            }
            for (let i=result.data.length-1;i>=0;i--){
                document.getElementById("temp_table").appendChild(addRow(result.data[i][0],result.data[i][1],current));
            }
        })
        .catch(error => {
            console.log("hi")
        });
}
function adjustDays(date,days){
    result=new Date(date);
    result.setDate(result.getDate()+days);
    result=result.toJSON().slice(0,10);
    return result;
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

  };
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
};
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
  };

