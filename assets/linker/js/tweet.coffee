# render initial tweets
if $('.js-tweets').length > 0
  _.each initialTweets, (tweet) ->
    liEl = document.createElement('li')
    liEl.setAttribute('class', 'tweet')
    divEl = document.createElement('div')
    h4El = document.createElement('h4')
    pEl = document.createElement('p')
    spanEl = document.createElement('span')

    h4El.innerHTML = tweet.author.username
    pEl.innerHTML = tweet.body

    createdAt = moment(tweet.createdAt).format('YYYY-MM-DD HH:mm A')
    spanEl.innerHTML = createdAt

    divEl.appendChild(h4El)
    divEl.appendChild(pEl)
    divEl.appendChild(spanEl)
    liEl.appendChild(divEl)
    $('.js-tweets').prepend(liEl)

# tweets form handler
if $(".js-tweet-form").length > 0
  $(".js-tweet-form .js-submit").click (e) ->
    e.preventDefault()

    body = $('.js-tweet-form .js-body').val()

    if body == ''
      return alert "Tweet can't be empty"

    data =
      body: body

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
        spanEl = document.createElement('span')

        h4El.innerHTML = tweet.author.username
        #pEl.innerHTML = tweet.body
        $(pEl).text(tweet.body) # escape html?

        createdAt = moment(tweet.createdAt).format('YYYY-MM-DD HH:mm A')
        spanEl.innerHTML = createdAt

        divEl.appendChild(h4El)
        divEl.appendChild(pEl)
        divEl.appendChild(spanEl)
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
      spanEl = document.createElement('span')

      h4El.innerHTML = message.data.author.username
      pEl.innerHTML = message.data.body

      createdAt = moment(message.data.createdAt).format('YYYY-MM-DD HH:mm A')
      spanEl.innerHTML = createdAt

      divEl.appendChild(h4El)
      divEl.appendChild(pEl)
      divEl.appendChild(spanEl)
      liEl.appendChild(divEl)
      $('.js-tweets').prepend(liEl)