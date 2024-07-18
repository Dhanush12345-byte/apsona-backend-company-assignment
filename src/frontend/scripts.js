$(document).ready(() => {
    $('#register-form').submit((e) => {
      e.preventDefault();
      $.post('/register', {
        username: $('#register-username').val(),
        password: $('#register-password').val()
      }).done(() => {
        alert('Registered successfully');
      }).fail((err) => {
        alert('Error registering');
      });
    });
  
    $('#login-form').submit((e) => {
      e.preventDefault();
      $.post('/login', {
        username: $('#login-username').val(),
        password: $('#login-password').val()
      }).done(() => {
        alert('Logged in successfully');
        $('#auth').hide();
        $('#note-app').show();
        loadNotes();
      }).fail((err) => {
        alert('Error logging in');
      });
    });
  
    $('#create-note').click(() => {
      const note = {
        title: $('#note-title').val(),
        content: $('#note-content').val(),
        tags: $('#note-tags').val().split(','),
        color: $('#note-color').val(),
        reminder: $('#note-reminder').val()
      };
      $.post('/note', note).done(() => {
        alert('Note created successfully');
        loadNotes();
      }).fail((err) => {
        alert('Error creating note');
      });
    });
  
    function loadNotes() {
      $.get('/notes').done((notes) => {
        $('#notes-list').empty();
        notes.forEach(note => {
          $('#notes-list').append(`<div class="note" style="background-color: ${note.color};">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p>Tags: ${note.tags.join(', ')}</p>
            <p>Reminder: ${note.reminder ? new Date(note.reminder).toLocaleString() : 'None'}</p>
          </div>`);
        });
      }).fail((err) => {
        alert('Error loading notes');
      });
    }
  });
  