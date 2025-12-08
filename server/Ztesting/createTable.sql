


use test_db;

drop table if exists stock_t;
drop table if exists transaction_t;
drop table if exists user_t;
drop table if exists item_t;
drop table if exists company_t;

create table company_t(
    id      int AUTO_INCREMENT key,
    name    varchar(1024) unique
);    
create table user_t(
    company_id  int references company_t (id),
    isManager   bool ,
    name        varchar(1024), -- suppose to be unique, but cause virtual bug
    password    binary(40), -- sha1 is 160 bit, but this is hexed so 320 bit
    primary key (company_id,isManager)
);
create table item_t(
    id      int AUTO_INCREMENT Key,
    company_id int references company_t (id),
    name    varchar(256),
    image   longblob default null,
    currentStock   int
    
);
create table stock_t(
    company_id int references company_t (id),
    time    datetime, -- [YYYY-MM-DD hh:mm:ss]
    item_id int references item_t (id), -- on delete restrict 
    stock    int,
    price   int,

    primary key (company_id,time,item_id)
);
create table transaction_t(
    company_id int references company_t (id),
    time    datetime, -- [YYYY-MM-DD hh:mm:ss]
    item_id int references item_t (id), -- on delete restrict
    count   int,

    primary key (company_id,time,item_id)
);
-- show tables;
-- desc company_t;
-- desc user_t;
-- desc item_t;
-- desc transaction_t;
-- desc stock_t;
---------------------------------------------------------




-- mariadb -uroot -proot -t < D:/tugas/3_1/NetworkApp/Final2/Server/server/Ztesting/createTable.sql