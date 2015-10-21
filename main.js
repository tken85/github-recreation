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

/*
var shortActivity =[];

_.each(activity, function(currVal, idx, arr){

  shortActivity[idx]["login"]=currVal.actor.login;
  shortActivity[idx]["type"] = currVal.type;
  shortActivity[idx]["ref"] = currVal.payload.ref;
  shortActivity[idx]["repo"] = currVal.repo.name;
  shortActivity[idx]["time"] = currVal.created_at;
  shortActivity[idx]["avatar"] = currVal.avatar_url;
  shortActivity[idx]["description"] = currVal.payload.description;
  //shortActivity["id"] = currVal.payload.commits.sha;


});*/
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

var sortedActivity = _.sortBy(shortActivity,'time');
sortedActivity.reverse();


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
