const tasks = [
  {
    id: 1,
    title: "Настроить роутинг",
    estimate: 5,
    priority: 3,
    assignee: "Анна",
    status: "todo",
    dependsOn: []
  },
  {
    id: 2,
    title: "Сделать авторизацию",
    estimate: 8,
    priority: 5,
    assignee: "Иван",
    status: "in-progress",
    dependsOn: []
  },
  {
    id: 3,
    title: "Профиль пользователя",
    estimate: 6,
    priority: 4,
    assignee: "Анна",
    status: "todo",
    dependsOn: [2]
  },
  {
    id: 4,
    title: "API для профиля",
    estimate: 7,
    priority: 5,
    assignee: "Олег",
    status: "done",
    dependsOn: []
  },
  {
    id: 5,
    title: "Редактирование профиля",
    estimate: 4,
    priority: 4,
    assignee: "Анна",
    status: "todo",
    dependsOn: [3]
  }
];


// 1. Выбрать доступные задачи (status: todo и зависимости в status: done)
function getAvailableTasks(taskList)
{
  return taskList.filter(task => {
    const isTodo = task.status === 'todo';
    const depsMet = task.dependsOn.every(depId => {
      const depTask = taskList.find(t => t.id === depId);
      return depTask && depTask.status === 'done';
    });
    return isTodo && depsMet;
  });
};

// 2. Отсортировать задачи (приоритет DESC, оценка ASC)
function sortTasks(tasksList)
{
  return [...tasksList].sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority; // По убыванию приоритета
    }
    return a.estimate - b.estimate; // По возрастанию оценки
  });
};

// 3. Подсчитать нагрузку по разработчикам
function getWorkload(taskList)
{
  // Собираем всех уникальных разработчиков из исходного списка
  const workers = [...new Set(taskList.map(t => t.assignee))];
  
  return workers.reduce((acc, worker) => {
    // Считаем часы только для задач в статусе "todo" или "in-progress" 
    // так как выполненные задачи "done" нагрузку уже не создают
    acc[worker] = taskList
      .filter(t => t.assignee === worker && t.status !== 'done')
      .reduce((sum, t) => sum + t.estimate, 0);
    return acc;
  }, {});
};

// 4. Найти перегруженных разработчиков (> 10 часов)
function getOverloaded(workload, overtime=10)
{
  return Object.keys(workload).filter(worker => workload[worker] > overtime);
};

// Если нужно чтобы высчитало из тасков
function getOverLoadedByTasks(tasks, overtime=10) {
    return getOverloaded(getWorkload(tasks), overtime);
}

// 5. Сформировать финальный спринт (лимит 15 часов)
function getFinalSprint(sortedTasks, limit = 15) 
{
  let currentTotal = 0;
  return sortedTasks.reduce((sprint, task) => {
    if (currentTotal + task.estimate <= limit) {
      sprint.push(task);
      currentTotal += task.estimate;
    }
    return sprint;
  }, []);
};

// ну если прям реальный фин спринт
function getRealFinalSprint(taskList, limit = 15) {

    let available = getAvailableTasks(taskList);
    let sorted = sortTasks(available)

    return getFinalSprint(sorted, limit)
}

function getTotalSprintTime(sprint) {
    return sprint.reduce((sum, t) => sum + t.estimate, 0);
}

// Исполнение и вывод
const availableTasks = getAvailableTasks(tasks);
const sortedTasks = sortTasks(tasks);
const workload = getWorkload(tasks);
const overloaded = getOverloaded(workload);
// не понятно что делать с done и с dependsOn
// если нужно чтобы и они учитывались, то sortedTasks = sortTasks(availableTasks)
const finalSprint = getFinalSprint(sortedTasks, 15);
// const finalSprint = getRealFinalSprint(tasks, 15);
// old.version
// const totalSprintTime = finalSprint.reduce((sum, t) => sum + t.estimate, 0);
const totalSprintTime = getTotalSprintTime(finalSprint)

console.log("Доступные задачи:", availableTasks);
console.log("Отсортированные задачи:", sortedTasks);
console.log("Нагрузка по разработчикам:", workload);
console.log("Перегруженные:", overloaded);
console.log("Финальный спринт:", finalSprint);
console.log(`Общий объём спринта: ${totalSprintTime} часов`);


