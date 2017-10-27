console.log("deneme");

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
app.get('/Ksil/:ID',Ksil);

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "phpmyadmin",
    password: "1234", 
    database: "plakaapp_db"
  });
  
  con.connect(function(err, q) {
    if (err) throw err;
    console.log("Connected!");
  });

function listening(){
     console.log("Listening..");   

}

//Kullanıcı ekleme fonksiyonu
function Kekle(req, res){
    var data = req.params;
    var K_Adi = data.K_Adi;
    var K_Parola = data.K_Parola;
    var K_Mail = data.K_Mail;
    var K_Soru = data.K_Soru;
    var K_Cevap = data.K_Cevap;
    var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
   K_Parola = crypto.createHash('md5').update(K_Parola).digest("hex");

    var sql = "SELECT * from uyeler where K_Mail ='" + K_Mail + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                sonuc: 99
                // 99 : Error

            });
        }
        if(results.length == 0){ //aynı mail adresinden yoksa
            var sql = "INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
            var params = ['uyeler', 'K_Adi', 'K_Sifre', 'K_Mail', 'K_Soru', 'K_Cevap', 'FirstLogin', K_Adi, K_Parola, K_Mail, K_Soru, K_Cevap, date];
            sql = mysql.format(sql, params);  
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        sonuc: 2
                        // 2 : Sql hatası
                    });
                }
                console.log("Veritabanina yazildi");
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    sonuc: '0' //Veritabanına eklendi
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
                sonuc: '1'
                // 1 : kullanıcı var
            });
        }

    });
}

//Giriş Kontrol Fonksiyonu
function Kgiris(req, res){
    var data = req.params;
    var K_Parola = data.K_Parola;
    var K_Mail = data.K_Mail;
    
    K_Parola = crypto.createHash('md5').update(K_Parola).digest("hex");

    var sql = "SELECT * from uyeler where K_Mail ='" + K_Mail + "' and K_Sifre ='" + K_Parola + "'";    
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                sonuc: 99
                // 99 : Error

            });
        }
        if(results.length == 0){ //Giriş başarısızsa
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                sonuc: '4'
                // 4 : Kullanıcı bilgileri yanlış
                // 4 : Kullanıcı girişi başarısız
            });
                    
        }
        else{ //Giriş başarlıysa
            console.log("Giriş Başarılı");

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
                "id" : K_ID,
                "admin" : Admin,
                "adi" : K_Adi,
                "rep" : K_Rep,
                "mail" : K_Mail,
                "soru" : K_Soru,
                "cevap" : K_Cevap
            });
        }

    });
}

//Kullanıcı Listele
function Klistele(req, res){
    var data = req.params;
    var sql = "SELECT * from uyeler;"   
    con.query(sql, function (error, results) {
        if (error){
            return res.send({
                sonuc: '99'
                // 99 : Error

            });
        }
        if(results.length == 0){ //Tablo boş ise
                
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                sonuc: '5'
                // 5 : Hiç Kulanıcı Yok
            });        
        }
        else{ //Tablo dolu ise
            console.log("Tablo dolu");
            //kullanıcı bilgilerinin alınması
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
            });
            var bilgiler = [];
            for (var key in results) {
                var item={
                    "user" : {
                        "ID" : results[key].ID,
                        "Admin" : results[key].Admin,
                        "K_Adi" : results[key].K_Adi,
                       "K_Rep" : results[key].K_Rep,
                        "K_Mail" : results[key].K_Mail,
                        "K_Soru" : results[key].K_Soru,
                        "K_Cevap" : results[key].K_Cevap
                    }
                }
                bilgiler.push(item);
            }
            res.json(bilgiler);  
        }
    });
}

//Kullanıcı Güncelle
function Kguncelle(req, res){
    var data = req.params;
    var ID = data.ID;
    var Admin = data.Admin;
    var K_Adi = data.K_Adi;
    var K_Parola = data.K_Parola;
    var K_Rep = data.K_Rep;
    var K_Mail = data.K_Mail;
    var K_Soru = data.K_Soru;
    var K_Cevap = data.K_Cevap;
    var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
    K_Parola = crypto.createHash('md5').update(K_Parola).digest("hex");

    var sql = "SELECT * from uyeler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                sonuc: 99
                // 99 : Error

            });
        }
        if(results.length == 0){ //Kullanıcı yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                sonuc: '6'
                // 6 : Kullanıcı bulunamadı
            });
        }
        else{ // Kullanıcı varsa
            var sql = "UPDATE uyeler SET Admin = '" + Admin + "', K_Adi = '" + K_Adi + "', K_Sifre = '" + K_Parola + "', K_Rep = '" + K_Rep + "', K_Mail = '" + K_Mail + "', K_Soru = '" + K_Soru + "', K_Cevap = '" + K_Cevap + "' where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        sonuc: 3
                        // 3 : Sql hatası
                    });
                }
                console.log("Veritabanina yazildi");
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    sonuc: '7' //Güncelleme işlemi başarılı
                }
                res.json(reply);
            });    
        }

    });
}

//Kullanıcı Sil
function Ksil(req, res){
    var data = req.params;
    var ID = data.ID;

    var sql = "SELECT * from uyeler where ID ='" + ID + "'";
    con.query(sql, function (error, results) {
        if (error){
            res.send({
                sonuc: 99
                // 99 : Error

            });
        }
        if(results.length == 0){ //Kullanıcı yoksa
            res.set({
                'content-type': 'application/json',
                'content-length': '100',
                'warning': "with content type charset encoding will be added by default"
             });
            res.json({
                sonuc: '8'
                // 8 : Kullanıcı bulunamadı
            });
        }
        else{ // Kullanıcı varsa
            var sql = "DELETE FROM uyeler where ID ='" + ID + "'";
            con.query(sql, function (error, results) {
                if (error){
                    return res.send({
                        sonuc: 9
                        // 9 : Sql hatası
                    });
                }
                console.log("Kullanıcı Silindi");
                res.set({
                    'content-type': 'application/json',
                    'content-length': '100',
                    'warning': "with content type charset encoding will be added by default"
                 });
                reply = {
                    sonuc: '10' //Silme işlemi başarılı
                }
                res.json(reply);
            });    
        }

    });
}