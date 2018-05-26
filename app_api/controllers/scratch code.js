							 /*  var reviews=location[0].reviews;
								   var found=false;
								   reviews.forEach( function(reviewelement,reviewindex) {  
								   console.log(reviewelement,reviewindex);
								   if (reviewelement._id==req.params.reviewid) { 
//=============================================================
								   reviewelement.comments.forEach( function(element,index) {  
								   console.log(element,index);
								   if (element._id==req.params.commentid) { 

								   	found=true;
				                   	element.replies.push({
																reply: req.body.reply,
																author: req.body.author
																									
					 			                    	});
				                   	element.replynos++;
		                            location[0].save((err,location)=>{
																if (err) { sendJsonResponse(res, 400, err);} 
																else { var thisreply=location.reviews[reviewindex].comments[index].replies[location.reviews[reviewindex].comments[index].replies.length-1];
																	   sendJsonResponse(res, 201, thisreply); }
															                                        });
							                                           } 
	                              
							                                        }); }  });
								   if(!found) {sendJsonResponse(res,404,{"message":"Invalid Address, no matching reviewID/commentID"});}*/
		// 				     	}

		// });
							

							/*Loc.find({_id:req.params.locationid})
	.select('reviews')
	.exec((err,location)=>{ 
							if (err) {
								sendJsonResponse(res, 400, err); return;
									} 
							else { var reviews=location[0].reviews;
								   var found=false;
								   reviews.forEach( function(element,index) {  
								   console.log(element,index);
								   if (element._id==req.params.reviewid) { 
								   	found=true;
				                   	element.comments.push({
																comment: req.body.comment,
																author: req.body.author
																									
					 			                    	});
				                   	element.commentnos++;
		                            location[0].save((err,location)=>{
																if (err) { sendJsonResponse(res, 400, err);} 
																else { var thiscomment=location.reviews[index].comments[location.reviews[index].comments.length-1];
																	   sendJsonResponse(res, 201, thiscomment); }
															                                        });
							                                           } 
	                              
							                                        });
								   if(!found) {sendJsonResponse(res,404,{"message":"Invalid Address, no matching reviewID"});}
						     	}

		});*/

		/*Loc.find({"_id":"req.params.locationid","reviews._id":"req.params.reviewid","reviews.comments._id":"req.params.commentid"},{"reviews.comments.replies":0})// not working add line for reviewid.
	.select('reviews')
	.exec((err,reviews)=>{*/

		/*Loc.find({"_id":"req.params.locationid","reviews._id":"req.params.reviewid"})
		.select('reviews')
		.exec((err,reviews)=>{*/


			/*Loc.find({"_id":"req.params.locationid","reviews._id":"req.params.reviewid"},{"reviews.comments":0})// not working add line for reviewid.
	.select('reviews')
	.exec((err,reviews)=>{
		if(!reviews)
			{sendJsonResponse(res,200,{"Result":"Not Found"}); return;}
		else if (err) 
			{sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,reviews);}
	});*/

	
/*	var theEarth=function(){

    	var earthRadius=6371; //km
    	var getDistanceFromRads = function(rads) {
			return parseFloat(rads * earthRadius);
			};
		var getRadsFromDistance = function(distance) {
			return parseFloat(distance / earthRadius);
			};
		return {
			getDistanceFromRads : getDistanceFromRads,
			getRadsFromDistance : getRadsFromDistance};
    }();	       
    var geoOptions={ spherical:true,
    				 num:10,
    				 maxDistance: theEarth.getRadsFromDistance(parseFloat(req.query.distance))};
*/
   
 /*   Loc.geoNear(point, geoOptions, (err,results,stats)=>{
	if(err){sendJsonResponse(res,404,err); return;}
	var locations=[];
	results.forEach( function(doc) {
	// statements
	locations.push({
					distance: theEarth.getDistanceFromRads(doc.dis),
					name: doc.obj.name,
					address: doc.obj.address,
					avgrating: doc.obj.avgrating,
					facilities: doc.obj.facilities,
					openinghrs: doc.obj.openinghrs,
					_id: doc.obj._id

	 				});
			});
	sendJsonResponse(res,200,locations);

    });*/

     }, function(){ $(this).attr('src','/images/favorite1.png');


/* Jade Navbar
     li.nav-item.dropdown
         a#navbarDropdown.nav-link.dropdown-toggle(href='#', role='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='false')
           | Features
         .dropdown-menu(aria-labelledby='navbarDropdown')
           a.dropdown-item(href='/locations') All Locations
           a.dropdown-item(href='/locations/123') Single Location
           a.dropdown-item(href='/locations/distance') Distance Location
           .dropdown-divider
           a.dropdown-item(href='/locations/123/review') All Reviews*/


           "locationmap":"https://www.google.com/maps/embed/v1/directions?origin=8-266/7, ISB Rd, Financial District, Nanakram Guda, Hyderabad, Telangana 500032&destination=Barbeque Nation, Nanakramaguda Road, Beside Wipro Lake, Financial District, Gachibowli, Hyderabad&key=AIzaSyBpOiiNEJ6Lmiqe1rBc4rY_ZPXPo2OzthU",

            /*[{"_id":"5a9652ea2ffd36391ce572f5",
"name":"Barbeque Nation","avgrating":2,
"distance":15800,
"address":"Barbeque Nation, Nanakramaguda Road, Beside Wipro Lake, Financial District, Gachibowli, Hyderabad",
"facilities":["Cold Drinks","Zuchinni","Cappuchinos"]},{

"_id":"5a8fc0c042781261fc958882",
"name":"BillBay","avgrating":4,
"distance":12800,
"address":"Billbay, Nanakramaguda Road, Beside Wipro Lake, Financial District, Gachibowli, Hyderabad",
"facilities":["Cold Drinks","Zuchinni","Cappuchinos"]*/


	

/*"_id":"5a9652ea2ffd36391ce572f5",
"name":"Barbeque Nation",
"tagline":"Find places to work with wifi near you!",
"avgrating":2,
"distance":"15.8 km",
"address":"Barbeque Nation, Nanakramaguda Road, Beside Wipro Lake, Financial District, Gachibowli, Hyderabad",
"openinghrs":["Monday - Friday : 7:00am - 7:00pm","Saturday : 8:00am - 5:00pm","Sunday : closed"],
"facilities":["Cold Drinks","Zuchinni","Cappuchinos"],
"email":"99pratyush@gmail.com",
"website":"www.google.com",
"telephone":"+91-9639217588"
"reviews":[],
"coords":[78.343997,17.424077] */


/*
	Loc.findById(doc._id).select('distance').exec((err,location)=>{location.distance=cordist; 
																	location.save((err,location)=>{ 
																		if (err) { console.log("Error API: Saving distance in Location: ",err);
																		
																		sendJsonResponse(res, 400, err);} 
																	  });		
																					});*/

																						// statements
/*	var cordist="";
	if (doc.distance1>1000) { cordist= parseFloat(((doc.distance1)/1000).toFixed(1))+" km";}
	else { cordist= parseInt(doc.distance1)+" m";}*/

/*	|<br><br>
       label.pull-right(for="filter") Filter results :   
        input#filter(type="text", name="filter", ng-model="textFilter")*/

            /*$("form.form-inline.my-2.my-lg-0").prepend(
      "<input id='filter', class='form-control mr-sm-2', type='text', placeholder='Filter Results', aria-label='Filter', ng-model='textFilter'>"
      );*/

/*input#filter(type="text", name="filter", ng-model="textFilter")
       input.form-control.mr-sm-2(type='search', placeholder='Search', aria-label='Search')*/

       
//            - each comment in review.comments
//                .row
 //                .col-xs-12
 //                 .boxzoom1
 //                   .comment  +formatDate(comment.commentdate)
  //                  .comment #{comment.comment}
 //                   p.comment
 //                      span.badge-pill.badge-info Reply 
 //                       | &nbsp; 
 //                       span.badge-default.badge-pill  #{comment.replynos}
 //                       | &nbsp;
 //                      span.badge-pill.badge-info Upvote  
 //                       | &nbsp; 
 //                       span.badge-default.badge-pill  #{comment.upvotes}
 //                       | &nbsp;
 //                      span.badge-pill.pull-right.badge-secondary  #{comment.author}
 //                      hr

script(src='/lib/angular-route.min.js.map')
    script(src='/lib/angular.min.js.map')

      // script(src='/common/directives/RatingStars/ratingStars.js')

//////////////////////////////////////////////////////////////////////////////////////////////////////////
      All reviews.js

      /*        
 $("div.boxzoomrecent").unbind().click(function (){           //filter based on recent review
var heading=$(this).find("div.recentreviewheading");
 
  var head=heading.text().trim();
  $("#filter").val(head);
  $("#filter").trigger('input');
  

 });

*/

/*$(".chattoggle").unbind().click(function () {          //shows all comments in particualr review
    var main=$(this).parents("div.boxzoom1");
    var comments=main.find(".commenttoggle");
    var add=main.find(".addtogglebtn");
	comments.toggle();
	add.toggle();


});*/

/*$(".addtogglebtn").unbind().click(function () {          //in review add button opens comment textbox
    var main=$(this).parents("div.boxzoom1");
    var addcommentbox=main.find(".addtoggle");
   
	addcommentbox.toggle();

});*/

/*$("[class^=commentpost]").unbind().on("click",function () {
    var ids=$(this).attr('class').split(/commentpost|,/);
    var locationid=ids[1];
    var reviewid=ids[2]; ////////////////get location id review id

    var main=$(this).parents("div.boxzoom1");   // get textbox
	var textbox=main.find("textarea.addcomment");
 	var comment=textbox.val();
    var addcommentbox=main.find(".addtoggle");
   
	
     
     $.ajax({ 
      url: "/api/locations/"+locationid+"/"+reviewid+"/comment",
      type: "POST",
       data: { author: "Log User",
               comment: comment},
      cache: false,
      success: (res)=>{  textbox.val("Successfully Posted");
                 console.log("Comment Posted");
                 setTimeout(function(){textbox.val("");
                 	addcommentbox.toggle();
                 }, 1000);

             },
       error: function (error) { 
           alert(error.responseText);
      }
      });
     


  });*/

// single locations delete review button
/*         vm.deleteoptions=function ($event) { 
		     $($event.currentTarget).find('.badge').toggle(); 
	         };
         vm.deletecancel=function ($event) {
	      $($event.currentTarget).find('.badge').hide();   
           };

         vm.deleteconfirm=function ($event) { 
			 var reviewid=$($event.currentTarget).attr('id').split("delete")[1];
		     var locationid=$(location).attr('href').split('/')[4];
		     
		     $.ajax({ 
		      url: '/api/locations/'+locationid+'/'+reviewid,
		      type: "DELETE",
		      cache: false,
		      success: function (res){ console.log(res);
		      	console.log("Removed Review"+res.message);
		     $($event.currentTarget).parents(".row.reviews")[0].remove(); 
		                    
		             }
		      });
		          };*/

		          single locations.html

/*		          <!--           <button class="btn changes">
            <span class="confirm" ng-click="vm.deleteoptions($event)"> 
              <img src="/images/bin.png" height="30px" width="30px"/>
                <div class="badge badgeconfirmdelete" style="display: none;">
                  <span id="delete{{review._id}}" class="correct" ng-click="vm.deleteconfirm($event)"><img src="/images/correct.png" height="30px" width="30px"/></span>
                  &nbsp;
                  <span class="cancel" ng-click="vm.deletecancel($event)"><img src="/images/cancel.png" height="30px" width="30px"/>
                  </span>
                 
                </div>
              </span>
          </button> -->*/
/*
                   <!--  <button type="button" class="btn btn-light">
            Comment
            &nbsp; <span class="badge badge-light"> {{review.commentnos}}</span>
          </button>
          &nbsp; -->
     <!--   <button type="button" class="btn btn-success">
             Upvote
            &nbsp; <span class="badge badge-default"> {{review.upvotes}}</span>
          </button> -->*/
////alll location js
              $(".findbylocation").click(function(){  
      $(".distance").toggle();  
      var value= $(".distance").val();              //select  Add location icon span
      if (value)
      { var url= "/locations?distance="+value;
        
    /* window.location.href="/locations?distance="+value;*/ 
 /*   window.history.pushState({}, "Title", url);*/}
          
           
      });

/*$(".allocation").click(function(){      //All button        
     window.location.href="/locations"; 
    
     });*/

     
     $("div.col-xs-12.col-sm-8").on("click",'#postlocationsubmit',function(){                   //select  Add location icon span
     
     $.ajax({ 
      url: "../locations",
      type: "POST",
       data: $("#rendered-form").serialize(),
      cache: false,
      success: (res)=>{  window.location.replace("../locations/"+res.locations._id);
                 
             },
       error: function (error) { 
           alert(error.responseText);
      }
      });
      });


    <!--     <ul class="button btn userbtn navbar-right">
      <li ng-hide="navm.LoggedIn"><a href="/register/?page={{navm.currentPath}}">Sign in</a></li>
      <li ng-show="navm.LoggedIn" class="dropdown">
        <a href="" class="dropdown-toggle" data-toggle="dropdown">{{navm.user.name}} </a>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/profile" >View Profile</a></li>
          <li><a href="" ng-click="navm.logout()">Logout</a></li>
        </ul>
      </li>
    </ul> -->

    Café Campus
    Bar
    357 Rue Prince Arthur E, FakeMontréal, QC H2X 1B4, Canada
    Monday-Friday: 0800 hrs-1600 hrs, Sunday: 1300 hrs -2100 hrs
    Cocktails, Dance, Bars
    45.5177335
    -74
    campuscafe@fmail.com
    www.safecafecampus.com
    0784-844-1010