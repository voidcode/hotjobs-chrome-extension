$(function(){
	if(localStorage.getItem('qdata') !=undefined){
		var localqdata = JSON.parse(localStorage.getItem('qdata'));
		$('.search .center .query').text(localqdata.fritekst);
		$('.search .center .zipcode').text(localqdata.postdistrikt);
		if(localqdata.erhvervsomraade !='')
			$('.search .center .commercial-areas').val(localqdata.erhvervsomraade);
		if(localqdata.ansaettelsesvilkaar !='')
			$('.search .center .employment-practices').val(localqdata.ansaettelsesvilkaar);
		if(localqdata.ansaettelsesform !='')
			$('.search .center .recruitment-form').val(localqdata.ansaettelsesform); 
	}

	$('.search .top').on('click', function(event){	
		window.location.reload();
	});
	$('.joblist .top').on('click', function(event){	
		window.location.reload();
	});
	$('.jobview .top').on('click', function(event){	
		$('.jobview').hide('fast');
		$('.joblist').show('fast');
	});
	function newJoblistItem(item){
		return '<div class="item" data-id="'+item.Id+'">'+
        			'<div class="headline" data-id="'+item.Id+'">'+item.Headline+'</div>'+
        			'<div class="body" data-id="'+item.Id+'">'+item.Body+'</div>'+
        		'</div>';
	}
	$('.search .footer .run-query').on('click', function(event){
		var query = $('.search .center .query');
		var zipcode = $('.search .center .zipcode');
		var commercialareas = $('.search .center .commercial-areas :selected');
		var employmentpractices = $('.search .center .employment-practices :selected');
		var recruitmentform = $('.search .center .recruitment-form :selected');
		//query.focus();
		//if(query.text().length >0){
		var qdata = {
			fritekst: $.trim(query.text()),
			placeretindenfor: '',
			kontinent: '',
			land: '',
			kommune: '',
			postdistrikt: zipcode.text(),
			erhvervsomraade: ((commercialareas.val() =="0" ) ? '':commercialareas.val() ),
			delomraade: '',
			stillingsbetegnelse: '',
			ansaettelsesvilkaar: ((employmentpractices.val() =="0" ) ? '':employmentpractices.val() ),
			ansaettelsesform: ((recruitmentform.val() =="0" ) ? '':recruitmentform.val() ),
			arbejdstid: '',
			tidligstepubliceringsdato: '',
			hotjob: 1,
			start: '',
			antal: ''
		};
		//save qdata to localStorage
		localStorage.setItem('qdata', JSON.stringify(qdata));
		$.ajax({
			url: 'https://job.jobnet.dk/FindJobService/V1/Gateway.ashx/annonce',
			data: qdata
		}).done(function(rs){
			var items='';
			for(var i=0; i<rs.NumberOfMatches; i++){
				items += newJoblistItem(rs.JobPostingDigests[i]);
			}
			$('body').attr('style', 'width: 500px !important');
			$('.joblist .center').html(items);
			$('.search').hide('fast');
			$('.search .footer .run-query').hide('fast');
			$('.joblist .number-of-matches').html(rs.NumberOfMatches + ' hotjobs fundet');
			$('.joblist .number-of-matches').show('fast');
			$('.joblist').show('fast');
		});
		/*} else {
			query.addClass('input-error');
			setTimeout(function(){
				query.removeClass('input-error');
			}, 2000);
		}*/
	});


	//VIEWJOB
	$('.joblist .center').on('click', '.item', function(event){
		var annonceid = $(event.target).attr('data-id');
		if(annonceid != undefined){
			$.ajax({
				url: 'https://job.jobnet.dk/FindJobService/V1/Gateway.ashx/annonce/'+ annonceid
			}).done(function(rs){
				$('.jobview .center').html('<h1 class="openurl">'+
						'<a href="https://job.jobnet.dk/CV/findjob/Details/'+rs.Id+'" target="_blank">'+ rs.JobPositionInformation.PositionTitle+'</a>'+
					'</h1><div class="purpose">'+rs.JobPositionInformation.Purpose+'</div>' );
				$('.joblist').hide('fast');
				$('.jobview').show('fast');
			});
		}
	});
});
