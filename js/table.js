//fetch로 데이터 받아오기////////////////////////////

url ; // 회사용 API 주소 삭제

const rawData = fetch(url)
.then((response) => response.json())
.catch((err) => console.log("err:", err))


//들어온 값에 따라 테이블에 출력된 결과물 생성/////////////////////////////////////////

function dateFilterSection(endDateIndex,startDateIndex) {
  rawData.then((jsonData) => {
    let tags = '';
    let cumPnl = '';
    let cumReturn = '';
    if (isNaN(startDateIndex) === true) {
      startDateIndex = jsonData.data.fund_nav_list.length;
    } else if(startDateIndex < jsonData.data.fund_nav_list.length) {
      startDateIndex = startDateIndex;
    } else { 
      startDateIndex = jsonData.data.fund_nav_list.length
    };      
    for (let i = startDateIndex-1; i > endDateIndex-1; i--){
      const datetime = jsonData.data.fund_nav_list[i].datetime;
      const pnl = jsonData.data.fund_nav_list[i].pnl;
      if (i<startDateIndex-1) {
        Return = (jsonData.data.fund_nav_list[i].nav - jsonData.data.fund_nav_list[i+1].nav)*100
      } else {
        Return =0;
      }
      cumReturn = Number(cumReturn) + Number(Return)
      cumPnl = Number(cumPnl) +  Number(pnl);
      const tag = `<tr><td scope="row">${datetime.slice(0,16)}</td><td>${Number(pnl).toFixed(4)}</td><td>${Number(cumPnl).toFixed(4)}</td><td>${Number(Return).toFixed(2)}</td><td>${Number(cumReturn).toFixed(2)}</td></tr>`;
      tags = tag + tags;
    }
    document.querySelector('#tbody').innerHTML=tags;
  })
}
dateFilterSection(0);

////datepicker 최소일, 최대일 만들어주는 함수/////////////////////////////////////////////

function dateMin(){
  rawData.then((arr) => {
    const startDate = document.getElementById('startDate');
    const i = arr.data.fund_nav_list.length-1;
    const startMin = arr.data.fund_nav_list[i].datetime.slice(0,10);
    const max = arr.data.fund_nav_list[0].datetime.slice(0,10);
    startDate.setAttribute("min",startMin);
    startDate.setAttribute("max",max);
  });
}

function dateMax(dateMinValue){
  rawData.then((arr) => {
    const endDate = document.getElementById('endDate');
    const i = arr.data.fund_nav_list.length-1;
    const max = arr.data.fund_nav_list[0].datetime.slice(0,10);
    if (dateMinValue === undefined) {
      endMin = arr.data.fund_nav_list[i].datetime.slice(0,10)
    } else { endMin = dateMinValue
    } 
    endDate.setAttribute("min",endMin);
    endDate.setAttribute("max",max);
  })
}

dateMin();
dateMax();
document.getElementById('startDate').addEventListener("input",(a) =>{dateMax(a.target.value)});

///달력에 들어온 날짜 범위로 보여줌 // startDate가 EndDate보다 빠르지 않으면 입력못하게 막는 기능 필요////////////////////////////////////////////

function datePicker() {
  const startDate = document.querySelector("#startDate").value;
  const endDate = document.querySelector("#endDate").value;
  rawData.then((arr) => {
    let startDateIndex = 0;
    let endDateIndex = 0;
    while(true) {
      let isStartDate = arr.data.fund_nav_list[startDateIndex].datetime.includes(startDate);
      if(isStartDate === true) {
        break;
      }
      startDateIndex++;
    }
    while(true) {
      let isEndDate = arr.data.fund_nav_list[endDateIndex].datetime.includes(endDate);
      if(isEndDate === true) {
        break;
      }
      endDateIndex++;
    }
    dateFilterSection(endDateIndex,startDateIndex+1);
    const current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
  })
}


/////////////////////////////////////////////////////////////////////


const btnGroup = document.querySelector(".btn-group");
const btns = btnGroup.getElementsByClassName("btn");


//////버튼을 active 상태로 바꿔줌//datepicker 상태일땐 아무것도 active 안되게 바꿔야할 듯////////////////////////////////////////////////////


for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    const current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}


btns[0].addEventListener("click", function(){
  dateFilterSection(0);
})
btns[1].addEventListener("click", function(){
  dateFilterSection(0,7);
})
btns[2].addEventListener("click", function(){
  dateFilterSection(0,31);
})
btns[3].addEventListener("click", function(){
  dateFilterSection(0,61);
})
btns[4].addEventListener("click", function(){
  dateFilterSection(0,365); // 오류 발생 ()
})



//Pagination/////////////////////////////////////////


//Table sort// 날짜 데이터 정규식 이용해서 숫자로 바꿔주는 기능 추가해야함////////////////////////////////////////

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.querySelector(".table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

///날짜 sorting용 함수, 정규식 공부해서 위의 함수로 통합시켜야함////////////////////////////

function sortDate(n) {
  const regex = /[^0-9]/g;
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.querySelector(".table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.replace(regex,"") > y.innerHTML.replace(regex,"")) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.replace(regex,"") < y.innerHTML.replace(regex,"")) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

