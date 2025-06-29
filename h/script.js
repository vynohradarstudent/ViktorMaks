$(document).ready(function () {
  let toDOList = [];

  if (localStorage.getItem("toDOList")) {
    toDOList = JSON.parse(localStorage.getItem("toDOList"));
    renderList();
  }

  $(".add-btn").click(function () {
    let taskText = $(".task-inpt").val().trim();
    if (taskText !== "") {
      let task = {
        text: taskText,
        done: false,
        createdAt: new Date().toISOString(),
      };
      toDOList.push(task);
      updateLocalStorage();
      $(".task-inpt").val("");
      renderList();
      $(".suggestions").empty();
      $('.toDoList').show();
    }
  });

  $(".task-inpt").on("keydown", function (e) {
    if (e.key === "Enter") {
      $(".add-btn").click();
    }
  });
  

  
  $(".task-inpt").on("input", function () {
    let input = $(this).val().toLowerCase().trim();
    $(".suggestions").empty();

    if (input.length >= 0) {
      let matches = toDOList
        .map((task, index) => ({ ...task, index }))
        .filter((task) => task.text.toLowerCase().includes(input));
        $(".toDoList").hide();

      matches.forEach((task) => {
        let doneClass = task.done ? "done" : "";
        let btnText = task.done ? "Undone" : "Done";
        let formattedDate = new Date(task.createdAt).toLocaleString();

        let suggestionHtml = `
          <div class="suggest-item" data-index="${task.index}" style="margin-bottom: 10px;">
            <span class="${doneClass}">${task.text}</span>
            <input class="edit-input" type="text" style="display:none;" />
            <button class="done-btn">${btnText}</button>
            <button class="del-btn">Delete</button>
            <button class="chng-btn">Change</button>
            <span class="task-date" style="font-size: 0.8em; color: gray;">${formattedDate}</span>
          </div>
        `;
        $(".suggestions").append(suggestionHtml);
      });
    }
  });

  function updateLocalStorage() {
    localStorage.setItem("toDOList", JSON.stringify(toDOList));
  }

  function renderList() {
    $(".toDoList").empty();
    toDOList.forEach((task, index) => {
      attachTask(task, index);
    });
  }

  function attachTask(taskObj, index) {
    let doneClass = taskObj.done ? "done" : "";
    let btnText = taskObj.done ? "Undone" : "Done";
    let formattedDate = new Date(taskObj.createdAt).toLocaleString();

    let taskHtml = `
      <li data-index="${index}" style="margin-bottom: 10px;">
        <span class="${doneClass}">${taskObj.text}</span>
        <input class="edit-input" type="text" style="display:none;" />
        <button class="done-btn">${btnText}</button>
        <button class="del-btn">Delete</button>
        <button class="chng-btn">Change</button>
        <span class="task-date" style="margin-left: 10px; color: gray; font-size: 0.9em;">${formattedDate}</span>
      </li>
    `;
    $(".toDoList").append(taskHtml);
  
  }

  function handleAction($parent, action) {
    let index = $parent.data("index");
    if (index === undefined) return;
    if (action === "delete") {
      toDOList.splice(index, 1);
    } else if (action === "toggle") {
      toDOList[index].done = !toDOList[index].done;
    } else if (action === "edit") {
      let $span = $parent.find("span").first();
      let $input = $parent.find(".edit-input");
      $input.val($span.text()).show().focus();
      $span.hide();
      $parent.find(".chng-btn").text("Save").removeClass("chng-btn").addClass("save-btn");
      return; 
    } else if (action === "save") {
      let newText = $parent.find(".edit-input").val().trim();
      if (newText !== "") {
        toDOList[index].text = newText;
      }
    }

    updateLocalStorage();

    renderList();
    $(".task-inpt").trigger("input");
  }

  $(".toDoList, .suggestions").on("click", ".done-btn", function () {
    handleAction($(this).parent(), "toggle");
  });

  $(".toDoList, .suggestions").on("click", ".del-btn", function () {
    handleAction($(this).parent(), "delete");
  });

  $(".toDoList, .suggestions").on("click", ".chng-btn", function () {
    handleAction($(this).parent(), "edit");
  });

  $(".toDoList, .suggestions").on("click", ".save-btn", function () {
    handleAction($(this).parent(), "save");
  });


  $(".toDoList, .suggestions").on("keydown", ".edit-input", function (e) {
    if (e.key === "Enter") {
      $(this).siblings(".save-btn").click();
    }
  });
});
 