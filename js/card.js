//운용일,누적수익률,total balance 표시//////////////////////////////////////////////
function displayCard(){
  rawData.then((jsonData) => {
    document.querySelector(".inception").innerHTML = `${jsonData.data.fund_nav_list.length}days`;
    document.querySelector(".return").innerHTML = `${Number(((jsonData.data.fund_nav_list[0].nav/jsonData.data.fund_nav_list[jsonData.data.fund_nav_list.length-1].nav)-1)*100).toFixed(2)}%`;
    document.querySelector(".balance").innerHTML = `$${Number(jsonData.data.curr_balance).toFixed(4)}`;
  })
}

displayCard();