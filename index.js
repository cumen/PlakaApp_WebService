var express = require('express');
var moment = require('moment');
var mysql = require('mysql');
var app = express();
var crypto = require('crypto');

var server = app.listen(3000,listening);

app.use(express.static('website'));

app.get('/Kekle/:K_Adi/:K_Parola/:K_Mail/:K_Soru/:K_Cevap',Kekle); //Kullanıcı ekle
app.get('/Kgiris/:K_Mail/:K_Parola',Kgiris); //Kullanıcı girişi
app.get('/Klistele',Klistele); //Kullanıcı listele
app.get('/Kguncelle/:ID/:Admin/:K_Adi/:K_Parola/:K_Rep/:K_Mail/:K_Soru/:K_Cevap',Kguncelle);//Kullanıcı güncelle
app.get('/Ksil/:ID',Ksil);//Kullanıcı sil

app.get('/Cekle/:AracCins',Cekle);//Cins Ekle
app.get('/Clistele',Clistele);//Cins Listele
app.get('/Cguncelle/:ID/:AracCins',Cguncelle);//Cins Güncelle
app.get('/Csil/:ID',Csil);//Cins sil

app.get('/Tekle/:CinsID/:TurAdi',Tekle);//Tür Ekle
app.get('/Tlistele',Tlistele);//Tür Listele
app.get('/Tguncelle/:ID/:CinsID/:TurAdi',Tguncelle);//Tür Güncelle
app.get('/Tsil/:ID',Tsil);//Tür sil

app.get('/Pekle/:Plaka/:CinsID/:TurID/:AracRengi',Pekle);//Plaka Ekle
app.get('/Plistele',Plistele);//Plaka Listele
app.get('/Pguncelle/:ID/:Plaka/:CinsID/:TurID/:AracRengi',Pguncelle);//Plaka Güncelle
app.get('/Psil/:ID',Psil);//Plaka sil
app.get('/Psorgula/:Plaka',Psorgula);//Plaka sorgula

app.get('/Soruekle/:SoruMetin',Soruekle);//Soru Ekle
app.get('/Sorulistele',Sorulistele);//Soru Listele
app.get('/Soruguncelle/:ID/:SoruMetin',Soruguncelle);//Soru Güncelle
app.get('/Sorusil/:ID',Sorusil);//Soru sil

app.get('/Yekle/:PlakaID/:YazarID/:KonumID/:Yazi',Yekle);//Yazi Ekle
app.get('/Ylistele',Ylistele);//Yazi Listele
app.get('/Yguncelle/:ID/:PlakaID/:YazarID/:KonumID/:Yazi/:Rep',Yguncelle);//Yazi Güncelle
app.get('/Ysil/:ID',Ysil);//Yazi sil

app.get('/Ilistele',Ilistele);//İller Listele

app.get('/Takiplistele',Takiplistele);//Takip Listele
app.get('/Takipekle/:UyeID/:PlakaID',Takipekle);//Takip Ekle
app.get('/Takipsil/:UyeID/:PlakaID',Takipsil);//Takip sil
app.get('/Takipguncelle/:UyeID/:PlakaID',Takipguncelle);//Takip güncelle


function GetConnection(){
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "v2pXuX3ZqR5UWZGE", 
    database: "plakaapp_db"
  });
  return con;
}
 

/*
function GetConnection(){
    var con = mysql.createConnection({
        host: "127.0.0.1",
        user: "phpmyadmin",
        password: "1234", 
        database: "plakaapp_db"
      });
    return con;
}
*/
 
function listening(){
     console.log("Listening..");   

}
//--------------------------------------------

/*
            AÇIKLAMA
durum = basarili    --->  İşlem başarılı
durum = 99          --->  Sql hatası
durum = 8           --->  Kayıt bulunamadı
durum = 1           --->  Aynı kayıttan mevcut

*/

//--------------------------------------------

//Kullanıcı Ekle 
function Kekle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var K_Adi = data.K_Adi;
    var K_Parola = data.K_Parola;
    var K_Mail = data.K_Mail.toLowerCase();
    var K_Soru = data.K_Soru;
    var K_Cevap = data.K_Cevap;
    var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
   K_Parola = crypto.createHash('md5').update(K_Parola).digest("hex");

    var sql = "SELECT * from uyeler where K_Mail ='" + K_Mail + "' OR K_Adi ='" + K_Adi + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" 
                }
                // 99 : Error

            });
        }
        if(results.length == 0){ //aynı mail adresinden yoksa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
            });

            var sql = "INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
            var params = ['uyeler', 'K_Adi', 'K_Sifre', 'K_Mail', 'K_Soru', 'K_Cevap', 'FirstLogin', K_Adi, K_Parola, K_Mail, K_Soru, K_Cevap, date];
            sql = mysql.format(sql, params);  
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Veritabanına eklendi
                }
                res.json(reply);
            }); 
            
            con.end(function(err, q) {
                if (err) throw err;
            });
            
        }
        else{
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "1" 
                }
                // 1 : Kayıt Var
            });
        }

    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Giriş Kontrol 
function Kgiris(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var K_Parola = data.K_Parola;
    var K_Mail = data.K_Mail;
    
    K_Parola = crypto.createHash('md5').update(K_Parola).digest("hex");

    var sql = "SELECT * from uyeler where K_Mail ='" + K_Mail + "' and K_Sifre ='" + K_Parola + "'";    
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }
            });
        }
        if(results.length == 0){ //Giriş başarısızsa
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kullanıcı yoksa
                }
            });
                    
        }
        else{ //Giriş başarlıysa
            //kullanıcı bilgilerinin alınması
                    var K_ID = results[0].ID;
                    var Admin = results[0].Admin;
                    var K_Adi = results[0].K_Adi;
                    var K_Rep = results[0].K_Rep;
                    var K_Mail = results[0].K_Mail;
                    var K_Soru = results[0].K_Soru;
                    var K_Cevap = results[0].K_Cevap;
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            return res.json({
                "message":
                {
                    "id" : K_ID,
                    "admin" : Admin,
                    "adi" : K_Adi,
                    "rep" : K_Rep,
                    "mail" : K_Mail,
                    "soru" : K_Soru,
                    "cevap" : K_Cevap,
                    "durum" : "basarili"
                }
            });
        }

    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Kullanıcı Listele
function Klistele(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });
    
    var data = req.params;
    var sql = "SELECT * from uyeler;"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Tablo boş
                }
            });        
        }
        else{ //Tablo dolu ise
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "ID" : results[key].ID,
                        "Admin" : results[key].Admin,
                        "K_Adi" : results[key].K_Adi,
                       "K_Rep" : results[key].K_Rep,
                        "K_Mail" : results[key].K_Mail,
                        "K_Soru" : results[key].K_Soru,
                        "K_Cevap" : results[key].K_Cevap,
                        "durum" : "basarili"
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Kullanıcı Güncelle
function Kguncelle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var Admin = data.Admin;
    var K_Adi = data.K_Adi;
    var K_Parola = data.K_Parola;
    var K_Rep = data.K_Rep;
    var K_Mail = data.K_Mail.toLowerCase();
    var K_Soru = data.K_Soru;
    var K_Cevap = data.K_Cevap;
    var bosmu = false;

    if(K_Parola == "~~"){
        bosmu = true;
    }

    var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
    K_Parola = crypto.createHash('md5').update(K_Parola).digest("hex");

    var sql = "SELECT * from uyeler where ID =" + ID + "";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kullanıcı yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt Bulunamdı
                }
            });
        }
        else{ // Kullanıcı varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "select * from uyeler where (K_Mail ='"+K_Mail+"' or K_Adi = '"+K_Adi+"') AND NOT ID="+ID;
            con.query(sql, function (error, results) {
                if (error){
                    res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
        
                    });
                }
                if(results.length != 0){ //Kullanıcı mail veya adı benzerse
                    res.set({
                        'content-type': 'application/json',
                        'content-length': '100',
                        'warning': "with content type charset encoding will be added by default"
                     });
                    res.json({
                        "message":
                        {
                            "durum" : "1" //Kayıt mevcut
                        }
                    });
                }
                else{
                    var con = GetConnection();
                    con.connect(function(err, q) {
                        if (err) throw err;
                    });

                    var sql = "UPDATE uyeler SET Admin = '" + Admin + "', K_Adi = '" + K_Adi + "', K_Rep = '" + K_Rep + "', K_Mail = '" + K_Mail + "', K_Soru = '" + K_Soru + "', K_Cevap = '" + K_Cevap + "'"+((bosmu)?"":", K_Sifre = '" + K_Parola + "'")+" where ID ='" + ID + "'";
                    con.query(sql, function (error, results) {
                        if (error){
                            return res.send({
                                "message":
                                {
                                    "durum" : "99" //Sql hatası
                                }
                            });
                        }
                        res.set({
                            'content-type': 'application/json',
                            'content-length': '100',
                            'warning': "with content type charset encoding will be added by default"
                        });
                        reply = {
                            "message":
                            {
                                "durum" : "basarili" 
                            } //Güncelleme işlemi başarılı
                        }
                        res.json(reply);
                    });

                    con.end(function(err, q) {
                        if (err) throw err;
                    });
                }  
            });
            
            con.end(function(err, q) {
                if (err) throw err;
            });
            
        }
    });
    con.end(function(err, q) {
        if (err) throw err;
    });
}

//Kullanıcı Sil
function Ksil(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from uyeler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kullanıcı yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt Bulunamadı
                }
            });
        }
        else{ // Kullanıcı varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "DELETE FROM uyeler where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" //Sql hatası
                    } //Silme işlemi başarılı
                }
                res.json(reply);
            });    
        }

        con.end(function(err, q) {
            if (err) throw err;
          });

    });
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//--------------------------------------------

//Cins Ekle
function Cekle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var Cins = data.AracCins;
    Cins = Cins.toUpperCase();

    var sql = "SELECT * from cinsler where AracCins ='" + Cins + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Cins Yoksa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "INSERT INTO ?? (??) VALUES (?)";
            var params = ['cinsler', 'AracCins', Cins];
            sql = mysql.format(sql, params);  
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Veritabanına eklendi
                }
                res.json(reply);
            });    
        }
        else{
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "1" 
                }
                // 1 : Cins var
            });
        }

        con.end(function(err, q) {
            if (err) throw err;
          });

    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Cins Listele
function Clistele(req, res){
    
    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });
      
    var data = req.params;
    var sql = "SELECT * from cinsler;"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt bulunamadı
                }
            });        
        }
        else{ //Tablo dolu ise
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "ID" : results[key].ID,
                        "AracCins" : results[key].AracCins,
                        "durum" : "basarili"
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Cins Güncelle
function Cguncelle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var Cins = data.AracCins;
    Cins = Cins.toUpperCase();

    var sql = "SELECT * from cinsler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Cins yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Kullanıcı bulunamadı
            });
        }
        else{ // Kullanıcı varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "UPDATE cinsler SET AracCins = ? where ID = ?";
            params = [Cins,ID];
            sql = mysql.format(sql, params);
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Güncelleme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Cins Sil
function Csil(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from cinsler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Cins yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt Bulunamadı
                }
            });
        }
        else{ // Cins varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "DELETE FROM cinsler where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Silme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//--------------------------------------------

//Tür Ekle
function Tekle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var cinsID = data.CinsID
    var tur = data.TurAdi;
    tur = tur.toUpperCase();

    var sql = "SELECT * from turler where TurAdi ='" + tur + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tür Yoksa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "INSERT INTO ?? (??,??) VALUES (?,?)";
            var params = ['turler', 'CinsID', 'TurAdi', cinsID, tur];
            sql = mysql.format(sql, params);  
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Veritabanına eklendi
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }
        else{
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "1" 
                }
                // 1 :  Kayıt Mevcut
            });
        }

    });
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Tür Listele
function Tlistele(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var sql = "SELECT * from turler;"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Hiç Kulanıcı Yok
            });        
        }
        else{ //Tablo dolu ise
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "ID" : results[key].ID,
                        "CinsID" : results[key].CinsID,
                        "TurAdi" : results[key].TurAdi,
                        "durum" : "basarili"                        
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Tür Güncelle
function Tguncelle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var Cins = data.CinsID;
    var tur = data.TurAdi;
    tur = tur.toUpperCase();

    var sql = "SELECT * from turler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tür yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt Bulunamadı
                }
            });
        }
        else{ // Kayıt varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "UPDATE turler SET CinsID = ?, TurAdi = ? where ID = ?";
            params = [Cins,tur,ID];
            sql = mysql.format(sql, params);
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Güncelleme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Tür Sil
function Tsil(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from turler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Kayıt Bulunamadı
            });
        }
        else{ // Kayıt varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "DELETE FROM turler where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Silme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//---------------------------------------------

//Plaka Ekle
function Pekle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var Plaka = data.Plaka;
    var CinsID = data.CinsID;
    var TurID = data.TurID;
    var AracRengi = data.AracRengi;
    Plaka = Plaka.toUpperCase();

    var sql = "SELECT * from plakalar where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt Yoksa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)";
            var params = ['plakalar','Plaka', 'CinsID', 'TurID', 'AracRengi',Plaka, CinsID, TurID, AracRengi];
            sql = mysql.format(sql, params);  
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Veritabanına eklendi
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }
        else{
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "99" 
                }// 1 : Kayıt Mevcut
            });
        }

    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Plaka Pistele
function Plistele(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var sql = "SELECT * from plakalar";   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Hiç Kulanıcı Yok
            });        
        }
        else{ //Tablo dolu ise
            //Bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "ID" : results[key].ID,
                        "Plaka" : results[key].Plaka,                        
                        "CinsID" : results[key].CinsID,
                        "TurID" : results[key].TurID,
                        "AracRengi" : results[key].AracRengi, 
                        "durum" : "basarili"                       
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Plaka Püncelle
function Pguncelle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var Plaka = data.Plaka;
    var CinsID = data.CinsID;
    var TurID = data.TurID;
    var AracRengi = data.AracRengi;
    Plaka = Plaka.toUpperCase();

    var sql = "SELECT * from plakalar where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Kayıt bulunamadı
            });
        }
        else{ // Kayıt varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "UPDATE plakalar SET Plaka = ?, CinsID = ?, TurID = ?, AracRengi = ? where ID = ?";
            params = [Plaka,CinsID,TurID,AracRengi,ID];
            sql = mysql.format(sql, params);
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Güncelleme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Plaka Psil
function Psil(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from plakalar where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Kayıt Bulunamadı
            });
        }
        else{ // Kayıt varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "DELETE FROM plakalar where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Silme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Plaka Sorgula
function Psorgula(req, res){
    
        var con = GetConnection();
        con.connect(function(err, q) {
            if (err) throw err;
          });
        
        var data = req.params;
        var Plaka = data.Plaka;

        var sql = "SELECT count(*) as 'yazisayisi' from yazilar where PlakaID = (Select ID from plakalar where Plaka = '" + Plaka + "')";   
        con.query(sql, function (error, results) {
            if (error){
                return res.send({
                    "message":
                    {
                        "durum" : "99" //Sql hatası
                    }
    
                });
            }
            if(results.length == 0){ //Tablo boş ise
                    
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                res.json({
                    "message":
                    {
                        "durum" : "8" 
                    }
                    // 8 : Hiç Kulanıcı Yok
                });        
            }
            else{ //Tablo dolu ise
                //Bilgilerinin alınması
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                });
                var bilgiler = [];
                for (var key in results) {
                    var item={
                        "message" : {
                            "yazisayisi" : results[key].yazisayisi,
                            "durum" : "basarili"                       
                        }
                    }
                    bilgiler.push(item);
                }
                res.json(bilgiler);  
            }
        });
        
        con.end(function(err, q) {
            if (err) throw err;
          });
    }

//--------------------------------------------

//Soru Ekle
function Soruekle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var Soru = data.SoruMetin;
    Soru = Soru.toUpperCase();

    var sql = "SELECT * from sorular where SoruMetin ='" + Soru + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt Yoksa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "INSERT INTO ?? (??) VALUES (?)";
            var params = ['sorular', 'SoruMetin', Soru];
            sql = mysql.format(sql, params);  
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Veritabanına eklendi
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }
        else{
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "1" 
                }
                // 1 : Kayıt var
            });
        }

    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Soru Listele
function Sorulistele(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var sql = "SELECT * from sorular;"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Hiç Kayıt Yok
            });        
        }
        else{ //Tablo dolu ise
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "ID" : results[key].ID,
                        "SoruMetin" : results[key].SoruMetin,
                        "durum" : "basarili"
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Soru Güncelle
function Soruguncelle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var Soru = data.SoruMetin;
    Soru = Soru.toUpperCase();

    var sql = "SELECT * from sorular where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 : Kayıt bulunamadı
            });
        }
        else{ // Kayıt varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "UPDATE sorular SET SoruMetin = ? where ID = ?";
            params = [Soru,ID];
            sql = mysql.format(sql, params);
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Güncelleme işlemi başarılı
                }
                res.json(reply);

                con.end(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });
    
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Soru Sil
function Sorusil(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from sorular where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 8 :  Bulunamadı
            });
        }
        else{ // Soru varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
              });

            var sql = "DELETE FROM sorular where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Silme işlemi başarılı
                }
                res.json(reply);

                var con = GetConnection();
                con.connect(function(err, q) {
                    if (err) throw err;
                  });

            });    
        }

    });
   
    con.end(function(err, q) {
        if (err) throw err;
      });
}

//--------------------------------------------

//Yazi Ekle
function Yekle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var PlakaID = data.PlakaID;
    var YazarID = data.YazarID;
    var KonumID = data.KonumID;
    var Yazi = data.Yazi;
    var Rep = 0;
    var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    var sql = "INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
    var params = ['yazilar', 'PlakaID','YazarID', 'KonumID', 'Yazi', 'Rep', 'YazilmaTarih', PlakaID,YazarID,KonumID,Yazi,Rep,date];
    sql = mysql.format(sql, params);  
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }
            });
        }
        res.set({
            'content-type': 'application/json',
            'content-length': '100',
            'warning': "with content type charset encoding will be added by default"
            });
        reply = {
            "message":
            {
                "durum" : "basarili" //Veritabanına yazıldı
            }
        }
        res.json(reply);
    });    

    con.end(function(err, q) {
        if (err) throw err;
      });
       
}

//Yazi Listele
function Ylistele(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var sql = "SELECT * from yazilar;"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt Bulunmadı
                }
            });        
        }
        else{ //Tablo dolu ise
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "ID" : results[key].ID,
                        "PlakaID" : results[key].PlakaID,
                        "YazarID" : results[key].YazarID,
                        "KonumID" : results[key].KonumID,
                        "Yazi" : results[key].Yazi,
                        "Rep" : results[key].Rep,
                        "YazilmaTarih" : results[key].YazilmaTarih,
                        "durum" : "basarili" 
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Yazi Güncelle
function Yguncelle(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;
    var PlakaID = data.PlakaID;
    var YazarID = data.YazarID;
    var KonumID = data.KonumID;
    var Yazi = data.Yazi;
    var Rep = data.Rep;

    var sql = "SELECT * from yazilar where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }
            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" 
                }
                // 6 : Kayıt bulunamadı
            });
        }
        else{ // Kayıt varsa

            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
            });

            var sql = "UPDATE yazilar SET PlakaID = ?, YazarID = ?, KonumID = ?, Yazi = ?, Rep = ? where ID = ?";
            params = [PlakaID,YazarID,KonumID,Yazi,Rep,ID];
            sql = mysql.format(sql, params);
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //Sql hatası
                        }
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" 
                    } //Güncelleme işlemi başarılı
                }
                res.json(reply);
                con.end(function(err, q) {
                    if (err) throw err;
                });

            });    
        }
    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//Yazi Sil
function Ysil(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from yazilar where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Kayıt yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt bulunamdı
                }
            });
        }
        else{ // Cins varsa
            
            var con = GetConnection();
            con.connect(function(err, q) {
                if (err) throw err;
            });
            
            var sql = "delete from yazilar where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        "message":
                        {
                            "durum" : "99" //sql hatası
                        }
                        
                    });
                }
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    "message":
                    {
                        "durum" : "basarili" //silme işlemi başarılı
                    }
                }

                res.json(reply);
                
                con.end(function(err, q) {
                    if (err) throw err;
                });
                
            });    
        }
    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//--------------------------------------------

//İller Listele
function Ilistele(req, res){

    var con = GetConnection();
    con.connect(function(err, q) {
        if (err) throw err;
      });

    var data = req.params;
    var sql = "SELECT * from Iller"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                "message":
                {
                    "durum" : "99" //Sql hatası
                }

            });
        }
        if(results.length == 0){ //Tablo boş ise
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                "message":
                {
                    "durum" : "8" //Kayıt bulunamadı
                }
            });        
        }
        else{ //Tablo dolu ise
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "message" : {
                        "il_kodu" : results[key].il_kodu,
                        "il_adi" : results[key].il_adi,
                        "durum" : "basarili"
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });

    con.end(function(err, q) {
        if (err) throw err;
      });
}

//--------------------------------------------

//Takip Ekle
function Takipekle(req, res){
    
        var con = GetConnection();
        con.connect(function(err, q) {
            if (err) throw err;
          });
    
        var data = req.params;
        var UyeID = data.UyeID;
        var PlakaID = data.PlakaID;
        var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
        var sql = "INSERT INTO ?? (??,??,??) VALUES (?,?,?)";
        var params = ['takip', 'Uye_ID','Plaka_ID', 'SonBakma', UyeID,PlakaID,date];
        sql = mysql.format(sql, params);  
        con.query(sql, function (error, results) {
            if (error){
                return res.send({
                    "message":
                    {
                        "durum" : "99" //Sql hatası
                    }
                });
            }
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
                });
            reply = {
                "message":
                {
                    "durum" : "basarili" //Veritabanına yazıldı
                }
            }
            res.json(reply);
        });    
    
        con.end(function(err, q) {
            if (err) throw err;
          });
           
}

//Takip Listele
function Takiplistele(req, res){
    
        var con = GetConnection();
        con.connect(function(err, q) {
            if (err) throw err;
          });
    
        var data = req.params;
        var sql = "SELECT * from takip"   
        con.query(sql, function (error, results) {
            if (error){
                return res.send({
                    "message":
                    {
                        "durum" : "99" //Sql hatası
                    }
    
                });
            }
            if(results.length == 0){ //Tablo boş ise
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                res.json({
                    "message":
                    {
                        "durum" : "8" //Kayıt bulunamadı
                    }
                });        
            }
            else{ //Tablo dolu ise
                //kullanıcı bilgilerinin alınması
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                });
                var bilgiler = [];
                for (var key in results) {
                    var item={
                        "message" : {
                            "Uye_ID" : results[key].Uye_ID,
                            "Plaka_ID" : results[key].Plaka_ID,
                            "SonBakma" : results[key].SonBakma,
                            "durum" : "basarili"
                        }
                    }
                    bilgiler.push(item);
                }
                res.json(bilgiler);  
            }
        });
    
        con.end(function(err, q) {
            if (err) throw err;
          });
}

//Takip Sil
function Takipsil(req, res){
    
        var con = GetConnection();
        con.connect(function(err, q) {
            if (err) throw err;
          });
    
        var data = req.params;
        var UyeID = data.UyeID;
        var PlakaID = data.PlakaID;
    
        var sql = "SELECT * from takip where Uye_ID ='" + UyeID + "' and Plaka_ID = '" + PlakaID + "'";
        con.query(sql, function (error, results) {
            if (error){
                res.send({
                    "message":
                    {
                        "durum" : "99" //Sql hatası
                    }
    
                });
            }
            if(results.length == 0){ //Kayıt yoksa
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                res.json({
                    "message":
                    {
                        "durum" : "8" //Kayıt bulunamdı
                    }
                });
            }
            else{ // Cins varsa
                
                var con = GetConnection();
                con.connect(function(err, q) {
                    if (err) throw err;
                });
                
                var sql = "delete from takip where Uye_ID ='" + UyeID + "' and Plaka_ID = '" + PlakaID + "'";
                con.query(sql, function (error, results) {
                    if (error){
                        return res.send({
                            "message":
                            {
                                "durum" : "99" //sql hatası
                            }
                            
                        });
                    }
                    res.set({
                        'content-type': 'application/json',
                        'content-length': '100',
                        'warning': "with content type charset encoding will be added by default"
                     });
                    reply = {
                        "message":
                        {
                            "durum" : "basarili" //silme işlemi başarılı
                        }
                    }
    
                    res.json(reply);
                    
                    con.end(function(err, q) {
                        if (err) throw err;
                    });
                    
                });    
            }
        });
    
        con.end(function(err, q) {
            if (err) throw err;
        });
}

//Takip Güncelle
function Takipguncelle(req, res){
    
        var con = GetConnection();
        con.connect(function(err, q) {
            if (err) throw err;
          });
    
        var data = req.params;
        var UyeID = data.UyeID;
        var PlakaID = data.PlakaID;
        var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
        var sql = "SELECT * from takip where Uye_ID ='" + UyeID + "' and Plaka_ID = '" + PlakaID + "'";
        con.query(sql, function (error, results) {
            if (error){
                res.send({
                    "message":
                    {
                        "durum" : "99" //Sql hatası
                    }
    
                });
            }
            if(results.length == 0){ //Kayıt yoksa
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                res.json({
                    "message":
                    {
                        "durum" : "8" //Kayıt bulunamdı
                    }
                });
            }
            else{ // Cins varsa
                
                var con = GetConnection();
                con.connect(function(err, q) {
                    if (err) throw err;
                });
                
                var sql = "UPDATE takip SET SonBakma = '" + date + "' where Plaka_ID = '" + PlakaID + "' and Uye_ID = '" + UyeID + "'";
              
                con.query(sql, function (error, results) {
                    if (error){
                        return res.send({
                            "message":
                            {
                                "durum" : error //sql hatası
                            }
                            
                        });
                    }
                    res.set({
                        'content-type': 'application/json',
                        'content-length': '100',
                        'warning': "with content type charset encoding will be added by default"
                     });
                    reply = {
                        "message":
                        {
                            "durum" : "basarili" //silme işlemi başarılı
                        }
                    }
    
                    res.json(reply);
                    
                    con.end(function(err, q) {
                        if (err) throw err;
                    });
                    
                });    
            }
        });
    
        con.end(function(err, q) {
            if (err) throw err;
        });
}