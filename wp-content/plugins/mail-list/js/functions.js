//Validate email
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//delete this field value
function deleteMe(field)
{
	field.value="";
}

//send the mail to the selected recipient
function subscribeMailList(){
	email=jQuery("#ml-email").val();
	if(!validateEmail(email)){
		return false;
	}
	jQuery("#ml-img").fadeIn(0);
	//jquery ajax request
	var url=blog_url+"/wp-content/plugins/mail-list/ajax/add_subscriber.php"
    jQuery.post(url,{emailaddress:email},function(result){
		if(result=="true"){
			//nothing
		}      
    });
    
	//hide the form
	jQuery("#ml-img").fadeOut(0);
	jQuery('#ml-p').fadeOut(0);
	jQuery('#ml-p-sent').fadeIn(0);
	jQuery('#ml-form').fadeOut(0);
	jQuery('#ml-newsletterform').delay(3000).fadeOut(1000);
    return false;
}
