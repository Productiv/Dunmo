Template.newTask.rendered = function() {
    $(function () {
        $("#datetimepicker").datetimepicker({
            pick12HourFormat: true,
            minDate: new Date()
        });
    });
}
