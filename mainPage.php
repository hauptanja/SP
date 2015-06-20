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
        <style type="text/css">
			body {background-color: #d7d7d7}
		</style> 
    </head>
    <body>
        <script>(function(d, s, id){var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src ='//connect.facebook.net/sl_SI/sdk.js#xfbml=1&version=v2.3';fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));</script>
        
	    <div id ="website">
		    <div id="banner"></div>
		    <div id="fb-root"></div>
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
		                                <table class="search-result-opt" cellspacing="5">
		                                </table>
		                            </div> 
		                        </li>
		                        <li><a href="#browsecateg">Brskaj po žanrih</a>
		                            <div class="opt" id="browsecateg">
		                        		<table id="zanri" style="color:#3B2440;">
										<tr>
											<td class="categories">drama</td>
											<td class="categories">akcija</td>
											<td class="categories">komedija</td>
											<td class="categories">romantika</td>
										</tr>
										<tr>
											<td class="categories">animirani</td>
											<td class="categories">zgodovinski</td>
											<td class="categories">grozljivka</td>
											<td class="categories">kriminalka</td>
										</tr>
										<tr>
											<td class="categories">znanstvena<br> fantastika</td>
											<td class="categories">dokumentarec</td>
											<td class="categories">vestern</td>
											<td class="categories">mjuzikl</td>
										</tr>
										<tr>
											<td class="categories">glasbeni</td>
											<td class="categories">triler</td>
											<td class="categories">družinski</td>
											<td class="categories">vojni</td>
										</tr>
										<tr>
											<td class="categories">športni</td>
											<td class="categories">parodija</td>
											<td class="categories">pustolovšcina</td>
										</tr>
									</table>
		                            </div>
		                        </li>
		                        <!--
		                        <li><a href="#advancedsearch">Iskanje po ključnih besedah</a>
		                            <div class="opt" id="advancedsearch">
		                                <input type="text" id="wordSearchBox" placeholder="Vpišite ključne besede ločene s presledki" class="inputField"/>
		                            </div> 
		                        </li>
		                        -->
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
			                <div id="profil_menu">
			                    <select id="profil_menu_select">
								  <option value="moj_profil">Moj profil</option>
								  <option value="ogledani_filmi">Ogledani filmi</option>
								  <option value="nastavitve_racuna">Nastavitve računa</option>
								</select>
			                </div>
			                <div id="profil_opt">
				                <div id="moj_profil">
					                
									<h2 id="p_name"></h2>
									<strong>Oglejte si...</strong>
					                <div id="p_nakljucni_filmi">
					                   	<table id="nakljucni_film_table"></table>
					                </div>
		                    
				                </div>
				                <div id="ogledani_filmi">
					                <table id="seznam_gledanih"></table>
				                </div>
				                <div id="nastavitve_racuna">
					                <div id="spr_container">
						                <input type="text" id="spr_ime" class = "spr_podatke inputField"/><br>
						                <input type="text" id="spr_priimek" class = "spr_podatke inputField"/><br>
						                <input type="text" id="spr_email" class = "spr_podatke inputField"/><br>
						                <select name="gender" id="spr_spol" class = "spr_podatke inputField">
			                            	<option value="male">Moški</option>
											<option value="female">Ženski</option>
										</select><br>
						                <button type="submit" id="spr_shrani">Shrani spremembe</button>
					                </div>
				                </div>
			                </div>
		                </div>
		                <div id="film_profile" class="tab">
		                    <div id="film_details">
		                        <div id="button_gledano"></div>
		                        <input type="hidden" id="id_filma"/>
		                        <img id="poster"/>
		                        <div id="movie_data">
			                        <div id="naslov_div">
				                        <h2 id="slo_naslov"></h2>
				                        <h3 id="ang_naslov"></h3>
			                    	</div>
		                    	
			                        <div id="genre"></div>
			                        <div id="duration"></div>
			                        <div id="year"></div>
			                        <div id="country"></div>
			                        <table><tr>
			                        <td id="ocenaRT"></td>
									<td id="ocenaAU"></td>
			                        </tr></table>
		                    	</div>
		                       
		                        <div id="summary"></div>
                                <div id="facebookShare"></div>
		                        
		                        <br>
								<div class='sporedKino'><strong>KINO SPORED</strong><img width="35" height="27" src='cinema.jpg'/></div>
		                        <table id="kinoSpored"></table>
		                        <br>
								<div class="sporedTV"><strong>TV SPORED</strong><img width="35" height="27" src='tv.png'/></div>
								<table id="kanal"></table>
								<table id="spored_prikaz"></table>
		                    </div>
		                </div>
		                
		                
		                <div id="film_list" class="tab">
                            <div id="button_gledano_n"></div>
		                    <div id="vpisan_film"></div>
		                    <div id = "film_list_data">
			                   	<table id="film_list_table"></table>
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
		                    <button type = "submit" id="next6_button" class="naprej_nazaj_b">Naslednjih 6  <img src='li_arrow.png'/> </button>
							<button type = "submit" id="prev6_button" class="naprej_nazaj_b"> <img src='li_arrow_left.png'/>  Prejšnjih 6 </button>
		                </div>
		                <div id="filmi_list" class="tab">
		                    <input type="button" value="Nazaj" id="back_to_genre_button"/>
		                    <table id="filmi" cellspacing="5"></table>
		                </div>
		                
		                <div id="opcije_list" class="tab">
		                    <!<input type="button" value="Nazaj" id="back_to_genre_button"/>
		                    <div id="opcije_div">
			                    <ul class="opcije_ul"></ul>
		                    </div>
		                </div>
		                
		            </div>
		        </div>
		        <div id="najboljse_ocenjeni_filmi">
			        <div id="best_control">TOP 6</div>
		            
		            <table id="best_film_table"></table>
		        </div>
		        <div id="najvec_gledani_filmi">
			        <div id="second_c">TOP 6</div>
		            <table id="most_watched_table"></table>
		        </div>
	        </div>
	        
	    </div>
    </body>
</html>
