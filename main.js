$("#avatar").html($('<img/>', {
                                    src: user.avatar_url,
                                    align:"center",
                                    }));
$('aside h1').html(user.name);
$('aside span').html(user.login);

$('aside ul li:nth-child(1)').html("<span class='octicon octicon-location'></span>" + user.location);
$('aside ul li:nth-child(2)').html("<span class='octicon octicon-link'></span>" + user.blog);
$('aside ul li:nth-child(3)').html("<span class='octicon octicon-clock'></span>" + user.created_at);

$('#followers').html("<strong>"+ user.followers + "</strong>" +"<br>"+ "<span>Followers</span>");
$('#starred').html("<strong>"+ user.public_gists + "</strong>" +"<br>"+ "<span>Starred</span>");
$('#following').html("<strong>"+ user.following + "</strong>" +"<br>"+ "<span>Following</span>");

$('header ul:nth-child(2) li:nth-child(3)').html($('<img/>', {
                                    src: user.avatar_url,
                                    height: "20px"
                                    }));
  $('header ul:nth-child(2) li:nth-child(3)').append("<span class='octicon octicon-triangle-down'></span>");
