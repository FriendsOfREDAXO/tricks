/* 
 * scripterweiterungen von javanita
 */

$(document).ready(function () {
    
    // Kalender


      $('#calendar').fullCalendar({
        defaultView: 'month',
        height: 450,
        aspectRatio: 1.0,
         header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek'
        },
        locale: 'de',       
        events:
            {
                url: 'index.php?rex-api-call=sked_events&category=' + cat,
                type: 'POST',
                dataType: 'json',
                cache: true,
                error: function (xhr, type, exception) {
                    // todo later show warning field
                    // $('#script-warning').show();
                    alert("Error: " + exception);
                }
            }      

    });   
    
});
