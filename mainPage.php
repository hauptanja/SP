<?php 
session_start(); 
?>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href='http://fonts.googleapis.com/css?family=Poiret+One' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Arimo:700' rel='stylesheet' type='text/css'>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="script.js"></script>
        <meta charset="utf-8"/>
    </head>
    <body>
	    <div id ="website">
		    <div id="banner"></div>
		    <div id="fb-root"></div>
	        <script>
	            (function(d, s, id) {
	              var js, fjs = d.getElementsByTagName(s)[0];
	              if (d.getElementById(id)) return;
	              js = d.createElement(s); js.id = id;
	              js.src = "//connect.facebook.net/sl_SI/sdk.js#xfbml=1&version=v2.3";
	              fjs.parentNode.insertBefore(js, fjs);
	            }(document, 'script', 'facebook-jssdk'));
	        </script>
		    <ul class="tab-links">
	            <?php 
	                if(isset($_SESSION["username"])):?>
	                    <li><a href="#log_out">ODJAVA</a></li>
	                    <li><a href="#user_profile">MOJ PROFIL</a></li>
	            <?php
	                else:?>
	                    <li><a href="#login">PRIJAVA</a></li>
	                    <li><a href="#register">REGISTRACIJA</a></li>
	            <?php
	                endif;
	            ?>
	            <li class="active"><a href="#main">GLAVNA STRAN</a></li>
	        </ul>
	        <div id="inline_elements">
		        <div class="tabs">
		            
		            <div class="tab-content">
		                <div id="main" class="tab active">
			                <h1>Oglejte si...</h1>
		                    <ul class="search-opt">
		                        <li><a href="#namesearch">Iskanje po naslovu filma</a>
		                            <div class="opt" id="namesearch">
		                                <input type="text" id="movieSearchBox" placeholder="Vpišite film, ki Vam je všeč" class="inputField"/>
		                                <ul class="search-result-opt">
		                                </ul>
		                            </div> 
		                        </li>
		                        <li><a href="#browsecateg">Brskaj po žanrih</a>
		                            <div class="opt" id="browsecateg">
		                        		<input type="checkbox" id="cat" class="categories"><label for="cat">drama</label> <br>
		                                <input type="checkbox" id="cat" class="categories"><label for="cat">akcija</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">komedija</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">romantika - ljubezenski</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">animirani</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">zgodovinski</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">grozljivka - shrljivka</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">kriminalka</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">znanstvena fantastika</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">dokumentarec</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">vestern - western</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">mjuzikl - mjuzikal - muzikal</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">glasbeni</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">triler</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">družinski</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">vojni</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">športni</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">parodija</label> <br>
										<input type="checkbox" id="cat" class="categories"><label for="cat">pustolovšcina - pustolovski</label>
		                            </div>
		                        </li>
		                        <li><a href="#advancedsearch">Iskanje po ključnih besedah</a>
		                            <div class="opt" id="advancedsearch">
		                                <input type="text" id="wordSearchBox" placeholder="Vpišite ključne besede ločene s presledki" class="inputField"/>
		                            </div> 
		                        </li>
		                    </ul>
		                    
		                </div>
		                <div id="login" class="tab">
		                    <div id="userLogin">
						    <h1>Prijava</h1>
							    
							    <input id="userName" name="username" type="text" class="inputField" placeholder="Uporabniško ime">
							   
							    <input id="userPass" name="password" type="password" class="inputField" placeholder="Geslo">
							    <br>
							    <button id="loginButton" name="submit" type="button" value="PRIJAVA">PRIJAVA</button>
						    </div>
		                </div>
		                <div id="register" class="tab">
		                    <h1>Registracija</h1>
		                        <table id="tabelaR">
		                            <tr><td>Uporabniško ime:</td><td><input type="text" name="username" id="username1" class="inputField"/></td></tr>
		                            <tr><td>Geslo:</td><td><input type="password" name="password" id="password" class="inputField"/></td></tr>
		                            <tr><td>Email:</td><td><input type="text" name="email" id="email" class="inputField"/></td></tr>
		                            <tr><td>Ime:</td><td><input type="text" name="name" size="15" id="name" class="inputField"/></td></tr>
		                            <tr><td>Priimek:</td><td><input type="text" name="lastname" id="lastname" size="15" class="inputField"/></td></tr>
		                            <tr><td>Spol:</td><td><select name="gender" id="gender">
		                            <option value="male">Moški</option>
		                            <option value="female">Ženski</option></select></td></tr>
		                        </table>
		                    <button type="button" name="submit" value="REGISTRACIJA" id="registriraj">REGISTRACIJA</button>
		                </div>
		                <div id="user_profile" class="tab">
		                    <div id="container">
		                        <div id="content"><a>Lorem ipsum</a></div>
		                        <div id="navigation">
		                            <ul id="nav">
		                                <li><a href="#user_profile">Moj profil</a></li>
		                                <li><a href="#favs">Priljubljeni filmi</a></li>
		                                <li><a href="#watched">Ogledani filmi</a></li>
		                                <li><a href="#prefs">Nastavitve računa</a></li>
		                            </ul>
		                        </div>
		                    </div>
		                </div>
		                <div id="film_profile" class="tab">
		                    <div id="film_details">
		                        <div id="button_gledano"></div>
		                        <input type="hidden" id="id_filma"/>
		                        <img id="poster"/>
		                        <div id="naslov_div">
		                        <h2 id="slo_naslov"></h2>
		                        <h3 id="ang_naslov"></h3>
		                    	</div>
		                        <div id="genre"></div>
		                        <div id="duration"></div>
		                        <div id="year"></div>
		                        <div id="country"></div>
		                        <div id="ocenaRT"></div>
								<div id="ocenaAU"></div>
		                        <br>
		                        <div id="summary"></div>
                                <div class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button_count"></div>
		                        <!--<table class="film_list_table"></table>-->
		                        <div id="sporedKino"></div>
		                        <br>
								<div class="sporedTV"><strong>TV SPORED</strong></div>
								<table id="kanal"></table>
								<table id="spored_prikaz"></table>
		                    </div>
		                </div>
		                
		                <!--- za prikaz seznama ---->
		                <div id="film_list" class="tab">
                            <div id="button_gledano_n"></div>
		                    <div id="vpisan_film"></div>
		                    <div id = "film_list_data">
			                   	<div id = 'blockDiv'>
									<table id="film_list_table"></table>
									<br>
									<a href="#next6" style="float: left;"><img src='li_arrow.png'/> Naslednjih 6</a>
			                   	</div>
			                    <div id="okvir_list">
				                    <div id = "slo_naslov_d"></div>
				                    <div id = "ang_naslov_d"></div>
				                    <div id = "pod_div">
				                    <div id = "genre_d"></div>
				                    <div id = "tomatoscore_d"></div>
				                    <div id = "audience_d"></div>
				                    <div id = "spored_d"></div>
				                    </div>
			                    </div>
			                   
			                    
		                    </div>
		                    
		                    
		                </div>
		                <div id="filmi_list" class="tab">
		                    <input type="button" value="Nazaj" id="back_to_genre_button"/>
		                    <table id="filmi"></table>
		                </div>
		                
		                <div id="opcije_list" class="tab">
		                    <!<input type="button" value="Nazaj" id="back_to_genre_button"/>
		                    <div id="opcije_div">
			                    <ul class="opcije_ul"></ul>
		                    </div>
		                </div>
		                <!-- <div id="filmi_prikaz" class="tab">
		                    <input type="button" value="Nazaj" id="back_to_genre"/>
		                    <div id="film_prikaz"></div>
			  	    <table id ="film_prikaz_table"></table>
		                </div> -->
		            </div>
		        </div>
		        <div id="najboljse_ocenjeni_filmi">
			        <div id="best_control"></div>
		            <!--<h2><img src="star.png" class="starIMG"/>TOP 5<img src="star.png" class="starIMG"/></h2>-->
		            <table id="best_film_table"></table>
		        </div>
		        <div id="najvec_gledani_filmi">
			        <div id="most_watched_control"></div>
		            <!--<h2><img src="camera.png" class="starIMG"/>TOP 5<img src="camera.png" class="starIMG"/></h2>-->
		            <table id="most_watched_table"></table>
		        </div>
	        </div>
	        <!----
			<div id="footer"></div>
	        ----> 
	        <!--</div>-->
	    </div>
    </body>
</html>
