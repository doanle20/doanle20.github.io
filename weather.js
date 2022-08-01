
console.log("I'm still running");

// Initialization
const DATE_INPUT=document.getElementById("date_input");
const DAYS_BEFORE = 15;
const DAYS_AFTER = 5;
const TEMP_LIMITS=[50,65,80,95,100];
const COLOR=['#cce4ff',"#3d8de3","#45bf9b","#f5c542","#f57e42","#e3ba98"];

test_date= new Date(window.localStorage["current"]);
if (test_date=="Invalid Date"){
    DATE_INPUT.value="2022-02-20"
}else{
    DATE_INPUT.value=window.localStorage["current"];
}
update();

//Event Listeners
DATE_INPUT.addEventListener('change',function(e){
    update();
});
document.getElementById("next").addEventListener('click', function(e){
    DATE_INPUT.value=adjustDays(DATE_INPUT.value,1);
    update();
})

//Functions
function update(){
    const current=DATE_INPUT.value;
    window.localStorage["current"]=current;
    const start=adjustDays(current,-1*DAYS_BEFORE);
    const end=adjustDays(current,DAYS_AFTER);

    const params={"sid":"414300","sdate":start,"edate":end,"elems":"maxt"};
    
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
            const result=JSON.parse(text);
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
    let result=new Date(date);
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
    

    for(var t in TEMP_LIMITS){
        if (temp<TEMP_LIMITS[t]){
            return COLOR[t]
        }
    }
    return COLOR[COLOR.length-1]
  };

