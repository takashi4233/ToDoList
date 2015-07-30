var tasklist = [];

$(function(){
		function init(){
			if (!localStorage.getItem('uniqId')) {
				localStorage.setItem('uniqId',0);
			}

			$('#tbl-todo').find("tr:gt(0)").remove();

			queryTasks();

			for (var i = 0; i < tasklist.length ; i++) {   
				$('tbody tr:last').after("<tr><td><input type='button' value='Done' class='btn-done-task'></td><td class='taskName'>"+tasklist[i].split("|")[1]+"</td><input type='hidden' class='taskId' value='"+tasklist[i]+"'></tr>");
			}

			$(".btn-done-task").on('click',function(){
				var idx = parseInt($('.btn-done-task').index(this));
				var td = $('.taskId:eq('+idx+')').val();
				var ss = td.split("|");
				updateTask(ss[0],"",0);
				init();
			}) ;

		};
		
		init();

		/**
		 * Press Enter Key then submit and clear textbox.
		 */
		$('#taskName').keypress( function ( e ) {
			if ( e.which == 13 ) {
				var taskName = $('#taskName').val();
				if (!taskName) {
					alert('Please input taskname first.');
					return false;
				}
				insertTask(taskName);
				init();
				$("#taskName").val('');
			}
		});


		/* add button */
		$("#btn-add-task").click(function(){
				var taskName = $('#taskName').val();
				if (!taskName) {
					alert('Please input taskname first.');
					return false;
				}
				insertTask(taskName);
				init();
				$("#taskName").val('');
		});

		/* clear button */
		$("#btn-clear-task").click(function(){
			queryTasks();
  			if(confirm('Do you delete localStorage?')){
				clearLocalStorage();
				$('#tbl-todo').find("tr:gt(0)").remove();
			}
		});
		
	/*  delete localStorage */
	function clearLocalStorage(){
		localStorage.clear();
		localStorage.setItem('uniqId',0);
	}
	
	/* insertTask */
	function insertTask(taskName) {
		var data = {
			taskName	:taskName,
			validFlg	:1,			//1:valid,0:invalid
			createDate	:new Date()
		};
		/* increment uniqId */
		localStorage.setItem('uniqId',parseInt(localStorage.getItem('uniqId'))+1);
		/* insert localStorage */
		var maxUniqId = localStorage.getItem('uniqId');
		localStorage.setItem(maxUniqId,JSON.stringify(data));
	}

	/* update task Information(now just validflg) */
	function updateTask(id,taskName,validFlg) {
		var json = JSON.parse(localStorage.getItem(parseInt(id)));
		json.validFlg = validFlg;
		localStorage.setItem(parseInt(id),JSON.stringify(json));
	}

	/* query TaskList */
	function queryTasks(){
		var maxUniqId = parseInt(localStorage.getItem('uniqId'));
		tasklist = [];
		for (var i = 1; i <= maxUniqId;i++) {
			var json = JSON.parse(localStorage.getItem(String(i)));
			if (json.validFlg == 1) {
				tasklist.push(i+"|"+json.taskName);
			}
		}
	}
});