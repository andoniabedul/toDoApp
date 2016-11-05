load('application');

before(loadTasks, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New tasks';
    this.tasks = new Tasks;
    render();
});

action(function create() {
    var task = {};
    var name = req.body.Tasks.name;
    var description = req.body.Tasks.description;
    var created_at = new Date();
    var updated_at = created_at;
    var tks = {name,description, created_at, updated_at}
    console.log("tasks: " + JSON.stringify(req.body.Tasks));
    Tasks.create(
      tks, function (err, tasks) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: tasks && tasks.errors || err});
                } else {
                    send({code: 200, data: tasks.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Tasks can not be created');
                    render('new', {
                        tasks: tasks,
                        title: 'New tasks'
                    });
                } else {
                    flash('info', 'Tasks created');
                    redirect(path_to.tasks);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Taskss index';
    Tasks.all(function (err, tasks) {
        switch (params.format) {
            case "json":
                send({code: 200, data: tasks});
                break;
            default:
                render({
                    tasks: tasks
                });
        }
    });
});

action(function show() {
    this.title = 'Tasks show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.tasks});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Tasks edit';
    switch(params.format) {
        case "json":
            send(this.tasks);
            break;
        default:
            render();
    }
});

action(function update() {
    var tasks = this.tasks;
    this.title = 'Edit tasks details';
    this.tasks.updateAttributes(body.Tasks, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: tasks && tasks.errors || err});
                } else {
                    send({code: 200, data: tasks});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Tasks updated');
                    redirect(path_to.tasks(tasks));
                } else {
                    flash('error', 'Tasks can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.tasks.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy tasks');
                } else {
                    flash('info', 'Tasks successfully removed');
                }
                send("'" + path_to.tasks + "'");
            });
        });
    });
});

function loadTasks() {
    Tasks.find(params.id, function (err, tasks) {
        if (err || !tasks) {
            if (!err && !tasks && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.tasks);
        } else {
            this.tasks = tasks;
            next();
        }
    }.bind(this));
}
