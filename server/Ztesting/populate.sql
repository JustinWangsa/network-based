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


insert into item_t(company_id,name,type,currentStock,image) values
    (1,"a","food",1000,''),
    (1,"b","food",2000,''),
    (1,"c","drnk",3000,''),
    (2,"a","food",4000,''),
    (2,"b","food",5000,''),
    (2,"c","drnk",6000,''),
    (3,"a","food",7000,''),
    (3,"b","food",8000,''),
    (3,"c","drnk",9000,'')
;
insert into stock_t(company_id,time,item_id,stock,price) values
    (1,"2020-12-11 16:00:00",1,10,100),
    (1,"2020-12-11 16:00:00",2,20,200),
    (1,"2020-12-11 16:00:00",3,30,300),
    (2,"2020-12-11 16:00:00",4,40,400),
    (2,"2020-12-11 16:00:00",5,50,500),
    (2,"2020-12-11 16:00:00",6,60,600),
    (3,"2020-12-11 16:00:00",7,70,700),
    (3,"2020-12-11 16:00:00",8,80,800),
    (3,"2020-12-11 16:00:00",9,90,900),
    
    (1,"2020-12-11 16:01:01",1,11,101),
    (1,"2020-12-11 16:01:02",2,21,201),
    (1,"2020-12-11 16:01:03",3,31,301),
    (2,"2020-12-11 16:02:04",4,41,401),
    (2,"2020-12-11 16:02:05",5,51,501),
    (2,"2020-12-11 16:02:06",6,61,601),
    (3,"2020-12-11 16:03:07",7,71,701),
    (3,"2020-12-11 16:03:08",8,81,801),
    (3,"2020-12-11 16:03:09",9,91,901),

    (1,"2020-12-11 16:09:09",1,12,102),
    (1,"2020-12-11 16:09:09",2,22,202),
    (1,"2020-12-11 16:09:09",3,32,302),
    (2,"2020-12-11 16:09:09",4,42,402),
    (2,"2020-12-11 16:09:09",5,52,502),
    (2,"2020-12-11 16:09:09",6,62,602),
    (3,"2020-12-11 16:09:09",7,72,702),
    (3,"2020-12-11 16:09:09",8,82,802),
    (3,"2020-12-11 16:09:09",9,92,902)
;

insert into transaction_t(company_id,time,item_id,count) values
    -- company 1
    (1,"2020-12-11 16:01:01",1,1001),
    -- (1,"2020-12-11 16:01:01",2,2001),
    -- (1,"2020-12-11 16:01:01",3,3001),
    
    (1,"2020-12-11 16:01:02",1,1002),
    (1,"2020-12-11 16:01:02",2,2002),
    (1,"2020-12-11 16:01:02",3,3002),

    -- (1,"2020-12-11 16:01:03",1,1003),
    (1,"2020-12-11 16:01:03",2,2003),
    (1,"2020-12-11 16:01:03",3,3003),

    -- company 2
    (2,"2020-12-11 16:01:02",4,24001),
    -- (2,"2020-12-11 16:01:02",5,25001),
    (2,"2020-12-11 16:01:02",6,26001),

    -- (2,"2020-12-11 16:02:02",4,24002),
    (2,"2020-12-11 16:02:02",5,25002),
    -- (2,"2020-12-11 16:02:02",6,26002),

    (2,"2020-12-11 16:03:02",4,24003),
    (2,"2020-12-11 16:03:02",5,25003),
    (2,"2020-12-11 16:03:02",6,26003)

;

-- insert into stock_t set 
--     company_id = ?,
--     time = NOW(),
--     item_id = ?,
--     stock = ?,
--     price = ? 