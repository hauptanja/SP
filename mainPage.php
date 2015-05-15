<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href='http://fonts.googleapis.com/css?family=Poiret+One' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Arimo:700' rel='stylesheet' type='text/css'>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="script.js"></script>
        <meta charset="utf-8"/>
    </head>
    <body>
        <div class="tabs">
            <ul class="tab-links">
                <li class="active"><a href="#main">GLAVNA STRAN</a></li>
                <li><a href="#login">PRIJAVA</a></li>
                <li><a href="#register">REGISTRACIJA</a></li>
                <li><a href="#user_profile">MOJ PROFIL</a></li>
            </ul>
            <div id="banner"></div>
            <div class="tab-content">
                <div id="main" class="tab active">
                    <ul class="search-opt">
                        <li><a href="#namesearch">Iskanje po naslovu filma</a>
                            <div class="opt" id="namesearch">
                                <input type="text" id="movieSearchBox" placeholder="Vpišite film, ki Vam je všeč" class="inputField"/>
                            </div> 
                        </li>
                        <li><a href="#browsecateg">Brskaj po žanrih</a>
                            <div class="opt" id="browsecateg">
                                <input type="checkbox" class="categories">Grozljivka <br>
                                <input type="checkbox" class="categories">Akcija <br>
                                <input type="checkbox" class="categories">Romantični film
                            </div>
                        </li>
                        <li><a href="#advancedsearch">Napredno iskanje</a>
                            <div class="opt" id="advancedsearch">
                                advancedsearch
                            </div>
                        </li>
                    </ul>
                    
                </div>
                <div id="login" class="tab">
                    <div id="userLogin">
				    <h1>Prijava</h1>
				        <form action="" method="post">
					    <div>Uporabniško ime :</div>
					    <input id="userName" name="username" type="text" class="inputField">
					    <div>Geslo :</div>
					    <input id="userPass" name="password" type="password" class="inputField">
					    <input id="loginButton" name="submit" type="submit" value="PRIJAVA">
				        </form>
				    </div>
                </div>
                <div id="register" class="tab">
                    <h1>Registracija</h1>
                        <table id="tabelaR">
                            <tr><td>Uporabniško ime:</td><td><input type="text" name="username" class="inputField"/></td></tr>
                            <tr><td>Geslo:</td><td><input type="password" name="password" class="inputField"/></td></tr>
                            <tr><td>Email:</td><td><input type="text" name="email" class="inputField"/></td></tr>
                            <tr><td>Ime:</td><td><input type="text" name="name" size="15" class="inputField"/></td></tr>
                            <tr><td>Priimek:</td><td><input type="text" name="lastname" size="15" class="inputField"/></td></tr>
                            <tr><td>Spol:</td><td><select name="gender">
                            <option value="male">Moški</option>
                            <option value="female">Ženski</option></select></td></tr>
                        </table>
                        <input type="submit" name="submit" value="REGISTRACIJA" id="registriraj"/>      
                    
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
                    <input type="button" value="Nazaj" id="#back_to_list_button"/>
                    <div id="film_details">
                        <h2 id="slo_naslov">Naslov filma</h2>
                        <h3 id="ang_naslov">Title</h3>
                        <div id="genre"></div>
                        <div id="duration"></div>
                        <div id="year"></div>
                        <div id="country"></div>
                        <br>
                        <div id="summary"></div>
                    </div>
                </div>
                <!--- za prikaz seznama ---->
                <div id="film_list" class="tab">
                    <table id="film_list_table">
                        <th>
                            <td></td>
                            <td>Naslov filma</td>
                            <td>Ocena</td>
                        </th>
                    </table>
                </div>
            </div>
			<div id="footer"></div>
        </div>
    </body>
</html>
