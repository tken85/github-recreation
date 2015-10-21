$(document).ready(function(){

$("#avatar").html($('<img/>', {
                                    src: user.avatar_url,
                                    align:"center",
                                    }));
$('aside h1').html(user.name);
$('aside span').html(user.login);

$('aside ul li:nth-child(1)').html("<span class='octicon octicon-location'></span>" + user.location);
$('aside ul li:nth-child(2)').html("<span class='octicon octicon-link'></span>" + user.blog);
$('aside ul li:nth-child(3)').html("<span class='octicon octicon-clock'></span>" + "Joined on " + moment(user.created_at).format('LL'));

$('#followers').html("<strong>"+ user.followers + "</strong>" +"<br>"+ "<span>Followers</span>");
$('#starred').html("<strong>"+ user.public_gists + "</strong>" +"<br>"+ "<span>Starred</span>");
$('#following').html("<strong>"+ user.following + "</strong>" +"<br>"+ "<span>Following</span>");

$('header ul:nth-child(2) li:nth-child(3)').html($('<img/>', {
                                    src: user.avatar_url,
                                    height: "20px"
                                    }));
  $('header ul:nth-child(2) li:nth-child(3)').append("<span class='octicon octicon-triangle-down'></span>");

});
/* for repos

need repo.name (and it's url repo.url), repo.description, repo.updated_at,  then other side repo.language, repo.stargazers_count, repo.forks
*/
var sortedRepos = _.sortBy(repos, 'updated_at');
var reversedRepos= sortedRepos.reverse();

//remove Null values from languages
_.each(reversedRepos, function(currVal, idx, arr){
  if(currVal.language ===null){
    currVal.language = "";
  }

});
//fix issues with some repos not having descriptions.
_.each(reversedRepos, function(currVal, idx, arr){

  if(currVal.description !==""){
  $('article > ul').append("<li><section class='list-left'><a href=''>"+ currVal.name+ "</a><br>"+"<span>"+ currVal.description + "</span><br>" + "<span>Updated "+ moment(currVal.updated_at).fromNow() + "</span></section><section class='list-right'><ul class='repo-right'><li>" + currVal.language + "</li><li><span class='octicon octicon-star'></span>" + currVal.stargazers_count+ "</li><li><span class='octicon octicon-git-branch'></span>" + currVal.forks+ "</li></ul></section></li>");

}
  else{
    $('article > ul').append("<li><section class='list-left'><a href=''>"+ currVal.name+ "</a><br>" + "<span>Updated "+ moment(currVal.updated_at).fromNow() + "</span></section><section class='list-right'><ul class='repo-right'><li>" + currVal.language + "</li><li><span class='octicon octicon-star'></span>" + currVal.stargazers_count+ "</li><li><span class='octicon octicon-git-branch'></span>" + currVal.forks+ "</li></ul></section></li>");


  }
});

$('.repoNav').click(function(event){
  event.preventDefault();
  $('.repositories').css('display','inline-block');
  $('.activities').css('display','none');
});

$('.activityNav').click(function(event){
  event.preventDefault();
  $('.repositories').css('display','none');
  $('.activities').css('display','inline-block');
});

/* for activity

need activity.actor.login, activity.type, activity.payload.ref, activity.repo.name, activity.created_at


push also has activity.avatar.url  and activity.payload.description, and activity.payload.commits.sha(first 7 only)
*/
