$(".js-tweet-form .js-submit").click (e) ->
  e.preventDefault()

  data =
    body: $('.js-tweet-form .js-body').val()

  $.ajax
    type: 'POST'
    url: '/tweet/store'
    dataType: 'json'
    data: data

    success: (tweet, textStatus, xhr) =>
      liEl = document.createElement('li')
      liEl.setAttribute('class', 'tweet')
      divEl = document.createElement('div')
      h4El = document.createElement('h4')
      pEl = document.createElement('p')

      h4El.innerHTML = tweet.author.username
      pEl.innerHTML = tweet.body

      divEl.appendChild(h4El)
      divEl.appendChild(pEl)
      liEl.appendChild(divEl)
      $('.js-tweets').prepend(liEl)

    error: (xhr, textStatus, error) =>
      # TODO: notify user that something went wrong

socket.on "message", messageReceived = (message) ->

  if message.model == 'tweet'

    if message.verb == 'create'

      # do nothing if author of the tweet is the current logged-in user
      if message.data.author.username == User.username
        return;

      liEl = document.createElement('li')
      liEl.setAttribute('class', 'tweet')
      divEl = document.createElement('div')
      h4El = document.createElement('h4')
      pEl = document.createElement('p')

      h4El.innerHTML = message.data.author.username
      pEl.innerHTML = message.data.body

      divEl.appendChild(h4El)
      divEl.appendChild(pEl)
      liEl.appendChild(divEl)
      $('.js-tweets').prepend(liEl)