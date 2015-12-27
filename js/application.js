(function() {
	var db = new Dexie("todos-dexie");
	var input = $('input')[0];
	var ul = $('ul')[0];
	$("#inputForm").submit(addItem);
	$("body").click(onClick);


	db.version(1).stores({ todo: '_id' })
	db.open()
		.then(refreshView);

	function onClick(e) {
		e.preventDefault();
		var button = $(e.target);

		if (button.hasClass("delete")) {
			db.todo.where('_id').equals(button.parent().attr('id')).delete()
				.then(button.parent().hide("slow"));
		}

		if (button.hasClass("edit")) {
				var temp = button.next().text();
				button.next().remove();
				button.parent().append('<form id="editForm"><input type="text" value='+temp+' /></form>')
				
				$("form#editForm > input").focus(function() { $(this).select(); } );
				$("#editForm").children().focus();
				$("button").prop("disabled", true);

				$("#editForm").submit(function(e){
					e.preventDefault();

					db.todo.update(button.parent().attr('id'), { text: $("#editForm").children().val() })
						.then(refreshView).then($("button").prop("disabled", false));
				});
		}
	}

	function addItem(e) {
		e.preventDefault();
		db.todo.put({ text: input.value, _id: String(Date.now()) })
			.then(function() {
				input.value = '';
			})
			.then(refreshView);
	}

	function updateItem(e) {
		e.preventDefault();
		db.todo.put({ text: input.value, _id: String(Date.now()) })
			.then(function() {
				input.value = '';
			})
			.then(refreshView);
	}

	function refreshView() {
		return db.todo.toArray()
			.then(renderAllTodos);
	}

	function renderAllTodos(todos) {
		var html = '';
		todos.forEach(function(todo) {
			html += todoToHtml(todo);
		});
		ul.innerHTML = html;
	}

	function todoToHtml(todo) {
		return '<li id="'+todo._id+'"><button class="delete"></button><button class="edit"></button><b class="content">'+
		todo.text+
		'</b></li>';
	}
}());
