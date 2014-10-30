/**
* Object for console-works with tabs
* @property {array} viewHistory     - array of objects, stores the tabs view history.
* @property {array} commandHistory  - array stores the called commands.
* @property {unsigned int} point    - pointer to the display command from the commands history.
*/
var tabs = {
  viewHistory : [],
  commandHistory : [],
  point : 0,
  /**
  * Select required tab
  * @param {object} chosen tab
  * @this {object} tabs
  * @throws {invalid parameter} or {Can not find required tab}
  * @return {string} log message
  */
  selectTab : function(tabNum){
    //check for valid params
    var returnMessage = '';
    if (tabNum && (tabNum.length > 1) || /\D/.test(tabNum)  ){
      returnMessage = 'bad input params';
      return returnMessage;
    }else 
      tabNum = Number(tabNum);
    //check for the existence of tab
    var isExist = this.checkExistTab(tabNum);
    if ( isExist ){
      $('li#'+tabNum).click();
      //return log message
      returnMessage = 'Changed tab #'+tabNum;
      return returnMessage;
    }else{
      returnMessage = 'Can not find '+tabNum+' tab. '
      returnMessage += this.availableTabs();
      return returnMessage;
    }
  },
  /**
  * Swap tabs
  * @param {object} array of swapping tabs - [index1,index2]
  * @this {object} tabs
  * @return {string} log message
  */
  swapTabs : function(swapTabs){
    //check for valid params 
    if ( !( swapTabs && swapTabs.length == 2) ){
      return ('bad input params');
    }
    var returnMessage = '';
    var firstTabName = swapTabs[0];
    var secondTabName = swapTabs[1];
    var isExistfirstTab = this.checkExistTab(firstTabName);
    var isExistsecondTab = this.checkExistTab(secondTabName);
    if ( isExistfirstTab && isExistsecondTab ){
      //get content of tabs
      var ContentfirstTabName = $('.tab-content_'+firstTabName).html();
      var ContentsecondTabName = $('.tab-content_'+secondTabName).html();
      //swap content
      $('.tab-content_'+firstTabName).html(ContentsecondTabName);
      $('.tab-content_'+secondTabName).html(ContentfirstTabName);
      //swap names
      var nameOfFirstTab = $('li#'+firstTabName+'>a').text();
      var nameOfSecondTab = $('li#'+secondTabName+'>a').text();
      $('li#'+firstTabName+'>a').text(nameOfSecondTab);
      $('li#'+secondTabName+'>a').text(nameOfFirstTab);
      //return log message
      returnMessage = 'swaped tabs "'+nameOfFirstTab+'" and "'+nameOfSecondTab+'"';
      return returnMessage;
    }else{
      var returnMessage = 'tabs #'+(isExistfirstTab == 0 ? firstTabName : secondTabName)+' does not exist. ';
      returnMessage += this.availableTabs();
      return returnMessage;
    }
  },
  /**
  * Show statistics viewing  tabs
  * @return {string} log message
  */
  showStat : function(){
    var showTime = new Date();
    var sessionTime = ( showTime - this.viewHistory[0]['data']['time'] )/1000;
    var statMessage = '';
    var viewingTime = 0;
    for(var i=0; i<this.viewHistory.length; i++){
      if (this.viewHistory[i]['action'] == 'selectTab'){
        //this is last selected tab
        if (this.viewHistory[i+1])
          viewingTime = ( this.viewHistory[i+1]['data']['time'] - this.viewHistory[i]['data']['time'] )/1000;
        else 
          viewingTime = ( showTime - this.viewHistory[i]['data']['time'] )/1000;
        statMessage += '<br>' + i+':' + ' select tab "' + this.viewHistory[i]['data']['tabName'] + '" - ' + viewingTime + ' second(s)';
      }
    };
    return statMessage;
  },
  /**
  * Calling the required command
  * @this {object} tabs
  * @param {string} calling function with parameters
  * @throws {unknown command} 
  * @return {string} response of the called function
  */
  checkValid : function(callFunction){
    var functionName = callFunction.replace(/\(.*?\)/, '');
    var functionParam = callFunction.match(/\((.+)\)/);
    //get params
    if (functionParam){
      functionParam = functionParam[1].split(',');
    }
    //trying to call the function
    if (this[functionName])
      return this[functionName](functionParam);
    else
      return ('Unknown command. Check the <b>info</b>.');
  },
  /**
  * The entry point. Displays the response of the  console functions.
  * @this {object} tabs
  * @param {string} calling function with params
  * @return status message in $('.console-log')
  */
  logMessage : function(callFunction){
    //save command in history
    this.commandHistory.push(callFunction);
    //move point to last command
    this.point = this.commandHistory.length-1;
    var message = this.checkValid(callFunction);
    $('.console-log').append(message+'<br>/> ');
    //scroll log screen
    var consoleObj = $('.console-log')[0];
    consoleObj.scrollTop = consoleObj.scrollHeight;
  },
  /**
  * Checking for the existence of tab
  * @param {unsigned int} number of tab
  * @return {boolean} 1 - exist; 0 - !exist
  */
  checkExistTab : function(tabNum){
    if ( !/\D/.test(tabNum) && $('li#'+tabNum).length )
      return 1;
    else 
      return 0;
  },
  /**
  * Find number of the first and the last available tabs 
  * @return {string} 'Tabs are available from '+firstTab+' to '+lastTab+'.'
  */
  availableTabs : function(){
    var firstTab = $('li:first').attr('id');
    var lastTab = $('li:last').attr('id');
    return ('Tabs are available from '+firstTab+' to '+lastTab+'.');
  },
  /**
  * Show information about commands
  * @return {string} info about commands
  */
  info : function(){
    var info = '<br><b>selectTab(tabNum)</b>       - select tab: #tabNum';
    info += '<br><b>swapTabs(tabNum1,tabNum2)</b>  - swap tabs - #tabNum1 and #tabNum2';
    info += '<br><b>showStat()</b>                 - show statistics viewing  tabs';
    return info;
  }
};

$(document).ready(function(){
  //time of start working
  tabs.viewHistory = [{ 'action': 'selectTab', 'data': { 'tabName': 'default', 'time': new Date()} }];
  /**
  * Change tab
  * @this {object} chosen tab-head ('li')
  */
  $('li').click(function(){
    //get new and last tab IDs
    var lastID = $('.chosen').attr('id');
    var newID = $(this).attr('id');
    //change display tab content
    $('.tab-content_'+lastID).css({display: "none"});
    $('.tab-content_'+newID).css({display: "block"});
    //change selected tab
    $('.chosen').removeClass('chosen');
    $(this).addClass('chosen');
    //push operation in history
    tabs.viewHistory.push({'action': 'selectTab', 'data': {'time': new Date(), 'tabName': $(this).text()} });
  });
  //press the Exec button
  $('.commandExec').click(function(){
    var commandLineValue = $('.commandLine').val();
    tabs.logMessage(commandLineValue);
  });
  //listening for Enter in command line
  $('.commandLine').keypress(function(e){
    if(e.keyCode==13)
      $('.commandExec').click();
  });
  //listening for arrow keys in command line
  $('.commandLine').keydown(function(e){
    if(e.keyCode==38){
      if(tabs.point > 0)
        tabs.point--;
      $('.commandLine').val(tabs.commandHistory[tabs.point]);
    }
    if(e.keyCode==40){
      if(tabs.point < tabs.commandHistory.length)
        tabs.point++;
      $('.commandLine').val(tabs.commandHistory[tabs.point]);
    }
  });
  //hide-button
  $('.console-head-control_hide').click(function(){
    var status = $('.console-log').css('display');
    if ( status!= 'none'){
      $('.console-log').css('display','none');
      $('.console').css('min-height','0px');
      $('.console').css('height','10%');
    }
    else{
      $('.console-log').css('display','block');
      $('.console').css('min-height','300px');
      $('.console').css('height','70%');
    }
  });
});