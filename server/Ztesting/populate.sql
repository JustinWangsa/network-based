use test_db;


insert into company_t (name) values 
    ("google")
    ,("amazon")
    ,("apple")
;
insert into user_t set
    company_id = (select id from company_t where name="google"),
    isManager = true,name = "google_mg",password = SHA1("google_mg");
insert into user_t set
    company_id = (select id from company_t where name="amazon"),
    isManager = true,name = "amazon_mg",password = SHA1("amazon_mg");
insert into user_t set
    company_id = (select id from company_t where name="apple"),
    isManager = true,name = "apple_mg",password = SHA1("apple_mg");
insert into user_t set
    company_id = (select id from company_t where name="google"),
    isManager = false,name = "google_cs",password = SHA1("google_cs");
insert into user_t set
    company_id = (select id from company_t where name="amazon"),
    isManager = false,name = "amazon_cs",password = SHA1("amazon_cs");
insert into user_t set
    company_id = (select id from company_t where name="apple"),
    isManager = false,name = "apple_cs",password = SHA1("apple_cs");


insert into item_t(company_id,name,currentStock,image) values
    (1,"a",101,''),
    (1,"b",102,''),
    (1,"c",103,''),
    (2,"a",201,''),
    (2,"b",202,''),
    (2,"c",203,''),
    (3,"a",301,''),
    (3,"b",302,''),
    (3,"c",303,'')
;
insert into stock_t(company_id,time,item_id,stock,price) values
    (1,"2020-12-11 16:01:01",1,10111,110111),
    (1,"2020-12-11 16:02:01",2,20111,120111),
    (1,"2020-12-11 16:03:01",3,30111,130111),
    (2,"2020-12-11 16:04:01",4,40111,140111),
    (2,"2020-12-11 16:05:01",5,50111,150111),
    (2,"2020-12-11 16:06:01",6,60111,160111),
    (3,"2020-12-11 16:07:01",7,70111,170111),
    (3,"2020-12-11 16:08:01",8,80111,180111),
    (3,"2020-12-11 16:09:01",9,90111,190111),
    
    (1,"2020-12-11 16:01:02",1,10222,110222),
    (1,"2020-12-11 16:02:02",2,20222,120222),
    (1,"2020-12-11 16:03:02",3,30222,130222),
    (2,"2020-12-11 16:04:02",4,40222,140222),
    (2,"2020-12-11 16:05:02",5,50222,150222),
    (2,"2020-12-11 16:06:02",6,60222,160222),
    (3,"2020-12-11 16:07:02",7,70222,170222),
    (3,"2020-12-11 16:08:02",8,80222,180222),
    (3,"2020-12-11 16:09:02",9,90222,190222),

    (1,"2020-12-11 16:01:03",1,10333,110333),
    (1,"2020-12-11 16:02:03",2,20333,120333),
    (1,"2020-12-11 16:03:03",3,30333,130333),
    (2,"2020-12-11 16:04:03",4,40333,140333),
    (2,"2020-12-11 16:05:03",5,50333,150333),
    (2,"2020-12-11 16:06:03",6,60333,160333),
    (3,"2020-12-11 16:07:03",7,70333,170333),
    (3,"2020-12-11 16:08:03",8,80333,180333),
    (3,"2020-12-11 16:09:03",9,90333,190333)
;

insert into transaction_t(company_id,time,item_id,count) values
    -- company 1
    (1,"2020-12-11 16:01:01",1,11001),
    (1,"2020-12-11 16:01:01",2,12001),
    (1,"2020-12-11 16:01:01",3,13001),
    
    (1,"2020-12-11 16:02:01",1,11002),
    (1,"2020-12-11 16:02:01",2,12002),
    -- (1,"2020-12-11 16:02:01",3,13002),

    -- (1,"2020-12-11 16:03:01",1,11003),
    -- (1,"2020-12-11 16:03:01",2,12003),
    (1,"2020-12-11 16:03:01",3,13003),

    -- company 2
    (2,"2020-12-11 16:01:02",4,24001),
    -- (2,"2020-12-11 16:01:02",5,25001),
    (2,"2020-12-11 16:01:02",6,26001),

    -- (2,"2020-12-11 16:02:02",4,24002),
    (2,"2020-12-11 16:02:02",5,25002),
    (2,"2020-12-11 16:02:02",6,26002),

    -- (2,"2020-12-11 16:03:02",4,24003),
    -- (2,"2020-12-11 16:03:02",5,25003),
    (2,"2020-12-11 16:03:02",6,26003)

;

-- insert into stock_t set 
--     company_id = ?,
--     time = NOW(),
--     item_id = ?,
--     stock = ?,
--     price = ? 