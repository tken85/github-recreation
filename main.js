$(document).ready(function(){

// adding side profile information
$("#avatar").html("<img src='" + user.avatar_url + "'>");
$('aside h1').html(user.name);
$('aside span').html(user.login);

$('aside ul li:nth-child(1)').html("<span class='octicon octicon-location'></span>" + user.location);
$('aside ul li:nth-child(2)').html("<span class='octicon octicon-link'></span>" + "<a href='"+user.blog+"'>" + user.blog+"</a>");
$('aside ul li:nth-child(3)').html("<span class='octicon octicon-clock'></span>" + "Joined on " + moment(user.created_at).format('LL'));

$('#followers').html("<a href='" + user.follower_url + "'><strong>"+ user.followers + "</strong>" +"<br>"+ "<span color='gray'>Followers</span></a>");
$('#starred').html("<a href='" + user.starred_url + "'><strong>"+ user.public_gists + "</strong>" +"<br>"+ "<span color='gray'>Starred</span></a>");
$('#following').html("<a href='" + user.following_url + "'><strong>"+ user.following + "</strong>" +"<br>"+ "<span color='gray'>Following</span></a>");

//adding header information
$('header ul:nth-child(2) li:nth-child(3)').html("<a href='" + user.html_url + "'><img src='" + user.avatar_url + "'><span class='octicon octicon-triangle-down'></span></a>")

// adding organization information to side profile
$('#org').html("<img src='" + orgs.org_url + "'>");

//Sorting then inserting repos

var sortedRepos = _.sortBy(repos, 'updated_at');
sortedRepos.reverse();

//remove Null values from languages
_.each(sortedRepos, function(currVal, idx, arr){
  if(currVal.language ===null){
    currVal.language = "";
  }

});
//fix issues with some repos not having descriptions.
_.each(sortedRepos, function(currVal, idx, arr){

  if(currVal.description !==""){
  $('article > ul').append("<li><section class='list-left'><a href='"+ currVal.html_url + "'>" + currVal.name+ "</a><br>"+"<span class='repo-description'>"+ currVal.description + "</span><br>" + "<span class='repo-updated'>Updated "+ moment(currVal.updated_at).fromNow() + "</span></section><section class='list-right'><ul class='repo-right'><li>" + currVal.language + "</li><li><span class='octicon octicon-star'></span>" + currVal.stargazers_count+ "</li><li><span class='octicon octicon-git-branch'></span>" + currVal.forks+ "</li></ul></section></li>");

}
  else{
    $('article > ul').append("<li><section class='list-left'><a href='" + currVal.html_url + "'>"+ currVal.name+ "</a><br>" + "<span class='repo-updated'>Updated "+ moment(currVal.updated_at).fromNow() + "</span></section><section class='list-right'><ul class='repo-right'><li>" + currVal.language + "</li><li><span class='octicon octicon-star'></span>" + currVal.stargazers_count+ "</li><li><span class='octicon octicon-git-branch'></span>" + currVal.forks+ "</li></ul></section></li>");


  }
});


//Nav bar click functionality  changes borders and what page is loaded
$('.repoNav').click(function(event){
  event.preventDefault();
  $('.repositories').css('display','inline-block');
  $('.activities').css('display','none');
  $(this).css('color','black');
  $(this).addClass('picked');
  $('.activityNav').removeClass('picked');
  $('.activityNav').css('color','gray');
});

$('.activityNav').click(function(event){
  event.preventDefault();
  $('.repositories').css('display','none');
  $('.activities').css('display','inline-block');
  $(this).css('color','black');
  $(this).addClass('picked');
  $('.repoNav').removeClass('picked');
  $('.repoNav').css('color','gray');
});

// activity data set. First map it to easier to manage ones based on type of event

var shortActivity = activity.map(function(item){

  if (item.type === "CreateEvent"){
	   return {   login: item.actor.login,
			          type: item.type,
			          ref: item.payload.ref,
			          repo: item.repo.name,
                created_at: item.created_at,
                ref_type: item.payload.ref_type,
                repo_url: item.repo.url,
                profile_url: item.actor.url,


    }
  }
  else{
    return {login: item.actor.login,
            type: item.type,
            ref: item.payload.ref,
            repo: item.repo.name,
            repo_url: item.repo.url,
            created_at: item.created_at,
            avatar: item.actor.avatar_url,
            message: item.payload.commits[0].message,
            commit_id: item.payload.commits[0].sha,
            commit_url: item.payload.commits[0].url,

   }
  }
});

//sort activity by time

var sortedActivity = _.sortBy(shortActivity,'time');
sortedActivity.reverse();

// display activities on page based on type of activity

_.each(sortedActivity, function(currVal, idx, arr){

  if(currVal.type ==="PushEvent"){
    $('.activities').append("<div class='activity-list'><section class='push-list-left'><span class='mega-octicon octicon-git-commit'></span></section><section class='push-list-right'><ul><li>" + moment(currVal.created_at).fromNow() + "</li><li>" + currVal.login + " <b>pushed to</b> " + "<a href='" + currVal.ref + "'>Master</a><b> at</b> <a href='"+ currVal.repo_url + "'>" + currVal.repo + "</a></li><li><img src='" + currVal.avatar + "'><span class='octicon octicon-mark-github'></span><a href='"+ currVal.commit_url+"'>"+ currVal.commit_id.slice(0,7) + "</a> "  + currVal.message + "</li></ul></section></div>" )
  }

  else if(currVal.type ==="CreateEvent"  && currVal.ref_type ==="branch"){
    $('.activities').append("<div class='activity-list'><span class='octicon octicon-git-branch'></span> "+ "<a href='" + currVal.profile_url + "'>"+ currVal.login + "</a> created branch <a href='"+ currVal.repo_url + "'>" + currVal.ref + "</a> at <a href='"+ currVal.repo_url + "'>" + currVal.repo + "</a> " + moment(currVal.created_at).fromNow())
  }
  else{
    $('.activities').append("<div class='activity-list'><span class='octicon octicon-repo'></span> "+ "<a href='" + currVal.profile_url + "'>"+ currVal.login + "</a> created <a href='"+ currVal.repo_url + "'>" + currVal.ref_type + "</a> at <a href='"+ currVal.repo_url + "'>" + currVal.repo + "</a> " + moment(currVal.created_at).fromNow())
  }
});


});
